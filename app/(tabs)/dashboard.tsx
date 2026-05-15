import { View, Text, Pressable } from 'react-native'
import { useAuth } from '@/providers/auth-provider'
import { useTenant } from '@/providers/tenant-provider'
import { router } from 'expo-router'

export default function DashboardScreen() {
  const { user, logout } = useAuth()
  const { displayName, clearTenant } = useTenant()

  const handleLogout = async () => {
    await logout()
    clearTenant()
    router.replace('/(auth)/tenant')
  }

  return (
    <View className="flex-1 bg-surface-muted dark:bg-surface-dark p-6 pt-16">
      <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Dashboard
      </Text>
      <Text className="text-slate-500 mb-1">Tenant: {displayName}</Text>
      <Text className="text-slate-500 mb-8">Usuário: {user?.email ?? '—'}</Text>

      <Text className="text-slate-400 text-center mt-8 mb-4">
        (Em construção — implementado em F5)
      </Text>

      <Pressable
        onPress={handleLogout}
        className="bg-danger-500 rounded-xl py-3 items-center"
      >
        <Text className="text-white font-semibold">Sair</Text>
      </Pressable>
    </View>
  )
}
