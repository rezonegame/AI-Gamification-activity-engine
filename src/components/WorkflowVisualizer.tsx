


import React from 'react';
import { AspectProgress, ProcessStageStatus } from '../../types';
import { useTranslation } from '../contexts/LanguageContext';
import { PIPELINE_STAGES } from '../constants/index';

interface WorkflowVisualizerProps {
  aspects: AspectProgress[];
}

const NodeIcon: React.FC<{ status: ProcessStageStatus }> = ({ status }) => {
    const iconClass = "h-5 w-5";
    switch (status) {
        case 'pending': return <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'processing': return <svg className={`animate-spin ${iconClass} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
        case 'completed': return <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-white`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
        case 'stale': return <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-white`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>;
        case 'error': return <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-white`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
        default: return <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-gray-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>;
    }
};

const getNodeStatusClass = (status: ProcessStageStatus): string => {
    switch (status) {
        case 'pending': return 'bg-gray-700/80 border-gray-600';
        case 'processing': return 'bg-indigo-600 border-indigo-500';
        case 'completed': return 'bg-green-600 border-green-500';
        case 'stale': return 'bg-yellow-600 border-yellow-500';
        case 'error': return 'bg-red-600 border-red-500';
        case 'stopped':
        case 'cancelled':
        default: return 'bg-gray-800 border-gray-700';
    }
};

const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ aspects }) => {
  const { t } = useTranslation();
  
  const nodesToDisplay = aspects
    .filter(a => a.selected)
    .sort((a,b) => PIPELINE_STAGES.indexOf(a.category) - PIPELINE_STAGES.indexOf(b.category));

  if(nodesToDisplay.length === 0) return null;

  return (
    <div className="w-full my-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-indigo-300 mb-4 text-center">{t('workflow.title')}</h3>
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex items-center space-x-2 min-w-max">
                {nodesToDisplay.map((aspect, index) => {
                    if (!aspect) return null;

                    const statusClass = getNodeStatusClass(aspect.status);

                    return (
                        <React.Fragment key={aspect.id}>
                            <div className="flex flex-col items-center text-center w-32" title={aspect.name}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${statusClass} transition-colors duration-300`}>
                                    <NodeIcon status={aspect.status} />
                                </div>
                                <p className="mt-2 text-xs text-gray-300 truncate w-full px-1">{aspect.name}</p>
                            </div>
                            {index < nodesToDisplay.length - 1 && (
                                <div className="flex-1 h-0.5 bg-gray-600"></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default WorkflowVisualizer;