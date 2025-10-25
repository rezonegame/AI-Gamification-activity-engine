

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GenerateContentResponse } from '@google/genai';
import PRDInput from './components/PRDInput.tsx';
import PipelineControls from './components/PipelineControls.tsx';
import ProgressDisplay from './components/ProgressDisplay.tsx';
import ErrorMessage from './components/ErrorMessage.tsx';
import LogDisplay from './components/LogDisplay.tsx';
import WorkflowVisualizer from './components/WorkflowVisualizer.tsx';
import { generateDesignPrompt } from './services/geminiService.ts';
import { ASPECT_DETAILS, PIPELINE_STAGES } from './constants/index.ts';
import { AspectId, AspectProgress, PipelineStatus, PipelineStage, ProcessStageStatus } from '../types.ts';
import { useTranslation } from './contexts/LanguageContext.tsx';


declare var JSZip: any;

const PRD_STORAGE_KEY = 'activityEngineUserPrd';
const STATE_STORAGE_KEY = 'activityEngineState';


const App: React.FC = () => {
  const { language, t, setLanguage } = useTranslation();
  
  const [prdText, setPrdText] = useState<string>('');
  const [aspectProgressList, setAspectProgressList] = useState<AspectProgress[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>('idle');
  const [overallError, setOverallError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [isFullAuto, setIsFullAuto] = useState(false);

  const isStoppingRef = useRef(false);
  const prdTextRef = useRef(prdText);
  const resetConfirmTimeoutRef = useRef<number | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => { prdTextRef.current = prdText; }, [prdText]);

  useEffect(() => {
    // This effect handles the auto-save for reset confirmation
    const timerId = resetConfirmTimeoutRef.current;
    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, []);

  const initializeState = useCallback(() => {
    const initialAspects: AspectProgress[] = Object.values(ASPECT_DETAILS).map(detail => ({
      ...detail,
      name: t(detail.nameKey),
      description: detail.descriptionKey ? t(detail.descriptionKey) : undefined,
      status: 'pending' as ProcessStageStatus,
      output: null,
      error: null,
      selected: detail.isCore || false,
      lockedSelection: detail.isCore || false,
    })).sort((a,b) => Object.keys(ASPECT_DETAILS).indexOf(a.id) - Object.keys(ASPECT_DETAILS).indexOf(b.id));
    setAspectProgressList(initialAspects);
  }, [t]);

  // Load state from localStorage on initial mount
  useEffect(() => {
    try {
      const savedPrd = localStorage.getItem(PRD_STORAGE_KEY);
      const savedState = localStorage.getItem(STATE_STORAGE_KEY);

      if (savedPrd) {
        setPrdText(savedPrd);
      }

      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.aspectProgressList && parsedState.aspectProgressList.length > 0) {
           const retranslatedAspects = parsedState.aspectProgressList.map((aspect: AspectProgress) => {
             const details = ASPECT_DETAILS[aspect.id];
             return {
               ...aspect,
               name: details ? t(details.nameKey) : aspect.name,
               description: details && details.descriptionKey ? t(details.descriptionKey) : aspect.description,
             }
           });
           setAspectProgressList(retranslatedAspects);
        } else {
            initializeState();
        }
        if (parsedState.logs) setLogs(parsedState.logs);
      } else {
        initializeState();
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
      initializeState();
    }
    isInitialLoad.current = false;
  }, [initializeState, t]);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialLoad.current) return;
    const stateToSave = {
      aspectProgressList,
      logs,
    };
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(stateToSave));
    localStorage.setItem(PRD_STORAGE_KEY, prdText);
  }, [aspectProgressList, logs, prdText]);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString(language, { hour12: false })} - ${message}`]);
  }, [language]);


 const runPipeline = useCallback(async () => {
    if (pipelineStatus === 'processing') return;

    if (isStoppingRef.current) {
        setPipelineStatus('stopped');
        setIsFullAuto(false);
        return;
    }

    const aspectOrder = Object.keys(ASPECT_DETAILS);
    const nextTask = aspectProgressList
        .filter(a => a.selected && !['completed', 'processing', 'error', 'stopped'].includes(a.status))
        .sort((a, b) => aspectOrder.indexOf(a.id) - aspectOrder.indexOf(b.id))
        .find(task => {
            const currentIndex = aspectOrder.indexOf(task.id);
            if (currentIndex === 0) return true;
            const prerequisites = aspectOrder.slice(0, currentIndex);
            return prerequisites.every(prereqId => {
                const prereqAspect = aspectProgressList.find(a => a.id === prereqId);
                // A prerequisite is met if it was not selected, or if it was completed.
                return !prereqAspect?.selected || prereqAspect?.status === 'completed';
            });
        });

    if (!nextTask) {
        const selectedButNotDone = aspectProgressList.some(a => a.selected && !['completed', 'stopped'].includes(a.status));
        if (!isFullAuto && selectedButNotDone) {
            setOverallError(t('error.prerequisitesNotMet'));
        }
        setPipelineStatus('idle'); // Let useEffect handle completion logic
        return;
    }
    
    setPipelineStatus('processing');
    setOverallError(null);

    setAspectProgressList(current => current.map(p => 
        p.id === nextTask.id ? { ...p, status: 'processing', output: '', error: null } : p
    ));
    addLog(t('log.callingAi', { name: nextTask.name }));

    try {
        const previousOutputs = aspectProgressList
            .filter(p => p.status === 'completed' && p.output)
            .sort((a, b) => aspectOrder.indexOf(a.id) - aspectOrder.indexOf(b.id))
            .map(p => ({ name: p.name, output: p.output! }));
        
        const sources = new Map<string, string>(); // URI -> Title

        await generateDesignPrompt(
            prdTextRef.current,
            previousOutputs,
            nextTask.metaPrompt,
            nextTask.id,
            (chunk: GenerateContentResponse) => {
                const chunkText = chunk.text;
                if (chunkText) {
                    setAspectProgressList(current => current.map(p => 
                        p.id === nextTask.id ? { ...p, output: (p.output || '') + chunkText } : p
                    ));
                }
                const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
                if (groundingChunks) {
                    groundingChunks.forEach((c: any) => {
                       if(c.web && c.web.uri) {
                           sources.set(c.web.uri, c.web.title || c.web.uri);
                       }
                    });
                }
            },
            addLog
        );

        if (sources.size > 0) {
            const sourcesText = '\n\n---\n\n**Sources:**\n\n' + Array.from(sources.entries())
                .map(([uri, title]) => `*   [${title}](${uri})`)
                .join('\n');
    
            setAspectProgressList(current => current.map(p =>
                p.id === nextTask.id ? { ...p, output: (p.output || '') + sourcesText } : p
            ));
        }

        setAspectProgressList(current => current.map(p => 
            p.id === nextTask.id ? { ...p, status: 'completed' } : p
        ));
        addLog(t('log.aiStreamComplete', { name: nextTask.name }));
        setPipelineStatus('idle');
    } catch (e: any) {
        const errorKey = e.message || 'error.unknown';
        const errorMessage = t(errorKey);
        addLog(t('log.aiCallFailed', { name: nextTask.name, error: errorMessage }));
        setAspectProgressList(current => current.map(p =>
            p.id === nextTask.id ? { ...p, status: 'error', error: errorKey } : p
        ));
        setOverallError(t('error.processingFailedHalt', { name: nextTask.name }));
        setPipelineStatus('error');
        setIsFullAuto(false);
    }
}, [aspectProgressList, addLog, t, pipelineStatus, isFullAuto]);


  useEffect(() => {
    if (isInitialLoad.current) return;
    
    if (isFullAuto && pipelineStatus === 'idle') {
        const hasMoreTasks = aspectProgressList.some(a => a.selected && !['completed', 'error', 'stopped'].includes(a.status));
        if (hasMoreTasks) {
            // Introduce a delay to prevent hitting API rate limits, which can cause 429 errors.
            const runTimer = setTimeout(() => {
              runPipeline();
            }, 1500); // 1.5-second delay between calls in full-auto mode.
            
            return () => clearTimeout(runTimer);
        } else {
            setIsFullAuto(false);
            const allSelectedTasksCompleted = aspectProgressList
              .filter(p => p.selected)
              .every(p => p.status === 'completed');

            if (allSelectedTasksCompleted) {
                 addLog(t('log.fullPipelineSuccess'));
                 setPipelineStatus('completed');
            }
        }
    }
  }, [isFullAuto, pipelineStatus, aspectProgressList, runPipeline, addLog, t]);


  const handleStartSelected = () => {
    if (isConfirmingReset) setIsConfirmingReset(false);
    if (prdText.trim() === '') {
        setOverallError(t('error.prdEmpty'));
        return;
    }
    const selectedAspects = aspectProgressList.filter(a => a.selected);
    if (selectedAspects.length === 0) {
        setOverallError(t('error.noAspectsSelected'));
        return;
    }
    const pendingSelectedAspects = selectedAspects.filter(a => a.status !== 'completed');
    if (selectedAspects.length > 0 && pendingSelectedAspects.length === 0) {
        setOverallError(t('error.onlyCompletedSelected'));
        return;
    }

    setIsFullAuto(false);
    isStoppingRef.current = false;
    runPipeline();
  };
  
  const handleStartFullPipeline = () => {
    if (isConfirmingReset) setIsConfirmingReset(false);
    if (prdText.trim() === '') {
        setOverallError(t('error.prdEmpty'));
        return;
    }
    addLog(t('log.fullPipelineStarted'));
    setPipelineStatus('idle');
    setOverallError(null);

    // This action resets and selects all core aspects.
    // Optional steps (like research) are preserved; if the user selected them, they will run.
    setAspectProgressList(current =>
        current.map(aspect => {
            if (aspect.isCore) {
                return {
                    ...aspect,
                    selected: true,
                    status: 'pending' as ProcessStageStatus,
                    output: null,
                    error: null,
                };
            }
            // For optional aspects, preserve their current state and selection.
            return aspect;
        })
    );
    setIsFullAuto(true);
  };

  const handleStop = () => {
    isStoppingRef.current = true;
    addLog(t('log.stopRequested'));
  };

  const handleReset = () => {
    if (isConfirmingReset) {
      if (resetConfirmTimeoutRef.current) {
        window.clearTimeout(resetConfirmTimeoutRef.current);
      }
      localStorage.removeItem(PRD_STORAGE_KEY);
      localStorage.removeItem(STATE_STORAGE_KEY);
      setPrdText('');
      setLogs([]);
      setOverallError(null);
      setPipelineStatus('idle');
      setIsFullAuto(false);
      initializeState();
      setIsConfirmingReset(false);
    } else {
      setIsConfirmingReset(true);
      resetConfirmTimeoutRef.current = window.setTimeout(() => {
        setIsConfirmingReset(false);
      }, 3500);
    }
  };

  const handleToggleAspect = (id: AspectId) => {
    if(isConfirmingReset) setIsConfirmingReset(false);
    setAspectProgressList(current =>
      current.map(aspect =>
        aspect.id === id ? { ...aspect, selected: !aspect.selected } : aspect
      )
    );
  };
  
  const handleSaveEdit = (id: AspectId, newOutput: string) => {
    if(isConfirmingReset) setIsConfirmingReset(false);
    setAspectProgressList(current =>
      current.map(aspect =>
        aspect.id === id ? { ...aspect, output: newOutput, status: 'completed' } : aspect
      )
    );
  };
  
  const handleDownloadAspect = (aspect: AspectProgress) => {
    if (!aspect.output) return;
    const blob = new Blob([aspect.output], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${t('download.mdFilename', { name: aspect.name })}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadAll = () => {
    if(isConfirmingReset) setIsConfirmingReset(false);
    const completedAspects = aspectProgressList.filter(a => (a.status === 'completed' || a.status === 'stale') && a.output);
    if (completedAspects.length === 0) {
        setOverallError(t('error.noCompletedItems'));
        return;
    }
    
    const zip = new JSZip();
    completedAspects.forEach(aspect => {
        zip.file(`${t('download.mdFilename', { name: aspect.name })}.md`, aspect.output!);
    });

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${t('download.zipFilename')}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
  };
  

  const completedAspectsCount = aspectProgressList.filter(a => (a.status === 'completed' || a.status === 'stale') && a.output).length;

  const researchStageId = PIPELINE_STAGES[0];
  const mainStages = PIPELINE_STAGES.slice(1);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            {t('app.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            {t('app.subtitle')}
          </p>
        </header>

        <main className="space-y-8">
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700/60 animate-fade-in-up">
            <PRDInput 
              value={prdText}
              onChange={setPrdText}
              disabled={pipelineStatus === 'processing'}
            />
          </div>

          {/* Optional Research Stage */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700/60 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <ProgressDisplay
              key={researchStageId}
              title={t(`workflow.stage.${researchStageId}.title`)}
              description={t(`workflow.stage.${researchStageId}.description`)}
              aspects={aspectProgressList.filter(a => a.category === researchStageId)}
              onDownloadAspect={handleDownloadAspect}
              onToggleAspect={handleToggleAspect}
              onSaveEdit={handleSaveEdit}
              pipelineStatus={pipelineStatus}
            />
          </div>

          {/* Controls Section */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700/60 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <ErrorMessage message={overallError || ''} />
            <PipelineControls
                pipelineStatus={pipelineStatus}
                onStartSelected={handleStartSelected}
                onStartFullPipeline={handleStartFullPipeline}
                onStop={handleStop}
                onReset={handleReset}
                onDownloadAll={handleDownloadAll}
                canDownloadAll={completedAspectsCount > 0}
                isPrdEmpty={!prdText}
                isConfirmingReset={isConfirmingReset}
            />
          </div>

          {/* Main Pipeline Stages */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700/60 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            {mainStages.map((stageId) => (
                <ProgressDisplay
                  key={stageId}
                  title={t(`workflow.stage.${stageId}.title`)}
                  description={t(`workflow.stage.${stageId}.description`)}
                  aspects={aspectProgressList.filter(a => a.category === stageId)}
                  onDownloadAspect={handleDownloadAspect}
                  onToggleAspect={handleToggleAspect}
                  onSaveEdit={handleSaveEdit}
                  pipelineStatus={pipelineStatus}
                />
            ))}
          </div>
          
          <WorkflowVisualizer aspects={aspectProgressList} />

          <LogDisplay logs={logs} />
          
        </main>
      </div>
    </div>
  );
};

export default App;