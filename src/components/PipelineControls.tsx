

import React from 'react';
import { PipelineStatus } from '../../types.ts';
import { useTranslation } from '../contexts/LanguageContext.tsx';

interface PipelineControlsProps {
  pipelineStatus: PipelineStatus;
  onStartSelected: () => void;
  onStartFullPipeline: () => void;
  onStop: () => void;
  onReset: () => void;
  onDownloadAll: () => void;
  canDownloadAll: boolean;
  isPrdEmpty: boolean;
  isConfirmingReset?: boolean;
}

const ButtonSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const PipelineControls: React.FC<PipelineControlsProps> = ({
  pipelineStatus,
  onStartSelected,
  onStartFullPipeline,
  onStop,
  onReset,
  onDownloadAll,
  canDownloadAll,
  isPrdEmpty,
  isConfirmingReset,
}) => {
  const { t } = useTranslation();
  const isProcessing = pipelineStatus === 'processing';
  
  const resetBtnClass = isConfirmingReset
    ? "w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out"
    : "w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  const resetBtnText = isConfirmingReset ? t('controls.confirmReset') : t('controls.reset');

  return (
    <div className="flex flex-col sm:flex-row items-center flex-wrap gap-3">
      {isProcessing ? (
        <button
          onClick={onStop}
          className="w-full sm:w-auto flex-grow bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out flex items-center justify-center"
        >
          <ButtonSpinner />
          {t('controls.stop')}
        </button>
      ) : (
        <>
          <button
            onClick={onStartFullPipeline}
            disabled={isPrdEmpty}
            className="w-full sm:w-auto flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {t('controls.runFullPipeline')}
          </button>
          <button
            onClick={onStartSelected}
            disabled={isPrdEmpty}
            className="w-full sm:w-auto bg-indigo-500/80 hover:bg-indigo-600/80 text-white font-semibold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {t('controls.runSelected')}
          </button>
        </>
      )}

      <button
        onClick={onReset}
        disabled={isProcessing}
        className={resetBtnClass}
      >
        {resetBtnText}
      </button>

      <button
        onClick={onDownloadAll}
        disabled={!canDownloadAll || isProcessing}
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('controls.downloadAll')}
      </button>
    </div>
  );
};

export default PipelineControls;