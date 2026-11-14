import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../locales/dictionary';

interface BilingualTextProps {
  /** English source text (also used as translation key) */
  en: string;
  /** Optional pre-computed Hindi override */
  hi?: string;
  /** Optional pre-computed Marathi override */
  mr?: string;
  className?: string;
  subClassName?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'li' | 'label';
}

/**
 * BilingualText — renders primary text in the active language.
 * In dual-mode (bilingual subtext), displays primary text + a small subtext line in the secondary language.
 *
 * Language rules:
 *  - language='en', isDualMode=false → shows English
 *  - language='hi', isDualMode=false → shows Hindi
 *  - language='mr', isDualMode=false → shows Marathi
 *  - language='en', isDualMode=true, subtextLang='hi' → English primary + Hindi subtext
 *  - language='en', isDualMode=true, subtextLang='mr' → English primary + Marathi subtext
 *  - language='hi', isDualMode=true, subtextLang='en' → Hindi primary + English subtext
 *  - language='mr', isDualMode=true, subtextLang='hi' → Marathi primary + Hindi subtext
 */
export default function BilingualText({
  en,
  hi,
  mr,
  className = '',
  subClassName = 'text-[0.72em] opacity-60 font-normal leading-snug tracking-wide mt-0.5',
  as: Component = 'span',
}: BilingualTextProps) {
  const { language, isDualMode, subtextLang, translateToMarathi } = useLanguage();

  // Resolve translations for each language
  const hiText = hi || translateText(en);
  const mrText = mr || translateToMarathi(en);

  const getPrimary = () => {
    if (language === 'hi') return hiText || en;
    if (language === 'mr') return mrText || en;
    return en;
  };

  const getSubtext = (): string | null => {
    if (!isDualMode || !subtextLang || subtextLang === language) return null;
    if (subtextLang === 'hi') return hiText && hiText !== en ? hiText : null;
    if (subtextLang === 'mr') return mrText && mrText !== en ? mrText : null;
    if (subtextLang === 'en') return en;
    return null;
  };

  const primary = getPrimary();
  const sub = getSubtext();

  if (!sub) {
    return <Component className={className}>{primary}</Component>;
  }

  return (
    <Component className={`inline-flex flex-col leading-tight ${className}`}>
      <span className="font-medium">{primary}</span>
      <span className={subClassName}>{sub}</span>
    </Component>
  );
}

/**
 * Lightweight inline variant for use inside headings / buttons.
 */
export function BT({
  en,
  hi,
  mr,
  className = '',
}: {
  en: string;
  hi?: string;
  mr?: string;
  className?: string;
}) {
  return (
    <BilingualText en={en} hi={hi} mr={mr} className={className} as="span" />
  );
}