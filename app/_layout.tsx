import '../global.css'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryProvider } from '@/providers/query-provider'
import { TenantProvider } from '@/providers/tenant-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { DatabaseProvider } from '@/providers/database-provider'

export default function RootLayout() {
  return (
    <QueryProvider>
      <TenantProvider>
        <AuthProvider>
          <DatabaseProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }} />
          </DatabaseProvider>
        </AuthProvider>
      </TenantProvider>
    </QueryProvider>
  )
}
