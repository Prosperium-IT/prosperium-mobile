import '../global.css'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryProvider } from '@/providers/query-provider'
import { TenantProvider } from '@/providers/tenant-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { SyncProvider } from '@/providers/sync-provider'

export default function RootLayout() {
  return (
    <QueryProvider>
      <TenantProvider>
        <AuthProvider>
          <SyncProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }} />
          </SyncProvider>
        </AuthProvider>
      </TenantProvider>
    </QueryProvider>
  )
}
