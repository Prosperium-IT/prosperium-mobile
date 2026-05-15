import { useState, useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import { router } from 'expo-router'
import { Fingerprint, Shield } from 'lucide-react-native'
import { configStorage } from '@/adapters/mmkv-storage'
import { Button } from '@/components/ds/Button'

export default function BiometriaScreen() {
  const [hasBiometrics, setHasBiometrics] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then(setHasBiometrics)
    LocalAuthentication.isEnrolledAsync().then(setIsEnrolled)
  }, [])

  const handleEnable = async () => {
    setIsLoading(true)
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirme sua identidade para ativar o desbloqueio biométrico',
      cancelLabel: 'Cancelar',
    })

    if (result.success) {
      configStorage.setBool('biometria_enabled', true)
    }

    setIsLoading(false)
    router.replace('/(tabs)/dashboard')
  }

  const handleSkip = () => {
    configStorage.setBool('biometria_enabled', false)
    router.replace('/(tabs)/dashboard')
  }

  // Sem hardware ou sem biometria cadastrada — pular direto
  if (!hasBiometrics || !isEnrolled) {
    handleSkip()
    return null
  }

  return (
    <View className="flex-1 bg-primary-700 items-center justify-center px-6">
      <View className="bg-white/20 w-24 h-24 rounded-3xl items-center justify-center mb-8">
        <Fingerprint color="white" size={48} />
      </View>

      <Text className="text-white text-2xl font-bold text-center mb-3">
        Ativar desbloqueio rápido
      </Text>
      <Text className="text-primary-200 text-base text-center mb-12 leading-6">
        Use Face ID ou Touch ID para entrar no app sem digitar sua senha toda vez.
      </Text>

      <View className="w-full gap-3">
        <Button
          label="Ativar biometria"
          onPress={handleEnable}
          loading={isLoading}
          size="lg"
        />
        <Pressable onPress={handleSkip} className="py-3 items-center">
          <Text className="text-primary-200 text-base">Agora não</Text>
        </Pressable>
      </View>

      <View className="flex-row items-center gap-2 mt-8">
        <Shield size={14} color="#93c5fd" />
        <Text className="text-primary-300 text-xs">
          Seus dados ficam protegidos no dispositivo
        </Text>
      </View>
    </View>
  )
}
