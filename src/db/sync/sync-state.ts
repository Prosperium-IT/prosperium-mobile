import { configStorage } from '@/adapters/mmkv-storage'

const PREFIX_CORE = 'sync_last_core_'
const PREFIX_PORTS = 'sync_last_ports_'

export function getLastSyncedAtCore(tenant: string): number {
  const raw = configStorage.get(`${PREFIX_CORE}${tenant}`)
  return raw ? Number(raw) : 0
}

export function setLastSyncedAtCore(tenant: string, ts: number): void {
  configStorage.set(`${PREFIX_CORE}${tenant}`, String(ts))
}

export function getLastSyncedAtPorts(tenant: string): number {
  const raw = configStorage.get(`${PREFIX_PORTS}${tenant}`)
  return raw ? Number(raw) : 0
}

export function setLastSyncedAtPorts(tenant: string, ts: number): void {
  configStorage.set(`${PREFIX_PORTS}${tenant}`, String(ts))
}

export function resetSyncState(tenant: string): void {
  configStorage.remove(`${PREFIX_CORE}${tenant}`)
  configStorage.remove(`${PREFIX_PORTS}${tenant}`)
}
