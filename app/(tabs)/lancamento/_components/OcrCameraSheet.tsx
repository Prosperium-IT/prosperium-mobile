import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Modal, Pressable, Text, View } from 'react-native'
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameOutput,
  usePhotoOutput,
} from 'react-native-vision-camera'
import { scanOCR } from 'vision-camera-ocr'

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
  const [capturedText, setCapturedText] = useState<string>('')
  const [capturing, setCapturing] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [capturedFilePath, setCapturedFilePath] = useState<string | null>(null)

  // v5 API: outputs created via hooks, passed to <Camera outputs={[...]} />
  const photoOutput = usePhotoOutput({ qualityPrioritization: 'balanced' })

  // v5 frame processor API: useFrameOutput with worklet onFrame callback.
  // We bridge OCR text back to JS via a global shared variable + setInterval poll,
  // because v5 doesn't ship runOnJS — that requires react-native-reanimated worklets.
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const frameOutput = useFrameOutput({
    onFrame(frame) {
      'worklet'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = scanOCR(frame as any)
      const text = result?.result?.text ?? ''
      // Store latest OCR text in globalThis so the polling interval can pick it up
      ;(globalThis as any).__ocrLatestText = text
    },
  })

  const startPolling = useCallback(() => {
    if (pollingRef.current) return
    pollingRef.current = setInterval(() => {
      const text: unknown = (globalThis as any).__ocrLatestText
      if (typeof text === 'string' && text.length > 0) {
        setCapturedText(text)
      }
    }, 500)
  }, [])

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    ;(globalThis as any).__ocrLatestText = undefined
  }, [])

  const handleCapture = useCallback(async () => {
    if (capturing) return
    setCapturing(true)
    try {
      // capturePhotoToFile: captures and writes directly to a temp file, returns { filePath }
      const photoFile = await photoOutput.capturePhotoToFile({}, {})
      const fileUri = photoFile.filePath.startsWith('file://')
        ? photoFile.filePath
        : `file://${photoFile.filePath}`
      setCapturedFilePath(fileUri)
      setPreviewMode(true)
      stopPolling()
    } catch {
      Alert.alert('Erro', 'Não foi possível capturar a foto.')
    } finally {
      setCapturing(false)
    }
  }, [capturing, photoOutput, stopPolling])

  const handleConfirm = useCallback(() => {
    if (!capturedFilePath) return
    const fileName =
      capturedFilePath.split('/').pop() ?? `comprovante_${Date.now()}.jpg`
    onCapture({
      texto: capturedText,
      fileUri: capturedFilePath,
      fileName,
      mimeType: 'image/jpeg',
    })
    setCapturedText('')
    setCapturedFilePath(null)
    setPreviewMode(false)
    onClose()
  }, [capturedFilePath, capturedText, onCapture, onClose])

  const handleClose = useCallback(() => {
    stopPolling()
    setCapturedText('')
    setCapturedFilePath(null)
    setPreviewMode(false)
    onClose()
  }, [onClose, stopPolling])

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
          <Pressable onPress={handleClose} className="mt-4">
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
          <Pressable onPress={handleClose} className="mt-4">
            <Text className="text-slate-400">Fechar</Text>
          </Pressable>
        </View>
      </Modal>
    )
  }

  return (
    <Modal visible={visible} animationType="slide" onShow={startPolling}>
      <View className="flex-1 bg-black">
        {!previewMode && (
          <Camera
            style={{ flex: 1 }}
            device={device}
            isActive={visible && !previewMode}
            outputs={[photoOutput, frameOutput]}
          />
        )}

        {capturedText.length > 0 ? (
          <View className="absolute bottom-32 left-4 right-4 bg-black/60 rounded-xl p-3">
            <Text className="text-white text-xs" numberOfLines={3}>
              {capturedText}
            </Text>
          </View>
        ) : null}

        <View className="absolute bottom-8 left-0 right-0 flex-row justify-around items-center px-8">
          <Pressable
            onPress={handleClose}
            className="bg-slate-700 px-5 py-3 rounded-full"
          >
            <Text className="text-white">Cancelar</Text>
          </Pressable>

          {!previewMode ? (
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
          ) : (
            <Pressable
              onPress={handleConfirm}
              className="bg-blue-600 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-semibold">Usar esta foto</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  )
}
