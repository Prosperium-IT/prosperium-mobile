export type SyncTable =
  | 'lancamentos'
  | 'pessoas'
  | 'un_negocios'
  | 'tp_lctos'
  | 'operacoes'
  | 'navios'
  | 'portos'

export interface SyncChange<T> {
  created: T[]
  updated: T[]
  deleted: string[] // external_ids
}

export interface PullResponse {
  changes: Record<string, SyncChange<Record<string, unknown>>>
  timestamp: number
}

export interface PullRequest {
  lastSyncedAt: number
  tables: SyncTable[]
}

export interface PushAccepted {
  external_id: string
  server_id: number | null
}

export interface PushRejected {
  external_id: string
  reason: string
}

export interface PushResponse {
  accepted: PushAccepted[]
  rejected: PushRejected[]
}

export interface PushPayloadTable {
  created: Record<string, unknown>[]
  updated: Record<string, unknown>[]
  deleted: string[]
}

export interface PushRequest {
  changes: Record<string, PushPayloadTable>
}

export interface SyncStatus {
  isSyncing: boolean
  lastSyncedAt: number | null
  error: string | null
}
