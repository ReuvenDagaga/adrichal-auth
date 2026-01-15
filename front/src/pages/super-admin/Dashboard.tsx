import { useTranslation } from 'react-i18next';
import { SuperAdminLayout } from '../../components/admin/SuperAdminLayout';
import { trpc } from '../../lib/trpc';
import { FiGrid, FiUsers, FiCheckCircle, FiImage } from 'react-icons/fi';

export default function SuperAdminDashboard() {
  const { t } = useTranslation('admin');
  const { data: tenants } = trpc.tenant.list.useQuery();
  const { data: users } = trpc.user.list.useQuery();

  const activeTenants = tenants?.filter((t) => t.isActive).length ?? 0;

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">{t('superAdmin.title')}</h1>
          <p className="text-foreground-muted">System overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="admin-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gold/10 rounded-lg">
                <FiGrid className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">
                  {t('superAdmin.stats.totalTenants')}
                </p>
                <p className="text-2xl font-semibold">{tenants?.length ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">
                  {t('superAdmin.stats.activeTenants')}
                </p>
                <p className="text-2xl font-semibold">{activeTenants}</p>
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FiUsers className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">
                  {t('superAdmin.stats.totalUsers')}
                </p>
                <p className="text-2xl font-semibold">{users?.length ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <FiImage className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">
                  {t('superAdmin.stats.totalImages')}
                </p>
                <p className="text-2xl font-semibold">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="admin-card p-6">
            <h2 className="text-lg font-medium mb-4">Recent Tenants</h2>
            {tenants && tenants.length > 0 ? (
              <ul className="space-y-3">
                {tenants.slice(0, 5).map((tenant) => (
                  <li
                    key={tenant._id.toString()}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-sm text-foreground-muted">
                        {tenant.primaryDomain}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        tenant.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {tenant.isActive
                        ? t('superAdmin.tenants.active')
                        : t('superAdmin.tenants.inactive')}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground-muted">{t('superAdmin.tenants.noTenants')}</p>
            )}
          </div>

          <div className="admin-card p-6">
            <h2 className="text-lg font-medium mb-4">Recent Users</h2>
            {users && users.length > 0 ? (
              <ul className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <li
                    key={user._id.toString()}
                    className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
                  >
                    {user.picture && (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-foreground-muted">{user.email}</div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-gold/20 text-gold rounded">
                      {user.role}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground-muted">{t('superAdmin.users.noUsers')}</p>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
