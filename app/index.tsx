import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { configStorage } from '@/adapters/mmkv-storage'
import { SecureStorageAdapter } from '@/adapters/secure-storage-adapter'

const storage = new SecureStorageAdapter()

export default function Index() {
  const [destination, setDestination] = useState<string | null>(null)

  useEffect(() => {
    async function resolve() {
      const tenant = configStorage.get('current_tenant')
      if (!tenant) {
        setDestination('/(auth)/tenant')
        return
      }
      const token = await storage.get('auth_token')
      setDestination(token ? '/(tabs)/dashboard' : '/(auth)/login')
    }
    resolve()
  }, [])

  if (!destination) {
    return (
      <View className="flex-1 items-center justify-center bg-primary-700">
        <ActivityIndicator size="large" color="white" />
      </View>
    )
  }

  return <Redirect href={destination as never} />
}
