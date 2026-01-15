import { useLanguage } from '../../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <button
      onClick={() => changeLanguage(language === 'en' ? 'he' : 'en')}
      className="px-3 py-1.5 text-sm border border-white/20 rounded hover:border-gold hover:text-gold transition-colors"
    >
      {language === 'en' ? 'עב' : 'EN'}
    </button>
  );
}
