import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { FiHome, FiUsers, FiGrid, FiLogOut, FiArrowLeft, FiSettings } from 'react-icons/fi';
import type { ReactNode } from 'react';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const { t } = useTranslation('admin');
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/super-admin', label: t('sidebar.dashboard'), icon: FiHome },
    { path: '/super-admin/tenants', label: t('superAdmin.tenants.title'), icon: FiGrid },
    { path: '/super-admin/users', label: t('superAdmin.users.title'), icon: FiUsers },
    { path: '/super-admin/settings', label: t('superAdmin.settings.title'), icon: FiSettings },
  ];

  const getRoleLabel = (role?: string) => {
    if (!role) return '';
    return t(`superAdmin.roles.${role}`, { defaultValue: role });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="admin-layout flex">
      {/* Sidebar */}
      <aside className="admin-sidebar w-64 min-h-screen p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-2">
          <Link to="/" className="text-xl font-semibold text-gold">
            ADRICHAL
          </Link>
          <div className="text-xs text-foreground-muted mt-1">
            {t('superAdmin.title')}
          </div>
        </div>

        {/* Back to Admin */}
        <Link
          to="/admin"
          className="flex items-center gap-2 text-sm text-foreground-muted hover:text-gold mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          {t('sidebar.backToAdmin')}
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
          {user?.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-gold">{getRoleLabel(user?.role)}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-gold/10 text-gold'
                  : 'text-foreground-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <LanguageSwitcher />
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-foreground-muted hover:text-red-400 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            {t('sidebar.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
