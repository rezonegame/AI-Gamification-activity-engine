import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../contexts/LanguageContext.tsx';

interface LogDisplayProps {
  logs: string[];
}

const LogDisplay: React.FC<LogDisplayProps> = ({ logs }) => {
  const { t } = useTranslation();
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColorClass = (log: string): string => {
    const lowerLog = log.toLowerCase();
    if (lowerLog.includes('error') || lowerLog.includes('failed') || lowerLog.includes('错误') || lowerLog.includes('失败')) {
      return 'text-red-400';
    }
    if (lowerLog.includes('successfully') || lowerLog.includes('finished') || lowerLog.includes('成功') || lowerLog.includes('完成')) {
      return 'text-green-400';
    }
    if (lowerLog.includes('stop') || lowerLog.includes('thinking deeply') || lowerLog.includes('停止') ) {
      return 'text-yellow-400';
    }
    return 'text-gray-300';
  };

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-indigo-300 mb-2">{t('logs.title')}</h3>
      <div
        ref={logContainerRef}
        className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 h-48 overflow-y-auto text-sm font-mono"
        aria-live="polite"
        aria-atomic="true"
      >
        {logs.map((log, index) => (
          <p key={index} className={`whitespace-pre-wrap leading-relaxed ${getLogColorClass(log)}`}>
            {log}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LogDisplay;