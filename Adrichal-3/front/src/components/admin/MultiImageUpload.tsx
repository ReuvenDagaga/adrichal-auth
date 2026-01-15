import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FiUpload, FiX } from 'react-icons/fi';
import { trpc } from '../../lib/trpc';
import toast from 'react-hot-toast';

interface MultiImageUploadProps {
  folder: 'projects' | 'blog' | 'general' | 'gallery';
  onSuccess?: () => void;
}

interface PreviewFile {
  file: File;
  preview: string;
}

export function MultiImageUpload({ folder, onSuccess }: MultiImageUploadProps) {
  const { t } = useTranslation('admin');
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<PreviewFile[]>([]);

  const uploadMutation = trpc.upload.uploadMultiple.useMutation({
    onSuccess: () => {
      toast.success(`${files.length} images uploaded successfully`);
      setFiles([]);
      onSuccess?.();
    },
    onError: () => {
      toast.error(t('media.error'));
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    disabled: uploading,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);

    const images = await Promise.all(
      files.map(async ({ file }) => ({
        base64: await fileToBase64(file),
      }))
    );

    uploadMutation.mutate({ images, folder });
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

      {files.length > 0 && (
        <>
          <div className="grid grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary"
          >
            {uploading
              ? t('media.uploading')
              : `Upload ${files.length} image${files.length > 1 ? 's' : ''}`}
          </button>
        </>
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
