import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { MultiImageUpload } from '../../components/admin/MultiImageUpload';
import { trpc } from '../../lib/trpc';
import { FiTrash2, FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

type Folder = 'projects' | 'blog' | 'general' | 'gallery';

export default function MediaLibrary() {
  const { t } = useTranslation('admin');
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>();
  const [uploadFolder, setUploadFolder] = useState<Folder>('general');
  const [showMultiUpload, setShowMultiUpload] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, refetch } = trpc.upload.getImages.useQuery({
    folder: selectedFolder,
    limit: 100,
  });

  const deleteMutation = trpc.upload.deleteImage.useMutation({
    onSuccess: () => {
      toast.success('Image deleted');
      refetch();
    },
    onError: () => {
      toast.error('Failed to delete image');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(t('media.confirmDelete'))) {
      deleteMutation.mutate({ id });
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success(t('media.urlCopied'));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const folders: { value: Folder | undefined; label: string }[] = [
    { value: undefined, label: t('media.filters.all') },
    { value: 'projects', label: t('media.filters.projects') },
    { value: 'blog', label: t('media.filters.blog') },
    { value: 'general', label: t('media.filters.general') },
    { value: 'gallery', label: t('media.filters.gallery') },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{t('media.title')}</h1>
          <button
            onClick={() => setShowMultiUpload(!showMultiUpload)}
            className="btn-outline text-sm"
          >
            {showMultiUpload ? t('media.upload') : t('media.uploadMultiple')}
          </button>
        </div>

        {/* Upload Section */}
        <div className="admin-card p-6">
          <div className="flex gap-4 mb-4">
            <label className="text-sm text-foreground-muted">Upload to folder:</label>
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value as Folder)}
              className="admin-input text-sm"
            >
              <option value="projects">{t('media.filters.projects')}</option>
              <option value="blog">{t('media.filters.blog')}</option>
              <option value="general">{t('media.filters.general')}</option>
              <option value="gallery">{t('media.filters.gallery')}</option>
            </select>
          </div>

          {showMultiUpload ? (
            <MultiImageUpload folder={uploadFolder} onSuccess={refetch} />
          ) : (
            <ImageUpload folder={uploadFolder} onSuccess={refetch} />
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {folders.map((folder) => (
            <button
              key={folder.value ?? 'all'}
              onClick={() => setSelectedFolder(folder.value)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                selectedFolder === folder.value
                  ? 'bg-gold text-black'
                  : 'bg-white/5 text-foreground-muted hover:bg-white/10'
              }`}
            >
              {folder.label}
            </button>
          ))}
        </div>

        {/* Images Grid */}
        {data?.items.length === 0 ? (
          <div className="text-center py-12 text-foreground-muted">
            {t('media.noImages')}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data?.items.map((image) => (
              <div
                key={image._id.toString()}
                className="group relative aspect-square rounded-lg overflow-hidden bg-white/5"
              >
                <img
                  src={image.url}
                  alt={image.altText || 'Image'}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(image.url, image._id.toString())}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title={t('media.copyUrl')}
                  >
                    {copiedId === image._id.toString() ? (
                      <FiCheck className="w-4 h-4 text-green-400" />
                    ) : (
                      <FiCopy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(image._id.toString())}
                    className="p-2 bg-red-500/50 rounded-lg hover:bg-red-500 transition-colors"
                    title={t('media.delete')}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Folder Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-xs">
                  {image.folder}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Count */}
        {data && data.total > 0 && (
          <div className="text-sm text-foreground-muted text-center">
            Showing {data.items.length} of {data.total} images
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
