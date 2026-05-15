import { useState } from 'react'
import {
  View, Text, KeyboardAvoidingView, Platform,
  ScrollView, Pressable,
} from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/providers/auth-provider'
import { useTenant } from '@/providers/tenant-provider'
import { Button } from '@/components/ds/Button'
import { TextInput } from '@/components/ds/TextInput'
import { Eye, EyeOff, ChevronLeft } from 'lucide-react-native'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    general?: string
  }>({})

  const { login } = useAuth()
  const { displayName } = useTenant()

  const validate = (): boolean => {
    const newErrors: typeof errors = {}
    if (!email.trim()) newErrors.email = 'E-mail obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'E-mail inválido'
    if (!password) newErrors.password = 'Senha obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return
    setIsLoading(true)
    setErrors({})

    try {
      await login(email.trim(), password)
      router.replace('/(auth)/biometria')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login'
      const isCredentialError = message.includes('401') || message.toLowerCase().includes('credencial')
      setErrors({
        general: isCredentialError
          ? 'E-mail ou senha incorretos'
          : 'Não foi possível conectar. Verifique sua conexão.',
      })
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
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-1 mb-8"
          >
            <ChevronLeft color="white" size={20} />
            <Text className="text-white text-sm">{displayName ?? 'Empresa'}</Text>
          </Pressable>

          <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl gap-5">
            <View className="gap-1">
              <Text className="text-xl font-bold text-slate-900 dark:text-white">
                Entrar
              </Text>
              <Text className="text-slate-500 text-sm">
                Acesse com suas credenciais do Prosperium
              </Text>
            </View>

            {errors.general && (
              <View className="bg-danger-50 border border-danger-200 rounded-xl px-4 py-3">
                <Text className="text-danger-600 text-sm">{errors.general}</Text>
              </View>
            )}

            <TextInput
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors(e => ({ ...e, email: undefined })) }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              error={errors.email}
            />

            <View className="relative gap-1">
              <TextInput
                label="Senha"
                placeholder="••••••••"
                value={password}
                onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: undefined })) }}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                error={errors.password}
              />
              <Pressable
                onPress={() => setShowPassword(v => !v)}
                className="absolute right-4 top-9"
              >
                {showPassword
                  ? <EyeOff size={20} color="#94a3b8" />
                  : <Eye size={20} color="#94a3b8" />}
              </Pressable>
            </View>

            <Button
              label="Entrar"
              onPress={handleLogin}
              loading={isLoading}
              size="lg"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
