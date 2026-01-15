import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SuperAdminLayout } from '../../components/admin/SuperAdminLayout';
import { trpc } from '../../lib/trpc';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface FormData {
  adminEmail: string;
  domain: string;
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
  const [showAdvanced, setShowAdvanced] = useState(isEdit);

  const { data: tenant } = trpc.tenant.getById.useQuery(
    { id: id! },
    { enabled: isEdit }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      brandColor: '#d4af37',
    },
  });

  // Watch domain field for auto-generation
  const watchedDomain = useWatch({ control, name: 'domain' });
  const watchedAdminEmail = useWatch({ control, name: 'adminEmail' });

  // Auto-generate from domain
  const generateFromDomain = useCallback(
    (domain: string) => {
      if (!domain || isEdit) return;

      // Clean domain (remove http://, www., etc.)
      let cleanDomain = domain
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .replace(/\/.*$/, '')
        .trim();

      if (!cleanDomain) return;

      // Extract name from domain (e.g., "architect-studio.com" -> "Architect Studio")
      const nameFromDomain = cleanDomain
        .split('.')[0]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      // Generate slug
      const slug = cleanDomain.split('.')[0].toLowerCase().replace(/[^a-z0-9-]/g, '-');

      // Generate domains (both www and non-www)
      const domains = cleanDomain.includes('www.')
        ? [cleanDomain, cleanDomain.replace('www.', '')]
        : [cleanDomain, `www.${cleanDomain}`];

      setValue('name', nameFromDomain);
      setValue('slug', slug);
      setValue('domains', domains.join(', '));
      setValue('primaryDomain', cleanDomain);
    },
    [isEdit, setValue]
  );

  // Auto-generate from admin email
  const generateFromEmail = useCallback(
    (email: string) => {
      if (!email || isEdit) return;

      // Extract domain from email
      const emailDomain = email.split('@')[1];
      if (!emailDomain) return;

      // Only if domain field is empty
      generateFromDomain(emailDomain);

      // Set contact email and allowed admin emails
      setValue('contactEmail', email);
      setValue('allowedAdminEmails', email);
    },
    [isEdit, setValue, generateFromDomain]
  );

  // Effect for domain auto-generation
  useEffect(() => {
    if (watchedDomain && !isEdit) {
      const timeoutId = setTimeout(() => {
        generateFromDomain(watchedDomain);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedDomain, isEdit, generateFromDomain]);

  // Effect for email auto-generation
  useEffect(() => {
    if (watchedAdminEmail && !isEdit) {
      const timeoutId = setTimeout(() => {
        generateFromEmail(watchedAdminEmail);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedAdminEmail, isEdit, generateFromEmail]);

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
        adminEmail: '',
        domain: '',
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
          {/* Quick Setup (only for new tenants) */}
          {!isEdit && (
            <div className="admin-card p-6 space-y-4">
              <h2 className="text-lg font-medium mb-4">Quick Setup</h2>

              {/* Admin Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('superAdmin.tenants.adminEmail')}
                </label>
                <input
                  {...register('adminEmail')}
                  type="email"
                  className="admin-input w-full"
                  placeholder={t('superAdmin.tenants.adminEmailPlaceholder')}
                />
                <p className="text-foreground-faint text-xs mt-1">
                  {t('superAdmin.tenants.adminEmailHint')}
                </p>
              </div>

              {/* Domain */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('superAdmin.tenants.primaryDomain')}
                </label>
                <input
                  {...register('domain')}
                  className="admin-input w-full"
                  placeholder={t('superAdmin.tenants.primaryDomainPlaceholder')}
                />
              </div>
            </div>
          )}

          {/* Advanced Options Toggle */}
          {!isEdit && (
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-foreground-muted hover:text-gold transition-colors"
            >
              {showAdvanced ? (
                <>
                  <FiChevronUp className="w-4 h-4" />
                  {t('superAdmin.tenants.hideAdvanced')}
                </>
              ) : (
                <>
                  <FiChevronDown className="w-4 h-4" />
                  {t('superAdmin.tenants.advancedOptions')}
                </>
              )}
            </button>
          )}

          {/* Advanced Fields */}
          {(showAdvanced || isEdit) && (
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('superAdmin.tenants.name')} *
                </label>
                <input
                  {...register('name', { required: true })}
                  className="admin-input w-full"
                  placeholder={t('superAdmin.tenants.namePlaceholder')}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {t('superAdmin.tenants.errors.nameRequired')}
                  </p>
                )}
              </div>

              {/* Slug */}
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
                  placeholder={t('superAdmin.tenants.slugPlaceholder')}
                  disabled={isEdit}
                />
                <p className="text-foreground-faint text-xs mt-1">
                  {t('superAdmin.tenants.slugHint')}
                </p>
                {errors.slug && (
                  <p className="text-red-400 text-sm mt-1">
                    {t('superAdmin.tenants.errors.slugRequired')}
                  </p>
                )}
              </div>

              {/* Domains */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('superAdmin.tenants.domains')} *
                </label>
                <input
                  {...register('domains', { required: true })}
                  className="admin-input w-full"
                  placeholder={t('superAdmin.tenants.domainsPlaceholder')}
                />
                <p className="text-foreground-faint text-xs mt-1">
                  {t('superAdmin.tenants.domainsHint')}
                </p>
                {errors.domains && (
                  <p className="text-red-400 text-sm mt-1">
                    {t('superAdmin.tenants.errors.domainsRequired')}
                  </p>
                )}
              </div>

              {/* Primary Domain */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('superAdmin.tenants.primaryDomain')} *
                </label>
                <input
                  {...register('primaryDomain', { required: true })}
                  className="admin-input w-full"
                  placeholder={t('superAdmin.tenants.primaryDomainPlaceholder')}
                />
                {errors.primaryDomain && (
                  <p className="text-red-400 text-sm mt-1">
                    {t('superAdmin.tenants.errors.primaryDomainRequired')}
                  </p>
                )}
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('superAdmin.tenants.contactEmail')} *
                </label>
                <input
                  {...register('contactEmail', { required: true })}
                  type="email"
                  className="admin-input w-full"
                  placeholder={t('superAdmin.tenants.contactEmailPlaceholder')}
                />
                {errors.contactEmail && (
                  <p className="text-red-400 text-sm mt-1">
                    {t('superAdmin.tenants.errors.contactEmailRequired')}
                  </p>
                )}
              </div>

              {/* Brand Color */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('superAdmin.tenants.brandColor')}
                </label>
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

              {/* Allowed Admin Emails */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('superAdmin.tenants.allowedAdminEmails')}
                </label>
                <textarea
                  {...register('allowedAdminEmails')}
                  className="admin-input w-full"
                  rows={3}
                  placeholder={t('superAdmin.tenants.allowedAdminEmailsPlaceholder')}
                />
                <p className="text-foreground-faint text-xs mt-1">
                  {t('superAdmin.tenants.allowedAdminEmailsHint')}
                </p>
              </div>

              {/* Active Status (only for edit) */}
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
            </div>
          )}

          {/* Submit Buttons */}
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
