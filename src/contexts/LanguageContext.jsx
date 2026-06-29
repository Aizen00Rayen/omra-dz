import { createContext, useContext, useState } from 'react';
import { ar } from '../translations/ar';
import { fr } from '../translations/fr';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ar');

  const t = lang === 'ar' ? ar : fr;
  const isRTL = lang === 'ar';

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'fr' : 'ar';
    setLang(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider value={{ lang, t, isRTL, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
};
