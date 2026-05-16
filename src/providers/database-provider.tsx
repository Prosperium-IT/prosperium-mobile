import { PropsWithChildren, useMemo } from 'react'
import { DatabaseProvider as WMDBProvider } from '@nozbe/watermelondb/react'
import { getDatabase } from '@/db'
import { useTenant } from './tenant-provider'
import { SyncProvider } from './sync-provider'

export function DatabaseProvider({ children }: PropsWithChildren) {
  const { tenant } = useTenant()
  const database = useMemo(() => (tenant ? getDatabase(tenant) : null), [tenant])

  if (!database) return <>{children}</>

  return (
    <WMDBProvider database={database}>
      <SyncProvider>{children}</SyncProvider>
    </WMDBProvider>
  )
}
