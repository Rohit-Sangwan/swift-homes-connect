
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';
type AppLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te';

interface SystemSettingsContextType {
  darkMode: boolean;
  fontSize: string;
  language: AppLanguage;
  setDarkMode: (value: boolean) => void;
  setFontSize: (value: string) => void;
  setLanguage: (value: AppLanguage) => void;
}

const defaultSettings: Omit<SystemSettingsContextType, 'setDarkMode' | 'setFontSize' | 'setLanguage'> = {
  darkMode: false,
  fontSize: 'medium',
  language: 'en',
};

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export const SystemSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : defaultSettings.darkMode;
  });
  
  const [fontSize, setFontSize] = useState<string>(() => {
    const saved = localStorage.getItem('fontSize');
    return saved || defaultSettings.fontSize;
  });
  
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('language');
    return (saved as AppLanguage) || defaultSettings.language;
  });
  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    
    // Apply font size to the root element
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    
    document.documentElement.style.fontSize = fontSizeMap[fontSize as keyof typeof fontSizeMap] || '16px';
  }, [fontSize]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  return (
    <SystemSettingsContext.Provider 
      value={{ 
        darkMode, 
        fontSize, 
        language,
        setDarkMode, 
        setFontSize, 
        setLanguage
      }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
};

export const useSystemSettings = () => {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
};
