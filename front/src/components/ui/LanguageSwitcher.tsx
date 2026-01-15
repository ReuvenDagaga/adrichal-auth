import { useLanguage } from '../../contexts/LanguageContext';

const languages = [
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'he', label: 'עב', fullName: 'עברית' },
];

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center border border-white/20 rounded-sm overflow-hidden" dir="ltr">
      {languages.map((lang, index) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1.5 text-xs tracking-wider transition-colors ${
            language === lang.code
              ? 'bg-gold text-black font-medium'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          } ${index > 0 ? 'border-l border-white/20' : ''}`}
          title={lang.fullName}
          aria-label={`Switch to ${lang.fullName}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
