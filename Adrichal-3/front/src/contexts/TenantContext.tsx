import { createContext, useContext, type ReactNode } from 'react';
import { trpc } from '../lib/trpc';

interface Tenant {
  _id: string;
  name: string;
  slug: string;
  domains: string[];
  primaryDomain: string;
  logoUrl: string;
  brandColor: string;
  contactEmail: string;
  isActive: boolean;
}

interface TenantContextValue {
  tenant: Tenant | null;
  isSuperAdminContext: boolean;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = trpc.tenant.getCurrent.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const value: TenantContextValue = {
    tenant: data?.tenant as Tenant | null,
    isSuperAdminContext: data?.isSuperAdminContext ?? false,
    isLoading,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
