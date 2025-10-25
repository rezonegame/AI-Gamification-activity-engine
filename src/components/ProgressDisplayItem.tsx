


import React, { useState } from 'react';
import { AspectProgress, PipelineStatus, ProcessStageStatus, AspectId } from '../../types.ts';
import { useTranslation } from '../contexts/LanguageContext.tsx';

interface ProgressDisplayItemProps {
  aspect: AspectProgress;
  onDownload: () => void;
  onToggle: () => void;
  onSaveEdit: (id: AspectId, newOutput: string) => void;
  pipelineStatus: PipelineStatus;
}

const StatusIcon: React.FC<{ status: AspectProgress['status'] }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    case 'processing':
      return (
        <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    case 'completed':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    case 'stale':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.707-10.293a1 1 0 00-1.414-1.414L9 8.586V7a1 1 0 10-2 0v3.586l.293.293a1 1 0 001.414 0L10 9.586l1-1V12a1 1 0 102 0V9.414l-.293-.293z" clipRule="evenodd" />
        </svg>
      );
    case 'error':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    case 'cancelled':
    case 'stopped':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
};


const ProgressDisplayItem: React.FC<ProgressDisplayItemProps> = ({ aspect, onDownload, onToggle, onSaveEdit, pipelineStatus }) => {
  const { t } = useTranslation();
  const [isOutputVisible, setIsOutputVisible] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState(t('progressItem.copy'));
  const [isEditing, setIsEditing] = useState(false);
  const [editedOutput, setEditedOutput] = useState(aspect.output || '');

  const handleCopy = () => {
    if (!aspect.output) return;
    navigator.clipboard.writeText(aspect.output).then(() => {
      setCopyButtonText(t('progressItem.copied'));
      setTimeout(() => setCopyButtonText(t('progressItem.copy')), 2000);
    }).catch(err => {
      console.error('Failed to copy text:', err);
      setCopyButtonText(t('progressItem.copyFailed'));
      setTimeout(() => setCopyButtonText(t('progressItem.copy')), 2000);
    });
  };
  
  const handleEdit = () => {
    setEditedOutput(aspect.output || '');
    setIsEditing(true);
    setIsOutputVisible(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = () => {
    onSaveEdit(aspect.id, editedOutput);
    setIsEditing(false);
  };

  const getStatusBgClass = () => {
    switch (aspect.status) {
      case 'pending': return 'bg-gray-800/50 border-gray-700/80';
      case 'processing': return 'bg-blue-900/50 border-blue-700';
      case 'completed': return 'bg-green-900/50 border-green-700';
      case 'stale': return 'bg-yellow-900/40 border-yellow-700/80';
      case 'error': return 'bg-red-900/60 border-red-700';
      case 'cancelled':
      case 'stopped': return 'bg-yellow-900/50 border-yellow-700 opacity-80';
      default: return 'bg-gray-700 border-gray-600';
    }
  };
  
  const isCheckboxDisabled = pipelineStatus === 'processing';

  const statusTextMap: Record<ProcessStageStatus, string> = {
    pending: t('status.pending'),
    processing: t('status.processing'),
    completed: t('status.completed'),
    error: t('status.error'),
    cancelled: t('status.cancelled'),
    stopped: t('status.stopped'),
    stale: t('status.stale'),
  };
  const currentStatusText = statusTextMap[aspect.status] || t('status.unknown');
  
  const isProcessingWithOutput = aspect.status === 'processing' && !!aspect.output;
  const isCompletedWithOutput = (aspect.status === 'completed' || aspect.status === 'stale') && !!aspect.output;
  const canDownload = isCompletedWithOutput;
  const downloadButtonText = t('progressItem.download');
  
  const titleColorClass = (aspect.status === 'completed' || aspect.status === 'stale') ? 'text-gray-200' 
    : 'text-indigo-300';

  return (
    <div className={`p-4 rounded-lg shadow-lg border ${getStatusBgClass()} transition-all duration-300 ease-in-out flex items-start space-x-4`}>
      <div className="flex-shrink-0 pt-1">
        <input
          type="checkbox"
          checked={aspect.selected}
          onChange={onToggle}
          disabled={isCheckboxDisabled}
          className="h-6 w-6 rounded bg-gray-700 border-gray-600 text-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('progressItem.aria.select', { name: aspect.name })}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-1.5">
                <h4 className={`text-md font-semibold truncate ${titleColorClass}`} title={aspect.name}>{aspect.name}</h4>
              </div>
              {aspect.description && (
                <p className="text-xs text-gray-400 mb-1.5">{aspect.description}</p>
              )}
              <div className="flex items-center space-x-2">
                <StatusIcon status={aspect.status} />
                <p className="text-xs text-gray-300">{currentStatusText}</p>
              </div>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center space-x-2">
                {isCompletedWithOutput && !isEditing && (
                 <button
                    onClick={() => setIsOutputVisible(!isOutputVisible)}
                    className="bg-gray-700/50 hover:bg-gray-700 text-indigo-300 hover:text-indigo-200 text-xs font-medium py-1.5 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={t('progressItem.aria.toggleOutput', { name: aspect.name })}
                  >
                    {isOutputVisible ? t('progressItem.hide') : t('progressItem.show')}
                  </button>
              )}
              {canDownload && !isEditing && (
                <button
                  onClick={onDownload}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 px-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t('progressItem.aria.download', { name: aspect.name })}
                >
                  {downloadButtonText}
                </button>
              )}
               {isCompletedWithOutput && !isEditing && (
                <button
                  onClick={handleEdit}
                  className="bg-blue-600/80 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t('progressItem.edit')}
                >
                  {t('progressItem.edit')}
                </button>
              )}
            </div>
        </div>
        
        {aspect.status === 'error' && aspect.error && (
            <div className="mt-2.5 text-xs text-red-300 bg-red-800/50 p-3 rounded-md w-full">
              <strong>{t('error.details')}:</strong> {t(aspect.error) || aspect.error}
            </div>
        )}
       
        {(isProcessingWithOutput || (isCompletedWithOutput && isOutputVisible)) && (
          <div className="mt-4 w-full bg-gray-900/70 p-4 rounded-lg border border-gray-700 relative">
            {isCompletedWithOutput && !isEditing && (
                <button
                onClick={handleCopy}
                aria-label={t('progressItem.aria.copy', { name: aspect.name })}
                className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium py-1 px-2.5 rounded-md transition duration-150 z-10"
                >
                {copyButtonText}
                </button>
            )}
            { isEditing ? (
              <div className="flex flex-col">
                <textarea
                  value={editedOutput}
                  onChange={(e) => setEditedOutput(e.target.value)}
                  className="text-sm text-gray-200 whitespace-pre-wrap font-mono bg-gray-900 rounded-md p-2 border border-indigo-500 focus:ring-1 focus:ring-indigo-400 focus:outline-none w-full min-h-[24rem]"
                  rows={20}
                />
                <div className="flex items-center justify-end space-x-2 mt-3">
                    <button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-500 text-white text-xs font-medium py-1.5 px-4 rounded-md">{t('progressItem.cancel')}</button>
                    <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium py-1.5 px-4 rounded-md">{t('progressItem.save')}</button>
                </div>
              </div>
            ) : (
                <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono overflow-x-auto max-h-96">
                  <code>{aspect.output}</code>
                </pre>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProgressDisplayItem;