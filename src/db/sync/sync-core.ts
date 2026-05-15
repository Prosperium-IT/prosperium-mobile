import { Database, Q } from '@nozbe/watermelondb'
import { http, CORE_BASE_URL } from '@/lib/http'
import {
  PullRequest,
  PullResponse,
  PushRequest,
  PushResponse,
  SyncTable,
} from './types'
import {
  getLastSyncedAtCore,
  setLastSyncedAtCore,
} from './sync-state'
import { generateIdempotencyKey } from './uuid-generator'

const CORE_TABLES: SyncTable[] = [
  'lancamentos',
  'pessoas',
  'un_negocios',
  'tp_lctos',
]

const BIDIRECIONAL_CORE: SyncTable[] = ['lancamentos', 'pessoas']

export async function pullCore(database: Database, tenant: string): Promise<void> {
  const lastSyncedAt = getLastSyncedAtCore(tenant)
  const body: PullRequest = { lastSyncedAt, tables: CORE_TABLES }

  const response = await http.post<PullResponse>('/sync/pull', body)
  const { changes, timestamp } = response

  await database.write(async () => {
    for (const table of CORE_TABLES) {
      const tableChanges = changes[table]
      if (!tableChanges) continue
      const collection = database.get(table)

      for (const remote of tableChanges.created ?? []) {
        const externalId = (remote.external_id as string) ?? null
        if (!externalId) continue
        const existing = await collection
          .query(Q.where('external_id', externalId))
          .fetch()
        if (existing.length > 0) continue
        await collection.create((rec: any) => {
          Object.assign(rec._raw, mapRemoteToRaw(remote))
          rec._raw.sync_status = 'synced'
          rec._raw.sync_error = null
        })
      }

      for (const remote of tableChanges.updated ?? []) {
        const externalId = (remote.external_id as string) ?? null
        if (!externalId) continue
        const existing = await collection
          .query(Q.where('external_id', externalId))
          .fetch()
        if (existing.length === 0) {
          await collection.create((rec: any) => {
            Object.assign(rec._raw, mapRemoteToRaw(remote))
            rec._raw.sync_status = 'synced'
          })
          continue
        }
        await existing[0].update((rec: any) => {
          Object.assign(rec._raw, mapRemoteToRaw(remote))
          rec._raw.sync_status = 'synced'
          rec._raw.sync_error = null
        })
      }

      for (const externalId of tableChanges.deleted ?? []) {
        const existing = await collection
          .query(Q.where('external_id', externalId))
          .fetch()
        for (const rec of existing) {
          await rec.destroyPermanently()
        }
      }
    }
  })

  setLastSyncedAtCore(tenant, timestamp)
}

export async function pushCore(database: Database, tenant: string): Promise<void> {
  const changes: PushRequest['changes'] = {}

  for (const table of BIDIRECIONAL_CORE) {
    const collection = database.get(table)
    const pending = await collection
      .query(Q.where('sync_status', 'pending'))
      .fetch()
    if (pending.length === 0) continue

    await database.write(async () => {
      for (const rec of pending) {
        await rec.update((r: any) => {
          r._raw.sync_status = 'syncing'
        })
      }
    })

    const created: Record<string, unknown>[] = []
    const updated: Record<string, unknown>[] = []
    for (const rec of pending) {
      const raw = mapRawToRemote((rec as any)._raw)
      if (raw.server_id) updated.push(raw)
      else created.push(raw)
    }
    changes[table] = { created, updated, deleted: [] }
  }

  if (Object.keys(changes).length === 0) return

  const idempotencyKey = generateIdempotencyKey()
  const axios = http.getAxiosInstance()
  const response = await axios.post<PushResponse>(
    `${CORE_BASE_URL}/sync/push`,
    { changes },
    { headers: { 'Idempotency-Key': idempotencyKey } },
  )

  const { accepted, rejected } = response.data

  await database.write(async () => {
    for (const table of BIDIRECIONAL_CORE) {
      const collection = database.get(table)
      for (const a of accepted) {
        const recs = await collection
          .query(Q.where('external_id', a.external_id))
          .fetch()
        for (const r of recs) {
          await r.update((rec: any) => {
            rec._raw.server_id = a.server_id
            rec._raw.sync_status = 'synced'
            rec._raw.sync_error = null
          })
        }
      }
      for (const rej of rejected) {
        const recs = await collection
          .query(Q.where('external_id', rej.external_id))
          .fetch()
        for (const r of recs) {
          await r.update((rec: any) => {
            rec._raw.sync_status = 'error'
            rec._raw.sync_error = rej.reason
          })
        }
      }
    }
  })
}

function mapRemoteToRaw(remote: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...remote }
  if ('id' in out) out.server_id = out.id
  delete out.id
  return out
}

function mapRawToRemote(raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...raw }
  delete out._status
  delete out._changed
  return out
}
