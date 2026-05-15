import { createContext, useContext, useState, PropsWithChildren } from 'react'
import { configStorage } from '@/adapters/mmkv-storage'

const TENANT_KEY = 'current_tenant'

interface TenantContextValue {
  tenant: string | null
  displayName: string | null
  setTenant: (slug: string, displayName: string) => void
  clearTenant: () => void
}

const TenantContext = createContext<TenantContextValue | null>(null)

export function TenantProvider({ children }: PropsWithChildren) {
  const [tenant, setTenantState] = useState<string | null>(
    () => configStorage.get(TENANT_KEY)
  )
  const [displayName, setDisplayNameState] = useState<string | null>(
    () => configStorage.get('tenant_display_name')
  )

  const setTenant = (slug: string, name: string) => {
    configStorage.set(TENANT_KEY, slug)
    configStorage.set('tenant_display_name', name)
    setTenantState(slug)
    setDisplayNameState(name)
  }

  const clearTenant = () => {
    configStorage.remove(TENANT_KEY)
    configStorage.remove('tenant_display_name')
    setTenantState(null)
    setDisplayNameState(null)
  }

  return (
    <TenantContext.Provider value={{ tenant, displayName, setTenant, clearTenant }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used within TenantProvider')
  return ctx
}
