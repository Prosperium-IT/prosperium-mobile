import { useState } from 'react'
import {
  View, Text, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import { createAuthService } from '@prosperium-it/shared'
import { http } from '@/lib/http'
import { useTenant } from '@/providers/tenant-provider'
import { Button } from '@/components/ds/Button'
import { TextInput } from '@/components/ds/TextInput'

const authService = createAuthService(http)

export default function TenantScreen() {
  const [slug, setSlug] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setTenant } = useTenant()

  const handleContinue = async () => {
    const clean = slug.trim().toLowerCase()
    if (!clean) {
      setError('Informe o identificador da empresa')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.checkTenant(clean)
      if (!result.exists) {
        setError('Empresa não encontrada. Verifique o identificador.')
        return
      }
      setTenant(clean, result.display_name ?? clean)
      router.push('/(auth)/login')
    } catch {
      setError('Não foi possível verificar a empresa. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-primary-700"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-white/20 rounded-3xl items-center justify-center mb-4">
              <Text className="text-white text-4xl font-bold">P</Text>
            </View>
            <Text className="text-white text-3xl font-bold">Prosperium</Text>
            <Text className="text-primary-200 text-base mt-1">Gestão financeira</Text>
          </View>

          <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl gap-5">
            <View className="gap-1">
              <Text className="text-xl font-bold text-slate-900 dark:text-white">
                Identificar empresa
              </Text>
              <Text className="text-slate-500 text-sm">
                Digite o identificador da sua empresa para continuar
              </Text>
            </View>

            <TextInput
              label="Identificador da empresa"
              placeholder="ex: workport"
              value={slug}
              onChangeText={(t) => { setSlug(t); setError(null) }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              error={error ?? undefined}
              hint="Fornecido pelo administrador do sistema"
            />

            <Button
              label="Continuar"
              onPress={handleContinue}
              loading={isLoading}
              size="lg"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
