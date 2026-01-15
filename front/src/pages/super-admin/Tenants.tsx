import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SuperAdminLayout } from '../../components/admin/SuperAdminLayout';
import { trpc } from '../../lib/trpc';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SuperAdminTenants() {
  const { t } = useTranslation('admin');
  const { data: tenants, refetch } = trpc.tenant.list.useQuery();

  const deleteMutation = trpc.tenant.delete.useMutation({
    onSuccess: () => {
      toast.success(t('superAdmin.tenants.deleted'));
      refetch();
    },
    onError: () => {
      toast.error(t('superAdmin.tenants.errors.deleteFailed'));
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(t('superAdmin.tenants.confirmDelete', { name }))) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              {t('superAdmin.tenants.title')}
            </h1>
            <p className="text-foreground-muted">{t('superAdmin.tenants.subtitle')}</p>
          </div>
          <Link to="/super-admin/tenants/new" className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" />
            {t('superAdmin.tenants.create')}
          </Link>
        </div>

        {/* Tenants Table */}
        <div className="admin-card overflow-hidden">
          {tenants && tenants.length > 0 ? (
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                    {t('superAdmin.tenants.name')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                    {t('superAdmin.tenants.slug')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                    {t('superAdmin.tenants.primaryDomain')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                    {t('superAdmin.tenants.status')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-foreground-muted">
                    {t('superAdmin.tenants.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tenants.map((tenant) => (
                  <tr key={tenant._id.toString()} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-sm text-foreground-muted">
                        {tenant.contactEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">{tenant.slug}</td>
                    <td className="px-6 py-4 text-foreground-muted">
                      {tenant.primaryDomain}
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/super-admin/tenants/${tenant._id}/edit`}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title={t('common.edit')}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(tenant._id.toString(), tenant.name)
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
              {t('superAdmin.tenants.noTenants')}
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
