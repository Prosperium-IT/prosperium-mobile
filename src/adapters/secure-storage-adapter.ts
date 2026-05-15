import * as SecureStore from 'expo-secure-store'
import type { StorageAdapter } from '@prosperium-it/shared'

export class SecureStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key)
  }

  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value)
  }

  async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key)
  }
}
