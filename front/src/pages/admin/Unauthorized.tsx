import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle } from 'react-icons/fi';

export default function AdminUnauthorized() {
  const { t } = useTranslation('admin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <FiAlertCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
        <h1 className="text-2xl font-semibold mb-2">{t('unauthorized.title')}</h1>
        <p className="text-foreground-muted mb-8">{t('unauthorized.message')}</p>
        <Link to="/" className="btn-outline inline-block">
          {t('unauthorized.backHome')}
        </Link>
      </div>
    </div>
  );
}
