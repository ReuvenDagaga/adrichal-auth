import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FiUpload, FiX } from 'react-icons/fi';
import { trpc } from '../../lib/trpc';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  folder: 'projects' | 'blog' | 'general' | 'gallery';
  onSuccess?: () => void;
}

export function ImageUpload({ folder, onSuccess }: ImageUploadProps) {
  const { t } = useTranslation('admin');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadMutation = trpc.upload.uploadImage.useMutation({
    onSuccess: () => {
      toast.success(t('media.success'));
      setPreview(null);
      onSuccess?.();
    },
    onError: () => {
      toast.error(t('media.error'));
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Check file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File is too large (max 10MB)');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      setUploading(true);
      const base64 = await fileToBase64(file);
      uploadMutation.mutate({ base64, folder });
    },
    [folder, uploadMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-gold bg-gold/5'
            : 'border-white/20 hover:border-gold/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <FiUpload className="w-8 h-8 mx-auto mb-4 text-foreground-muted" />
        <p className="text-foreground-muted">
          {isDragActive ? t('media.dropHere') : t('media.dragDrop')}
        </p>
        <p className="text-xs text-foreground-faint mt-2">{t('media.formats')}</p>
      </div>

      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg"
          />
          <button
            onClick={clearPreview}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {uploading && (
        <div className="text-sm text-foreground-muted">{t('media.uploading')}</div>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
