
import React from 'react';
import { ProjectType } from '../../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ProjectTypeSelectorProps {
  onSelectProjectType: (type: ProjectType) => void;
}

const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({ onSelectProjectType }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-indigo-300 mb-2">
        {t('projectTypeSelector.title')}
      </h2>
      <p className="text-center text-gray-400 mb-8">
        {t('projectTypeSelector.subtitle')}
      </p>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Card 1: App-based Project */}
        <div
          onClick={() => onSelectProjectType('app')}
          className="flex-1 bg-gray-800 p-8 rounded-lg border-2 border-gray-700 hover:border-indigo-500 hover:bg-gray-800/80 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500/20 text-indigo-300 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white text-center mb-2">
            {t('projectTypeSelector.app.title')}
          </h3>
          <p className="text-gray-400 text-center text-sm">
            {t('projectTypeSelector.app.description')}
          </p>
        </div>

        {/* Card 2: Physical/Offline Project */}
        <div
          onClick={() => onSelectProjectType('physical')}
          className="flex-1 bg-gray-800 p-8 rounded-lg border-2 border-gray-700 hover:border-indigo-500 hover:bg-gray-800/80 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500/20 text-indigo-300 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white text-center mb-2">
            {t('projectTypeSelector.physical.title')}
          </h3>
          <p className="text-gray-400 text-center text-sm">
            {t('projectTypeSelector.physical.description')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectTypeSelector;
