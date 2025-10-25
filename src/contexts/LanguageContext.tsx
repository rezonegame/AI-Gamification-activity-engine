import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import * as i18n from '../i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: 'en' | 'zh') => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(i18n.getLanguage());

  const setLanguage = useCallback((lang: 'en' | 'zh') => {
    i18n.setLanguage(lang);
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
    return i18n.t(key, options);
  }, [language]);
  
  useEffect(() => {
    const handleStaticLanguageChange = (event: Event) => {
        const customEvent = event as CustomEvent<string>;
        if (customEvent.detail !== language) {
            setLanguageState(customEvent.detail);
        }
    };
    
    window.addEventListener('languageChanged', handleStaticLanguageChange);
    return () => {
        window.removeEventListener('languageChanged', handleStaticLanguageChange);
    };
  }, [language]);


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
