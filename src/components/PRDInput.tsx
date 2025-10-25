import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface PRDInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const PRDInput: React.FC<PRDInputProps> = ({ value, onChange, disabled }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <label htmlFor="prdInput" className="block text-lg font-semibold text-indigo-300 mb-2">
        {t('prdInput.label')}
      </label>
      <textarea
        id="prdInput"
        rows={15}
        className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={t('prdInput.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <p className="mt-2 text-xs text-gray-400">
        {t('prdInput.description')}
      </p>
    </div>
  );
};

export default PRDInput;
