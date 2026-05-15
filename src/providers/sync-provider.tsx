import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AppState, AppStateStatus } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useTenant } from './tenant-provider'
import { useAuth } from './auth-provider'
import { runSync } from '@/db/sync/sync-engine'
import { getLastSyncedAtCore } from '@/db/sync/sync-state'

interface SyncContextValue {
  triggerSync: () => Promise<void>
  isSyncing: boolean
  lastSyncedAt: number | null
  syncError: string | null
}

const SyncContext = createContext<SyncContextValue | null>(null)

const BACKGROUND_THRESHOLD_MS = 30_000
const DEBOUNCE_MS = 2_000

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const database = useDatabase()
  const { tenant } = useTenant()
  const { isAuthenticated } = useAuth()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(
    tenant ? getLastSyncedAtCore(tenant) || null : null,
  )
  const [syncError, setSyncError] = useState<string | null>(null)
  const appState = useRef(AppState.currentState)
  const backgroundedAt = useRef<number | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerSyncImmediate = useCallback(async () => {
    if (!tenant || !isAuthenticated || !database) return
    setIsSyncing(true)
    setSyncError(null)
    const result = await runSync(database, tenant)
    setIsSyncing(false)
    if (result.success) {
      setLastSyncedAt(result.timestamp)
    } else {
      setSyncError(result.error)
    }
  }, [database, tenant, isAuthenticated])

  const triggerSync = useCallback(async () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    return new Promise<void>((resolve) => {
      debounceTimer.current = setTimeout(() => {
        void triggerSyncImmediate().then(resolve)
      }, DEBOUNCE_MS)
    })
  }, [triggerSyncImmediate])

  // AppState listener
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      const prev = appState.current
      appState.current = next
      if (prev.match(/inactive|background/) && next === 'active') {
        const backgrounded = backgroundedAt.current
        if (!backgrounded || Date.now() - backgrounded >= BACKGROUND_THRESHOLD_MS) {
          void triggerSyncImmediate()
        }
      } else if (next.match(/inactive|background/)) {
        backgroundedAt.current = Date.now()
      }
    })
    return () => sub.remove()
  }, [triggerSyncImmediate])

  // NetInfo listener
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        void triggerSyncImmediate()
      }
    })
    return unsub
  }, [triggerSyncImmediate])

  // Sync inicial após autenticar com tenant
  useEffect(() => {
    if (isAuthenticated && tenant) {
      void triggerSyncImmediate()
    }
  }, [isAuthenticated, tenant, triggerSyncImmediate])

  return (
    <SyncContext.Provider
      value={{ triggerSync, isSyncing, lastSyncedAt, syncError }}
    >
      {children}
    </SyncContext.Provider>
  )
}

export function useSync(): SyncContextValue {
  const ctx = useContext(SyncContext)
  if (!ctx) throw new Error('useSync must be used within SyncProvider')
  return ctx
}
