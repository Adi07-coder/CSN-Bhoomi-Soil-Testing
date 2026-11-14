import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// English Translation Namespaces
import enCommon from '../locales/en/common.json';
import enFarm from '../locales/en/farm.json';
import enSoil from '../locales/en/soil.json';
import enCrops from '../locales/en/crops.json';
import enFertilizers from '../locales/en/fertilizers.json';
import enReports from '../locales/en/reports.json';

// Hindi Translation Namespaces
import hiCommon from '../locales/hi/common.json';
import hiFarm from '../locales/hi/farm.json';
import hiSoil from '../locales/hi/soil.json';
import hiCrops from '../locales/hi/crops.json';
import hiFertilizers from '../locales/hi/fertilizers.json';
import hiReports from '../locales/hi/reports.json';

// Marathi Translation Namespaces
import mrCommon from '../locales/mr/common.json';
import mrFarm from '../locales/mr/farm.json';
import mrSoil from '../locales/mr/soil.json';
import mrCrops from '../locales/mr/crops.json';
import mrFertilizers from '../locales/mr/fertilizers.json';
import mrReports from '../locales/mr/reports.json';

import { PRELOADED_DICTIONARY, translateText } from '../locales/dictionary';

export type Language = 'en' | 'hi' | 'mr';

// Marathi dictionary (static fallback phrases)
const MARATHI_DICTIONARY: Record<string, string> = {
  'Dashboard': 'डॅशबोर्ड',
  'Farm Agent & Map': 'शेत नकाशा व मॅपिंग',
  'Soil Analysis': 'मृदा चाचणी',
  'Satellite View': 'उपग्रह दृश्य',
  'ML Ops & Retraining': 'एमएल मॉडेल व पुनर्प्रशिक्षण',
  'Recommendations': 'पीक व खत शिफारसी',
  'Reports': 'सल्लागार अहवाल',
  'Profile': 'माझी प्रोफाइल',
  'Sign Out': 'बाहेर पडा',
  'Sign In': 'आत या',
  'Get Started': 'सुरू करा',
  'Save': 'जतन करा',
  'Cancel': 'रद्द करा',
  'Close': 'बंद करा',
  'Delete': 'हटवा',
  'Edit': 'संपादित करा',
  'Submit': 'सादर करा',
  'Loading...': 'प्रक्रिया सुरू आहे...',
  'Refresh': 'ताजे करा',
  'Download': 'डाउनलोड करा',
  'Back': 'मागे जा',
  'Next': 'पुढे जा',
  'Search': 'शोधा',
  'Analyze Field': 'शेत विश्लेषण करा',
  'Total Registered Farms': 'नोंदणीकृत शेते',
  'Monitored Land Area': 'निरीक्षणाखालील एकूण क्षेत्र',
  'Average Soil Fertility': 'सरासरी मृदा सुपीकता निर्देशांक',
  'Active Advisories': 'सक्रिय कृषी सल्ले',
  'Map New Farm': 'नवीन शेत नोंदवा',
  'Analyze Field Soil': 'मृदा विश्लेषण करा',
  'View Crop Advisory': 'पीक शिफारसी पहा',
  'Generate Report Dossier': 'सल्लागार अहवाल तयार करा',
  'CSN Bhoomi': 'एआय भूमी',
  'Soil Intelligence Platform': 'मृदा बुद्धिमत्ता व्यासपीठ',
  'Farming Assistant': 'कृषी सहाय्यक',
  'Soil Analysis Agent': 'मृदा विश्लेषण प्रतिनिधी',
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isDualMode: boolean;
  setIsDualMode: (val: boolean) => void;
  subtextLang: Language | null; // which language to show as subtext
  setSubtextLang: (lang: Language | null) => void;
  t: (key: string, fallback?: string) => string;
  tSub: (key: string, fallback?: string) => string | null; // subtext translation
  tCrop: (cropName: string) => string;
  tSeason: (season: string) => string;
  tStatus: (status: string) => string;
  tProvenance: (status: string) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string | number) => string;
  translateText: (text: string) => string;
  translateToMarathi: (text: string) => string;
}

const resources: Record<Language, Record<string, any>> = {
  en: {
    common: enCommon,
    farm: enFarm,
    soil: enSoil,
    crops: enCrops,
    fertilizers: enFertilizers,
    reports: enReports,
  },
  hi: {
    common: hiCommon,
    farm: hiFarm,
    soil: hiSoil,
    crops: hiCrops,
    fertilizers: hiFertilizers,
    reports: hiReports,
  },
  mr: {
    common: mrCommon,
    farm: mrFarm,
    soil: mrSoil,
    crops: mrCrops,
    fertilizers: mrFertilizers,
    reports: mrReports,
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'aibhoomi_language';
const STORAGE_DUAL_KEY = 'aibhoomi_dual_mode';
const STORAGE_SUBTEXT_LANG_KEY = 'aibhoomi_subtext_lang';

function getVal(obj: any, p: string): string | undefined {
  const parts = p.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr && typeof curr === 'object' && part in curr) {
      curr = curr[part];
    } else {
      return undefined;
    }
  }
  return typeof curr === 'string' ? curr : undefined;
}

