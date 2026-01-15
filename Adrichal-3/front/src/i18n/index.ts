import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import enUi from './locales/en/ui.json';
import enAdmin from './locales/en/admin.json';

// Hebrew translations
import heUi from './locales/he/ui.json';
import heAdmin from './locales/he/admin.json';

const resources = {
  en: {
    ui: enUi,
    admin: enAdmin,
  },
  he: {
    ui: heUi,
    admin: heAdmin,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'ui',
    ns: ['ui', 'admin'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
  });

// Set initial RTL
document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language;

// Update RTL on language change
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  localStorage.setItem('language', lng);
});

export default i18n;
