import React from 'react';
import { useTranslation } from '../contexts/LanguageContext.tsx';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { t } = useTranslation();
  if (!message) return null;
  return (
    <div className="bg-red-900/70 border border-red-700 text-red-200 px-4 py-3 rounded-md my-4" role="alert">
      <strong className="font-bold">{t('error.prefix')}: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;