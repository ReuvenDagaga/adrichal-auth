import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { t } = useTranslation('admin');
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Show error if redirected with error
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const errorKey = `login.errors.${error}` as const;
      toast.error(t(errorKey) || t('login.errors.unknown'));
    }
  }, [searchParams, t]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      navigate('/admin');
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  const handleGoogleLogin = () => {
    const tenantDomain = window.location.hostname;
    window.location.href = `${
      import.meta.env.VITE_API_URL || ''
    }/api/auth/google?tenant_domain=${tenantDomain}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="admin-card p-8 w-full max-w-md text-center">
        {/* Logo */}
        <h1 className="text-2xl font-semibold text-gold mb-2">ADRICHAL</h1>
        <p className="text-foreground-muted mb-8">{t('login.subtitle')}</p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          <FcGoogle className="w-5 h-5" />
          {t('login.googleButton')}
        </button>

        {/* Back to site link */}
        <a
          href="/"
          className="block mt-6 text-sm text-foreground-muted hover:text-gold transition-colors"
        >
          {t('login.backToSite')}
        </a>
      </div>
    </div>
  );
}
