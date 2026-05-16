import { useEffect, useState, useCallback, useRef } from 'react'
import { useDatabase } from '@nozbe/watermelondb/react'
import { DashboardCache } from '@/db/models/DashboardCache'
import { dashboardConfig } from '@/adapters/mmkv-dashboard-storage'
import { getDashboard } from '@/services/dashboard-service'

export interface DashboardData {
  timestamp: number
  items: Record<string, any>
}

export interface UseDashboardDataResult {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useDashboardData(): UseDashboardDataResult {
  const database = useDatabase()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Carrega cache inicial de WatermelonDB
  const loadCache = useCallback(async () => {
    try {
      const cacheCollection = database.get<DashboardCache>('dashboard_cache')
      const cacheRecords: DashboardCache[] = await cacheCollection.query().fetch()

      if (cacheRecords.length > 0) {
        const latest = cacheRecords[cacheRecords.length - 1]
        setData({
          timestamp: latest.timestamp,
          items: JSON.parse(latest.items ?? '{}'),
        })
      }
    } catch (err) {
      console.warn('Error loading dashboard cache:', err)
    }
  }, [database])

  // Carrega cache no mount
  useEffect(() => {
    void loadCache()
  }, [loadCache])

  // Função refresh
  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const lastTs = dashboardConfig.getLastTimestamp()
      const response = await getDashboard(lastTs)

      if (response.items === null) {
        // Sem mudanças, mantém estado
        setLoading(false)
        return
      }

      // Atualiza WatermelonDB
      await database.write(async () => {
        // Limpa cache antigo
        const cacheCollection = database.get<DashboardCache>('dashboard_cache')
        const oldCache = await cacheCollection.query().fetch()
        for (const item of oldCache) {
          await item.destroyPermanently()
        }

        // Insere novo
        await cacheCollection.create((cache: any) => {
          cache.timestamp = response.timestamp
          cache.items = JSON.stringify(response.items)
        })
      })

      // Atualiza MMKV e estado
      dashboardConfig.setLastTimestamp(response.timestamp)
      setData({
        timestamp: response.timestamp,
        items: response.items,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar dashboard'
      setError(message)
      console.error('Dashboard refresh error:', err)
    } finally {
      setLoading(false)
    }
  }, [database])

  // Auto-refresh interval — reads config once at mount
  useEffect(() => {
    const intervalMs = dashboardConfig.getRefreshIntervalSeconds() * 1000
    const interval = setInterval(() => {
      void refresh()
    }, intervalMs)

    intervalRef.current = interval

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refresh])

  return { data, loading, error, refresh }
}
