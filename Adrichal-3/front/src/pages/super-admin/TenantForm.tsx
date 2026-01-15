import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SuperAdminLayout } from '../../components/admin/SuperAdminLayout';
import { trpc } from '../../lib/trpc';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  slug: string;
  domains: string;
  primaryDomain: string;
  contactEmail: string;
  brandColor: string;
  isActive: boolean;
  allowedAdminEmails: string;
}

export default function TenantForm() {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { data: tenant } = trpc.tenant.getById.useQuery(
    { id: id! },
    { enabled: isEdit }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Populate form when editing
  useEffect(() => {
    if (tenant) {
      reset({
        name: tenant.name,
        slug: tenant.slug,
        domains: tenant.domains.join(', '),
        primaryDomain: tenant.primaryDomain,
        contactEmail: tenant.contactEmail,
        brandColor: tenant.brandColor,
        isActive: tenant.isActive,
        allowedAdminEmails: tenant.settings.allowedAdminEmails.join(', '),
      });
    }
  }, [tenant, reset]);

  const createMutation = trpc.tenant.create.useMutation({
    onSuccess: () => {
      toast.success(t('superAdmin.tenants.created'));
      navigate('/super-admin/tenants');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.tenant.update.useMutation({
    onSuccess: () => {
      toast.success(t('superAdmin.tenants.updated'));
      navigate('/super-admin/tenants');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    const domains = data.domains
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
    const allowedAdminEmails = data.allowedAdminEmails
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    if (isEdit) {
      updateMutation.mutate({
        id: id!,
        data: {
          name: data.name,
          domains,
          primaryDomain: data.primaryDomain,
          contactEmail: data.contactEmail,
          brandColor: data.brandColor,
          isActive: data.isActive,
          settings: { allowedAdminEmails },
        },
      });
    } else {
      createMutation.mutate({
        name: data.name,
        slug: data.slug,
        domains,
        primaryDomain: data.primaryDomain,
        contactEmail: data.contactEmail,
        brandColor: data.brandColor,
        settings: { allowedAdminEmails },
      });
    }
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-8">
          {isEdit ? t('superAdmin.tenants.edit') : t('superAdmin.tenants.create')}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('superAdmin.tenants.name')} *
            </label>
            <input
              {...register('name', { required: true })}
              className="admin-input w-full"
              placeholder="Studio Name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">Name is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('superAdmin.tenants.slug')} *
            </label>
            <input
              {...register('slug', {
                required: true,
                pattern: /^[a-z0-9-]+$/,
              })}
              className="admin-input w-full"
              placeholder="studio-name"
              disabled={isEdit}
            />
            {errors.slug && (
              <p className="text-red-400 text-sm mt-1">
                Slug is required (lowercase letters, numbers, and dashes only)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('superAdmin.tenants.domains')} *
            </label>
            <input
              {...register('domains', { required: true })}
              className="admin-input w-full"
              placeholder="domain1.com, domain2.com"
            />
            <p className="text-foreground-faint text-xs mt-1">
              Comma-separated list of domains
            </p>
            {errors.domains && (
              <p className="text-red-400 text-sm mt-1">At least one domain is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('superAdmin.tenants.primaryDomain')} *
            </label>
            <input
              {...register('primaryDomain', { required: true })}
              className="admin-input w-full"
              placeholder="main-domain.com"
            />
            {errors.primaryDomain && (
              <p className="text-red-400 text-sm mt-1">Primary domain is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('superAdmin.tenants.contactEmail')} *
            </label>
            <input
              {...register('contactEmail', { required: true })}
              type="email"
              className="admin-input w-full"
              placeholder="admin@studio.com"
            />
            {errors.contactEmail && (
              <p className="text-red-400 text-sm mt-1">Valid email is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brand Color</label>
            <div className="flex gap-2">
              <input
                {...register('brandColor')}
                type="color"
                className="w-12 h-10 rounded cursor-pointer"
                defaultValue="#d4af37"
              />
              <input
                {...register('brandColor')}
                className="admin-input flex-1"
                placeholder="#d4af37"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Allowed Admin Emails
            </label>
            <textarea
              {...register('allowedAdminEmails')}
              className="admin-input w-full"
              rows={3}
              placeholder="admin1@email.com, admin2@email.com"
            />
            <p className="text-foreground-faint text-xs mt-1">
              Comma-separated. Leave empty to allow any email.
            </p>
          </div>

          {isEdit && (
            <div className="flex items-center gap-3">
              <input
                {...register('isActive')}
                type="checkbox"
                id="isActive"
                className="w-4 h-4"
              />
              <label htmlFor="isActive">{t('superAdmin.tenants.active')}</label>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn-primary">
              {isEdit ? t('common.save') : t('common.create')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/super-admin/tenants')}
              className="btn-outline"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </SuperAdminLayout>
  );
}
