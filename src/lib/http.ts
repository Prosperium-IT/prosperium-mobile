import { createHttpClient } from '@prosperium-it/shared'
import { SecureStorageAdapter } from '@/adapters/secure-storage-adapter'
import { configStorage } from '@/adapters/mmkv-storage'
import { router } from 'expo-router'

const storageAdapter = new SecureStorageAdapter()

export const http = createHttpClient({
  // URLs apontam direto para a API — sem proxy Next.js no mobile
  // Em desenvolvimento, usar endereço IP da máquina (não localhost — emulador usa rede própria)
  coreBaseUrl: process.env.EXPO_PUBLIC_CORE_API_URL ?? 'http://192.168.1.100:8000/api',
  portsBaseUrl: process.env.EXPO_PUBLIC_PORTS_API_URL ?? 'http://192.168.1.100:8200/api',
  storageAdapter,
  getTenant: () => configStorage.get('current_tenant'),
  onUnauthorized: () => {
    storageAdapter.remove('auth_token')
    storageAdapter.remove('refresh_token')
    router.replace('/(auth)/tenant')
  },
  timeout: 30000,
})
