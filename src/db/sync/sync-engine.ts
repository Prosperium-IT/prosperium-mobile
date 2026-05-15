import { Database } from '@nozbe/watermelondb'
import { pullCore, pushCore } from './sync-core'
import { pullPorts, pushPorts } from './sync-ports'

export interface SyncResult {
  success: boolean
  error: string | null
  timestamp: number
}

let inflight: Promise<SyncResult> | null = null

export function runSync(database: Database, tenant: string): Promise<SyncResult> {
  if (inflight) return inflight
  inflight = (async () => {
    const start = Date.now()
    try {
      await Promise.all([
        (async () => {
          await pushCore(database, tenant)
          await pullCore(database, tenant)
        })(),
        (async () => {
          await pushPorts(database, tenant)
          await pullPorts(database, tenant)
        })(),
      ])
      return { success: true, error: null, timestamp: Date.now() }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message, timestamp: Date.now() }
    } finally {
      const elapsed = Date.now() - start
      console.log(`[sync] runSync completed in ${elapsed}ms`)
      inflight = null
    }
  })()
  return inflight
}