function lookupTranslation(lang: Language, key: string, fallback?: string): string {
  // Direct dictionary lookup
  if (lang === 'hi' && PRELOADED_DICTIONARY[key]) return PRELOADED_DICTIONARY[key];
  if (lang === 'mr' && MARATHI_DICTIONARY[key]) return MARATHI_DICTIONARY[key];

  let ns = 'common';
  let path = key;
  const firstDot = key.indexOf('.');
  if (firstDot > 0) {
    const potentialNs = key.substring(0, firstDot);
    if (resources[lang][potentialNs]) {
      ns = potentialNs;
      path = key.substring(firstDot + 1);
    }
  }

  let result = getVal(resources[lang][ns], path);
  if (!result && ns !== 'common') result = getVal(resources[lang].common, key);
  if (!result && lang !== 'en') {
    result = getVal(resources.en[ns], path) || getVal(resources.en.common, key);
  }

  if (!result) {
    if (lang === 'hi') return translateText(fallback || key);
    if (lang === 'mr') return MARATHI_DICTIONARY[fallback || key] || (fallback || key);
    return fallback || key;
  }
  return result;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'hi' || saved === 'en' || saved === 'mr') return saved as Language;
    } catch { /* ignore */ }
    return 'en';
  });

  const [isDualMode, setIsDualModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_DUAL_KEY) === 'true';
    } catch { return false; }
  });

  // subtextLang: which language to show as subtext (null = off, auto-computed when isDualMode)
  const [subtextLang, setSubtextLangState] = useState<Language | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SUBTEXT_LANG_KEY);
      if (saved === 'hi' || saved === 'mr' || saved === 'en') return saved as Language;
    } catch { /* ignore */ }
    return null;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
      document.documentElement.lang = lang;
    } catch { /* ignore */ }
  }, []);

  const setIsDualMode = useCallback((val: boolean) => {
    setIsDualModeState(val);
    try {
      localStorage.setItem(STORAGE_DUAL_KEY, val ? 'true' : 'false');
    } catch { /* ignore */ }
  }, []);

  const setSubtextLang = useCallback((lang: Language | null) => {
    setSubtextLangState(lang);
    try {
      if (lang) localStorage.setItem(STORAGE_SUBTEXT_LANG_KEY, lang);
      else localStorage.removeItem(STORAGE_SUBTEXT_LANG_KEY);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { document.documentElement.lang = language; } catch { /* ignore */ }
  }, [language]);

  // When dual mode is on and no subtextLang set, auto-compute the best secondary language
  useEffect(() => {
    if (isDualMode && !subtextLang) {
      // Default subtext: if main=en show hi; if main=hi show en; if main=mr show hi
      if (language === 'en') setSubtextLang('hi');
      else if (language === 'hi') setSubtextLang('en');
      else setSubtextLang('hi');
    }
  }, [isDualMode, language, subtextLang, setSubtextLang]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (!key) return '';
      return lookupTranslation(language, key, fallback);
    },
    [language]
  );

  // tSub: returns subtext translation (secondary language), or null if dual mode is off
  const tSub = useCallback(
    (key: string, fallback?: string): string | null => {
      if (!isDualMode || !subtextLang || subtextLang === language) return null;
      if (!key) return null;
      return lookupTranslation(subtextLang, key, fallback);
    },
    [isDualMode, subtextLang, language]
  );

  const tCrop = useCallback((cropName: string): string => {
    if (!cropName) return '';
    if (language === 'hi') return translateText(cropName);
    if (language === 'mr') return MARATHI_DICTIONARY[cropName] || cropName;
    return cropName;
  }, [language]);

  const tSeason = useCallback((season: string): string => {
    if (!season) return '';
    if (language === 'hi') return translateText(season);
    if (language === 'mr') return MARATHI_DICTIONARY[season] || season;
    return season;
  }, [language]);

  const tStatus = useCallback((status: string): string => {
    if (!status) return '';
    if (language === 'hi') return translateText(status);
    if (language === 'mr') return MARATHI_DICTIONARY[status] || status;
    return status;
  }, [language]);

  const tProvenance = useCallback((status: string): string => {
    if (!status) return '';
    if (language === 'hi') return translateText(status);
    if (language === 'mr') return MARATHI_DICTIONARY[status] || status;
    return status;
  }, [language]);

  const translateToMarathi = useCallback((text: string): string => {
    return MARATHI_DICTIONARY[text] || text;
  }, []);

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions): string => {
      const locale = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      try { return new Intl.NumberFormat(locale, options).format(value); }
      catch { return value.toString(); }
    },
    [language]
  );

  const formatDate = useCallback(
    (date: Date | string | number): string => {
      const locale = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      try {
        return new Intl.DateTimeFormat(locale, {
          day: 'numeric', month: 'short', year: 'numeric',
        }).format(new Date(date));
      } catch { return String(date); }
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      isDualMode,
      setIsDualMode,
      subtextLang,
      setSubtextLang,
      t,
      tSub,
      tCrop,
      tSeason,
      tStatus,
      tProvenance,
      formatNumber,
      formatDate,
      translateText,
      translateToMarathi,
    }),
    [language, setLanguage, isDualMode, setIsDualMode, subtextLang, setSubtextLang,
     t, tSub, tCrop, tSeason, tStatus, tProvenance, formatNumber, formatDate, translateToMarathi]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}

export function useTranslation() {
  return useLanguage();
}
