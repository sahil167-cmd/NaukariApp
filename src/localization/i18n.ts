/**
 * WorkerConnect — i18n Configuration
 * Supports 11 Indian languages with fallback to English.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en.json';
import hi from './translations/hi.json';
import mr from './translations/mr.json';
import gu from './translations/gu.json';
import ta from './translations/ta.json';
import te from './translations/te.json';
import others from './translations/others.json';

const resources = {
  en: { translation: en.en },
  hi: { translation: hi.hi },
  mr: { translation: mr.mr },
  gu: { translation: gu.gu },
  ta: { translation: ta.ta },
  te: { translation: te.te },
  kn: { translation: (others as any).kn },
  ml: { translation: (others as any).ml },
  pa: { translation: (others as any).pa },
  bn: { translation: (others as any).bn },
  or: { translation: (others as any).or },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export default i18n;
