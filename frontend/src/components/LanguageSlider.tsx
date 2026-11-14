import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { Globe, ChevronDown, AlignLeft } from 'lucide-react';

const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'EN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

const SUBTEXT_OPTIONS: { from: Language; to: Language; label: string }[] = [
  { from: 'en', to: 'hi', label: 'EN + हिन्दी' },
  { from: 'en', to: 'mr', label: 'EN + मराठी' },
  { from: 'hi', to: 'en', label: 'हिन्दी + EN' },
  { from: 'hi', to: 'mr', label: 'हिन्दी + मराठी' },
  { from: 'mr', to: 'hi', label: 'मराठी + हिन्दी' },
  { from: 'mr', to: 'en', label: 'मराठी + EN' },
];

export default function LanguageSlider() {
  const { language, setLanguage, isDualMode, setIsDualMode, subtextLang, setSubtextLang, t } = useLanguage();
  const [showSubtextMenu, setShowSubtextMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowSubtextMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLangIdx = LANGUAGES.findIndex(l => l.code === language);

  const handleLangSelect = (code: Language) => {
    setLanguage(code);
    // Auto-update subtextLang when primary language changes to avoid conflict
    if (isDualMode && subtextLang === code) {
      if (code === 'en') setSubtextLang('hi');
      else if (code === 'hi') setSubtextLang('en');
      else setSubtextLang('hi');
    }
  };

  const validSubtextOptions = SUBTEXT_OPTIONS.filter(o => o.from === language);

  const activeSubtextOption = isDualMode && subtextLang
    ? SUBTEXT_OPTIONS.find(o => o.from === language && o.to === subtextLang)
    : null;

  const handleToggleDualMode = () => {
    const next = !isDualMode;
    setIsDualMode(next);
    if (next && !subtextLang) {
      // Set smart default
      if (language === 'en') setSubtextLang('hi');
      else if (language === 'hi') setSubtextLang('en');
      else setSubtextLang('hi');
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* ── 3-Language Pill ── */}
      <div
        className="relative flex items-center bg-gray-100 p-0.5 rounded-full border border-gray-200 shadow-2xs select-none"
        role="group"
        aria-label="Language selection"
      >
        {/* Sliding highlight */}
        <div
          className="absolute top-0.5 bottom-0.5 bg-brand-600 rounded-full shadow-xs transition-all duration-300 ease-out"
          style={{
            width: '54px',
            left: `calc(${currentLangIdx} * 56px + 2px)`,
          }}
        />

        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleLangSelect(lang.code)}
            className={`relative z-10 w-[54px] py-1 text-[11px] font-semibold rounded-full flex items-center justify-center gap-0.5 transition-colors duration-200 cursor-pointer ${
              language === lang.code ? 'text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            title={`Switch to ${lang.label}`}
            aria-pressed={language === lang.code}
          >
            {lang.code === 'en' && (
              <Globe className={`w-3 h-3 shrink-0 ${language === 'en' ? 'text-white' : 'text-gray-400'}`} />
            )}
            <span>{lang.nativeLabel}</span>
          </button>
        ))}
      </div>

      {/* ── Bilingual Subtext Toggle ── */}
      <div className="relative hidden lg:block" ref={menuRef}>
        <button
          type="button"
          onClick={handleToggleDualMode}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full border transition-all cursor-pointer ${
            isDualMode
              ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold shadow-2xs'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
          title={isDualMode ? 'Turn off bilingual subtext' : 'Enable bilingual subtext mode'}
        >
          <AlignLeft className="w-3 h-3" />
          <span className={`w-2 h-2 rounded-full ${isDualMode ? 'bg-brand-600 animate-pulse' : 'bg-gray-300'}`} />
          <span>
            {activeSubtextOption ? activeSubtextOption.label : 'Subtext'}
          </span>
        </button>

        {/* Subtext language selector dropdown — only shows when dual mode is on */}
        {isDualMode && validSubtextOptions.length > 0 && (
          <button
            type="button"
            onClick={() => setShowSubtextMenu(v => !v)}
            className="ml-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-100 hover:bg-brand-200 text-brand-700 border border-brand-200 transition-colors cursor-pointer"
            title="Change subtext language"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${showSubtextMenu ? 'rotate-180' : ''}`} />
          </button>
        )}

        {showSubtextMenu && (
          <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[140px] py-1 overflow-hidden">
            <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              {t('languages.subtextLanguage', 'Subtext Language')}
            </p>
            {validSubtextOptions.map((opt) => (
              <button
                key={`${opt.from}-${opt.to}`}
                type="button"
                onClick={() => {
                  setSubtextLang(opt.to);
                  setShowSubtextMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-brand-50 transition-colors cursor-pointer ${
                  subtextLang === opt.to ? 'text-brand-700 font-semibold bg-brand-50' : 'text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-1 pt-1 px-3 pb-1">
              <button
                type="button"
                onClick={() => { setIsDualMode(false); setShowSubtextMenu(false); }}
                className="text-[11px] text-red-500 hover:text-red-700 cursor-pointer transition-colors"
              >
                {t('languages.turnOffSubtext', 'Turn off subtext')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
