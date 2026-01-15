import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { trpc } from '../../lib/trpc';
import { FiImage, FiHardDrive } from 'react-icons/fi';

export default function AdminDashboard() {
  const { t } = useTranslation('admin');
  const { user } = useAuth();
  const { data: stats } = trpc.image.stats.useQuery();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">{t('dashboard.title')}</h1>
          <p className="text-foreground-muted">
            {t('dashboard.welcome')}, {user?.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="admin-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gold/10 rounded-lg">
                <FiImage className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">
                  {t('dashboard.stats.totalImages')}
                </p>
                <p className="text-2xl font-semibold">{stats?.count ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gold/10 rounded-lg">
                <FiHardDrive className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">
                  {t('dashboard.stats.storageUsed')}
                </p>
                <p className="text-2xl font-semibold">
                  {formatBytes(stats?.totalBytes ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <a href="/admin/media" className="btn-primary">
              {t('media.upload')}
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
