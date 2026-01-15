import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SuperAdminLayout } from '../../components/admin/SuperAdminLayout';
import { trpc } from '../../lib/trpc';
import { FiUsers, FiGrid, FiInfo, FiPieChart } from 'react-icons/fi';

export default function SuperAdminSettings() {
  const { t } = useTranslation('admin');

  const { data: tenants } = trpc.tenant.list.useQuery();
  const { data: users } = trpc.user.list.useQuery();

  // Calculate role statistics
  const roleStats = useMemo(() => {
    if (!users) return { super_admin: 0, admin: 0, tenant_admin: 0, user: 0 };

    return users.reduce(
      (acc, user) => {
        if (user.role === 'super_admin') acc.super_admin++;
        else if (user.role === 'admin') acc.admin++;
        else if (user.role === 'tenant_admin') acc.tenant_admin++;
        else acc.user++;
        return acc;
      },
      { super_admin: 0, admin: 0, tenant_admin: 0, user: 0 }
    );
  }, [users]);

  const activeTenants = tenants?.filter((t) => t.isActive).length ?? 0;

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            {t('superAdmin.settings.title')}
          </h1>
          <p className="text-foreground-muted">{t('superAdmin.settings.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Information */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gold/10 rounded-lg">
                <FiInfo className="w-5 h-5 text-gold" />
              </div>
              <h2 className="text-lg font-medium">
                {t('superAdmin.settings.platformInfo')}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-foreground-muted">
                  {t('superAdmin.settings.platformName')}
                </span>
                <span className="font-medium">Adrichal</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-foreground-muted">
                  {t('superAdmin.settings.version')}
                </span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-foreground-muted">
                  {t('superAdmin.settings.environment')}
                </span>
                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                  Production
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-foreground-muted">
                  {t('superAdmin.settings.apiUrl')}
                </span>
                <span className="font-medium text-sm text-foreground-muted">
                  {window.location.origin}/api
                </span>
              </div>
            </div>
          </div>

          {/* Platform Overview */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FiGrid className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-medium">
                {t('superAdmin.settings.overview')}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-2xl font-semibold">{tenants?.length ?? 0}</div>
                <div className="text-sm text-foreground-muted">
                  {t('superAdmin.settings.totalTenants')}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-green-400">{activeTenants}</div>
                <div className="text-sm text-foreground-muted">
                  {t('superAdmin.stats.activeTenants')}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-2xl font-semibold">{users?.length ?? 0}</div>
                <div className="text-sm text-foreground-muted">
                  {t('superAdmin.settings.totalUsers')}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <Link
                  to="/super-admin/tenants"
                  className="text-gold hover:underline text-sm"
                >
                  {t('superAdmin.tenants.title')} →
                </Link>
              </div>
            </div>
          </div>

          {/* Role Distribution */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <FiPieChart className="w-5 h-5 text-purple-500" />
              </div>
              <h2 className="text-lg font-medium">
                {t('superAdmin.settings.roleDistribution')}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span>{t('superAdmin.settings.superAdmins')}</span>
                </div>
                <span className="font-semibold">{roleStats.super_admin}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-amber-400 h-2 rounded-full"
                  style={{
                    width: `${users?.length ? (roleStats.super_admin / users.length) * 100 : 0}%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>{t('superAdmin.roles.admin')}</span>
                </div>
                <span className="font-semibold">{roleStats.admin}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-400 h-2 rounded-full"
                  style={{
                    width: `${users?.length ? (roleStats.admin / users.length) * 100 : 0}%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>{t('superAdmin.settings.tenantAdmins')}</span>
                </div>
                <span className="font-semibold">{roleStats.tenant_admin}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{
                    width: `${users?.length ? (roleStats.tenant_admin / users.length) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FiUsers className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-lg font-medium">
                {t('superAdmin.users.title')}
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-foreground-muted">
                {t('superAdmin.users.subtitle')}
              </p>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-amber-500/10 p-3 rounded-lg">
                  <div className="text-lg font-semibold text-amber-400">
                    {roleStats.super_admin}
                  </div>
                  <div className="text-xs text-foreground-muted">
                    {t('superAdmin.roles.super_admin')}
                  </div>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <div className="text-lg font-semibold text-blue-400">
                    {roleStats.admin}
                  </div>
                  <div className="text-xs text-foreground-muted">
                    {t('superAdmin.roles.admin')}
                  </div>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <div className="text-lg font-semibold text-green-400">
                    {roleStats.tenant_admin}
                  </div>
                  <div className="text-xs text-foreground-muted">
                    {t('superAdmin.roles.tenant_admin')}
                  </div>
                </div>
              </div>

              <Link
                to="/super-admin/users"
                className="btn-outline w-full text-center block"
              >
                {t('superAdmin.users.title')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
