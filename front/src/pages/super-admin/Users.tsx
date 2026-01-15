import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SuperAdminLayout } from '../../components/admin/SuperAdminLayout';
import { trpc } from '../../lib/trpc';
import { FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

type RoleFilter = 'all' | 'super_admin' | 'admin' | 'tenant_admin';

export default function SuperAdminUsers() {
  const { t } = useTranslation('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  const { data: users, refetch } = trpc.user.list.useQuery();
  const { data: tenants } = trpc.tenant.list.useQuery();

  const updateRoleMutation = trpc.user.updateRole.useMutation({
    onSuccess: () => {
      toast.success(t('superAdmin.users.roleUpdated'));
      refetch();
    },
    onError: () => {
      toast.error(t('superAdmin.users.errors.updateFailed'));
    },
  });

  const deleteMutation = trpc.user.delete.useMutation({
    onSuccess: () => {
      toast.success(t('superAdmin.users.deleted'));
      refetch();
    },
    onError: () => {
      toast.error(t('superAdmin.users.errors.deleteFailed'));
    },
  });

  const handleRoleChange = (userId: string, role: 'admin' | 'super_admin' | 'tenant_admin') => {
    updateRoleMutation.mutate({ userId, role });
  };

  const handleDelete = (userId: string, name: string) => {
    if (confirm(t('superAdmin.users.confirmDelete', { name }))) {
      deleteMutation.mutate({ userId });
    }
  };

  const getTenantName = (tenantId?: string) => {
    if (!tenantId) return t('superAdmin.users.noTenant');
    const tenant = tenants?.find((t) => t._id.toString() === tenantId);
    return tenant?.name ?? t('superAdmin.users.noTenant');
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return '';
    return t(`superAdmin.roles.${role}`, { defaultValue: role });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Calculate role statistics
  const roleStats = useMemo(() => {
    if (!users) return { super_admin: 0, admin: 0, tenant_admin: 0 };

    return users.reduce(
      (acc, user) => {
        if (user.role === 'super_admin') acc.super_admin++;
        else if (user.role === 'admin') acc.admin++;
        else if (user.role === 'tenant_admin') acc.tenant_admin++;
        return acc;
      },
      { super_admin: 0, admin: 0, tenant_admin: 0 }
    );
  }, [users]);

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            {t('superAdmin.users.title')}
          </h1>
          <p className="text-foreground-muted">{t('superAdmin.users.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="admin-card p-4">
            <div className="text-sm text-foreground-muted">{t('superAdmin.stats.totalUsers')}</div>
            <div className="text-2xl font-semibold">{users?.length ?? 0}</div>
          </div>
          <div className="admin-card p-4">
            <div className="text-sm text-foreground-muted">{t('superAdmin.roles.super_admin')}</div>
            <div className="text-2xl font-semibold text-amber-400">{roleStats.super_admin}</div>
          </div>
          <div className="admin-card p-4">
            <div className="text-sm text-foreground-muted">{t('superAdmin.roles.admin')}</div>
            <div className="text-2xl font-semibold text-blue-400">{roleStats.admin}</div>
          </div>
          <div className="admin-card p-4">
            <div className="text-sm text-foreground-muted">{t('superAdmin.roles.tenant_admin')}</div>
            <div className="text-2xl font-semibold text-green-400">{roleStats.tenant_admin}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder={t('superAdmin.users.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input w-full pl-10"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="admin-input"
          >
            <option value="all">{t('superAdmin.users.filterAll')}</option>
            <option value="super_admin">{t('superAdmin.roles.super_admin')}</option>
            <option value="admin">{t('superAdmin.roles.admin')}</option>
            <option value="tenant_admin">{t('superAdmin.roles.tenant_admin')}</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="admin-card overflow-hidden">
          {filteredUsers.length > 0 ? (
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                    {t('superAdmin.users.name')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                    {t('superAdmin.users.email')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                    {t('superAdmin.users.role')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                    {t('superAdmin.users.tenant')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                    {t('superAdmin.users.lastLogin')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-foreground-muted">
                    {t('superAdmin.users.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user._id.toString()} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.picture && (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id.toString(),
                            e.target.value as 'admin' | 'super_admin' | 'tenant_admin'
                          )
                        }
                        className="admin-input text-sm py-1"
                      >
                        <option value="super_admin">{t('superAdmin.roles.super_admin')}</option>
                        <option value="admin">{t('superAdmin.roles.admin')}</option>
                        <option value="tenant_admin">{t('superAdmin.roles.tenant_admin')}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">
                      {getTenantName(user.tenantId?.toString())}
                    </td>
                    <td className="px-6 py-4 text-foreground-muted text-sm">
                      {formatDate(user.lastLoginAt.toString())}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            handleDelete(user._id.toString(), user.name)
                          }
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                          title={t('common.delete')}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-foreground-muted">
              {searchQuery || roleFilter !== 'all'
                ? t('common.noResults')
                : t('superAdmin.users.noUsers')}
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
