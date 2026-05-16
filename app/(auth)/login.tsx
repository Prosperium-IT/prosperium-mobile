import { useState } from 'react'
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Image,
  Linking,
} from 'react-native'
import { router } from 'expo-router'
import { createAuthService } from '@prosperium-it/shared'
import { http } from '@/lib/http'
import { useAuth } from '@/providers/auth-provider'
import { useTenant } from '@/providers/tenant-provider'
import { Button } from '@/components/ds/Button'
import { TextInput } from '@/components/ds/TextInput'
import { Eye, EyeOff, Mail } from 'lucide-react-native'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ds/SocialIcons'

const authService = createAuthService(http)

interface FieldErrors {
  empresa?: string
  email?: string
  password?: string
  general?: string
}

export default function LoginScreen() {
  const [empresa, setEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})

  const { login } = useAuth()
  const { setTenant } = useTenant()

  const validate = (): boolean => {
    const next: FieldErrors = {}
    if (!empresa.trim()) next.empresa = 'Informe o identificador da empresa'
    if (!email.trim()) next.email = 'E-mail obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'E-mail inválido'
    if (!password) next.password = 'Senha obrigatória'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleEntrar = async () => {
    if (!validate()) return
    setIsLoading(true)
    setErrors({})

    try {
      const slug = empresa.trim().toLowerCase()
      const tenantResult = await authService.tenantExists(slug)
      if (!tenantResult.exists) {
        setErrors({ empresa: 'Empresa não encontrada. Verifique o identificador.' })
        return
      }
      setTenant(slug, tenantResult.label ?? slug)

      await login(email.trim(), password)
      router.replace('/(auth)/biometria')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao entrar'
      const isCredentialError =
        message.includes('401') || message.toLowerCase().includes('credencial')
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
        <View className="flex-1">
          <View className="items-center gap-3 pt-16 px-6">
            <View className="flex-row items-center gap-3">
              <View className="p-2 bg-white/15 rounded-xl">
                <Image
                  source={require('../../assets/logo-prosperium.png')}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-2xl font-light text-white/90 tracking-tight">
                Prosperium
              </Text>
            </View>

            <View className="items-center mt-6 px-2">
              <Text className="text-3xl font-bold text-white text-center leading-tight">
                Gestão financeira
              </Text>
              <Text className="text-3xl font-bold text-blue-200 text-center leading-tight">
                especialista
              </Text>
            </View>
          </View>

          <View className="flex-1 justify-center px-6">
            <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl gap-5">
              <Text className="text-xl font-bold text-slate-900 dark:text-white">
                Entrar
              </Text>

              {errors.general && (
                <View className="bg-danger-50 border border-danger-200 rounded-xl px-4 py-3">
                  <Text className="text-danger-600 text-sm">{errors.general}</Text>
                </View>
              )}

              <TextInput
                label="Empresa"
                placeholder="ex: workport"
                value={empresa}
                onChangeText={(t) => {
                  setEmpresa(t)
                  setErrors((e) => ({ ...e, empresa: undefined }))
                }}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                error={errors.empresa}
                hint={errors.empresa ? undefined : 'Identificador fornecido pelo administrador'}
              />

              <TextInput
                label="E-mail"
                placeholder="seu@email.com"
                value={email}
                onChangeText={(t) => {
                  setEmail(t)
                  setErrors((e) => ({ ...e, email: undefined }))
                }}
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
                  onChangeText={(t) => {
                    setPassword(t)
                    setErrors((e) => ({ ...e, password: undefined }))
                  }}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleEntrar}
                  error={errors.password}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-9"
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#94a3b8" />
                  ) : (
                    <Eye size={20} color="#94a3b8" />
                  )}
                </Pressable>
              </View>

              <Button
                label="Entrar"
                onPress={handleEntrar}
                loading={isLoading}
                size="lg"
              />
            </View>

            <View className="flex-row justify-center items-center gap-8 mt-5">
              <Pressable onPress={() => Linking.openURL('https://facebook.com/prosperium')}>
                <FacebookIcon size={24} color="white" />
              </Pressable>
              <Pressable onPress={() => Linking.openURL('https://instagram.com/prosperium')}>
                <InstagramIcon size={24} color="white" />
              </Pressable>
              <Pressable onPress={() => Linking.openURL('https://youtube.com/@prosperium')}>
                <YoutubeIcon size={24} color="white" />
              </Pressable>
              <Pressable onPress={() => Linking.openURL('mailto:contato@prosperium.com.br')}>
                <Mail size={24} color="white" />
              </Pressable>
            </View>
          </View>

          <View className="px-6 pt-4 pb-6 items-center gap-1">
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className="text-xs font-semibold text-white"
            >
              Operação portuária eficiente começa no financeiro
            </Text>
            <Text className="text-[10px] text-white/80">
              © 2026 Prosperium Soluções e Tecnologia LTDA
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
