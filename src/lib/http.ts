import { createHttpClient } from '@prosperium-it/shared'
import { SecureStorageAdapter } from '@/adapters/secure-storage-adapter'
import { configStorage } from '@/adapters/mmkv-storage'
import { router } from 'expo-router'

export const CORE_BASE_URL =
  process.env.EXPO_PUBLIC_CORE_API_URL ?? 'http://192.168.1.100:8000/api'

export const PORTS_BASE_URL =
  process.env.EXPO_PUBLIC_PORTS_API_URL ?? 'http://192.168.1.100:8200/api'

const storageAdapter = new SecureStorageAdapter()

export const http = createHttpClient({
  coreBaseUrl: CORE_BASE_URL,
  portsBaseUrl: PORTS_BASE_URL,
  storageAdapter,
  getTenant: () => configStorage.get('current_tenant'),
  onUnauthorized: () => {
    storageAdapter.remove('auth_token')
    storageAdapter.remove('refresh_token')
    router.replace('/(auth)/login')
  },
  timeout: 30000,
})
