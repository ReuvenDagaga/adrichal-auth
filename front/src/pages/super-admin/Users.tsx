import { useTranslation } from 'react-i18next';
import { SuperAdminLayout } from '../../components/admin/SuperAdminLayout';
import { trpc } from '../../lib/trpc';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SuperAdminUsers() {
  const { t } = useTranslation('admin');
  const { data: users, refetch } = trpc.user.list.useQuery();
  const { data: tenants } = trpc.tenant.list.useQuery();

  const updateRoleMutation = trpc.user.updateRole.useMutation({
    onSuccess: () => {
      toast.success(t('superAdmin.users.roleUpdated'));
      refetch();
    },
    onError: () => {
      toast.error('Failed to update role');
    },
  });

  const deleteMutation = trpc.user.delete.useMutation({
    onSuccess: () => {
      toast.success(t('superAdmin.users.deleted'));
      refetch();
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });

  const handleRoleChange = (userId: string, role: 'admin' | 'super_admin') => {
    updateRoleMutation.mutate({ userId, role });
  };

  const handleDelete = (userId: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate({ userId });
    }
  };

  const getTenantName = (tenantId?: string) => {
    if (!tenantId) return '-';
    const tenant = tenants?.find((t) => t._id.toString() === tenantId);
    return tenant?.name ?? '-';
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

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            {t('superAdmin.users.title')}
          </h1>
          <p className="text-foreground-muted">Manage all users in the system</p>
        </div>

        {/* Users Table */}
        <div className="admin-card overflow-hidden">
          {users && users.length > 0 ? (
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
                {users.map((user) => (
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
                            e.target.value as 'admin' | 'super_admin'
                          )
                        }
                        className="admin-input text-sm py-1"
                      >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
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
              {t('superAdmin.users.noUsers')}
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
