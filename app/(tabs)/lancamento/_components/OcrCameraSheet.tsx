import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Modal, Pressable, Text, View } from 'react-native'
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import MlkitOcr from 'react-native-mlkit-ocr'

interface Props {
  visible: boolean
  onClose: () => void
  onCapture: (result: {
    texto: string
    fileUri: string
    fileName: string
    mimeType: string
  }) => void
}

export function OcrCameraSheet({ visible, onClose, onCapture }: Props) {
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()
  const cameraRef = useRef<Camera>(null)
  const [capturing, setCapturing] = useState(false)

  const handleCapture = useCallback(async () => {
    if (capturing || !cameraRef.current) return
    setCapturing(true)
    try {
      const photo = await cameraRef.current.takePhoto({})
      const fileUri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`
      const fileName = photo.path.split('/').pop() ?? `comprovante_${Date.now()}.jpg`

      const ocrResult = await MlkitOcr.detectFromUri(fileUri)
      const texto = ocrResult.map((block) => block.text).join('\n')

      onCapture({ texto, fileUri, fileName, mimeType: 'image/jpeg' })
      onClose()
    } catch {
      Alert.alert('Erro', 'Não foi possível capturar ou processar a foto.')
    } finally {
      setCapturing(false)
    }
  }, [capturing, onCapture, onClose])

  if (!hasPermission) {
    return (
      <Modal visible={visible} animationType="slide">
        <View className="flex-1 bg-black items-center justify-center px-8">
          <Text className="text-white text-center mb-6">
            Precisamos de acesso à câmera para ler comprovantes.
          </Text>
          <Pressable
            onPress={requestPermission}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Permitir câmera</Text>
          </Pressable>
          <Pressable onPress={onClose} className="mt-4">
            <Text className="text-slate-400">Cancelar</Text>
          </Pressable>
        </View>
      </Modal>
    )
  }

  if (!device) {
    return (
      <Modal visible={visible} animationType="slide">
        <View className="flex-1 bg-black items-center justify-center">
          <Text className="text-white">Câmera não disponível neste dispositivo.</Text>
          <Pressable onPress={onClose} className="mt-4">
            <Text className="text-slate-400">Fechar</Text>
          </Pressable>
        </View>
      </Modal>
    )
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-black">
        <Camera
          ref={cameraRef}
          style={{ flex: 1 }}
          device={device}
          isActive={visible}
          photo={true}
        />

        <View className="absolute bottom-8 left-0 right-0 flex-row justify-around items-center px-8">
          <Pressable
            onPress={onClose}
            className="bg-slate-700 px-5 py-3 rounded-full"
          >
            <Text className="text-white">Cancelar</Text>
          </Pressable>

          <Pressable
            onPress={handleCapture}
            disabled={capturing}
            className="bg-white w-16 h-16 rounded-full items-center justify-center"
          >
            {capturing ? (
              <ActivityIndicator color="#1e293b" />
            ) : (
              <View className="w-12 h-12 rounded-full border-2 border-slate-400" />
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
