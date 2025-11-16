import { useState, useEffect, createContext, useContext } from 'react';
import { LanguageCode, translations } from '@/lib/languages';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof translations[LanguageCode];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageState = (defaultLang: LanguageCode = 'en') => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(defaultLang);
  
  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    localStorage.setItem('agrosense-language', lang);
  };

  // Load saved language on initialization
  useEffect(() => {
    const saved = localStorage.getItem('agrosense-language') as LanguageCode;
    if (saved && translations[saved]) {
      setCurrentLanguage(saved);
    }
  }, []);

  return {
    currentLanguage,
    setLanguage,
    t: translations[currentLanguage]
  };
};