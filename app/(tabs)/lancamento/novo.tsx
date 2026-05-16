import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useSync } from '@/providers/sync-provider'
import { configStorage } from '@/adapters/mmkv-storage'
import { OcrCameraSheet } from '@/components/lancamento/OcrCameraSheet'
import { LancamentoForm, FormValues } from '@/components/lancamento/LancamentoForm'
import { createLancamento } from '@/db/hooks/use-lancamentos'
import { callOcr, uploadAnexo } from '@/services/lancamento-service'

const OCR_QUEUE_KEY = 'ocr_pending_queue'

interface OcrQueueItem {
  fileUri: string
  fileName: string
  mimeType: string
  texto: string
  enqueuedAt: number
}

function enqueueOcrItem(item: OcrQueueItem) {
  const existing = configStorage.get(OCR_QUEUE_KEY)
  const queue: OcrQueueItem[] = existing ? JSON.parse(existing) : []
  queue.push(item)
  configStorage.set(OCR_QUEUE_KEY, JSON.stringify(queue))
}

type Modo = 'escolha' | 'foto' | 'manual'

interface OcrResult {
  texto: string
  fileUri: string
  fileName: string
  mimeType: string
  campos?: {
    valor?: number | null
    data?: string | null
    natureza?: 1 | 2 | null
    descricao?: string | null
    idPessoa?: number | null
  }
  camposOcr?: Set<string>
}

export default function LancamentoNovo() {
  const router = useRouter()
  const database = useDatabase()
  const { triggerSync } = useSync()
  const [modo, setModo] = useState<Modo>('escolha')
  const [cameraOpen, setCameraOpen] = useState(false)
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null)
  const [processandoOcr, setProcessandoOcr] = useState(false)

  async function handleCaptured(captured: {
    texto: string
    fileUri: string
    fileName: string
    mimeType: string
  }) {
    setProcessandoOcr(true)
    let campos: OcrResult['campos'] = {}
    const camposOcr = new Set<string>()
    try {
      const result = await callOcr({ texto: captured.texto })
      if (result.valor != null) {
        campos.valor = result.valor
        camposOcr.add('valor')
      }
      if (result.data) {
        campos.data = result.data
        camposOcr.add('data')
      }
      if (result.natureza != null) {
        campos.natureza = result.natureza as 1 | 2
        camposOcr.add('natureza')
      }
      if (result.descricao) {
        campos.descricao = result.descricao
        camposOcr.add('descricao')
      }
      if (result.id_pessoa != null) {
        campos.idPessoa = result.id_pessoa
      }
    } catch {
      // Offline ou falha: salvar em fila MMKV para processar depois
      enqueueOcrItem({
        fileUri: captured.fileUri,
        fileName: captured.fileName,
        mimeType: captured.mimeType,
        texto: captured.texto,
        enqueuedAt: Date.now(),
      })
    } finally {
      setProcessandoOcr(false)
    }
    setOcrResult({ ...captured, campos, camposOcr })
    setModo('foto')
  }

  async function handleSubmit(values: FormValues) {
    const valorNum = parseFloat(String(values.valor).replace(',', '.'))
    const pendenteRevisao =
      !valorNum || !values.dataLancamento || !values.idTpLcto || !values.idPessoa

    const lancamento = await createLancamento(database, {
      dataLancamento: values.dataLancamento,
      valor: valorNum,
      natureza: values.natureza,
      descricao: values.descricao,
      idPessoa: values.idPessoa,
      idTpLcto: values.idTpLcto,
      idUnNegocio: values.idUnNegocio,
      observacoes: values.observacoes,
      pendenteRevisao,
    })

    if (ocrResult?.fileUri && lancamento.serverId) {
      try {
        await uploadAnexo({
          lancamentoServerId: lancamento.serverId,
          fileUri: ocrResult.fileUri,
          fileName: ocrResult.fileName,
          mimeType: ocrResult.mimeType,
          tipoDocumento: values.tipoDocumento ?? undefined,
          enviarContabilidade: values.enviarContabilidade,
        })
      } catch {
        // Upload de foto falha silenciosamente — será retentado após sync
      }
    }

    void triggerSync()
    router.back()
  }

  if (modo === 'escolha') {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-8 gap-4">
        <Text className="text-lg font-semibold text-slate-800 mb-2">Novo Lançamento</Text>

        <Pressable
          onPress={() => setCameraOpen(true)}
          className="w-full bg-blue-600 active:bg-blue-700 rounded-2xl p-5 items-center"
        >
          <Text className="text-white text-2xl mb-1">📷</Text>
          <Text className="text-white text-base font-semibold">Tirar foto do comprovante</Text>
          <Text className="text-blue-200 text-xs mt-1">OCR preenche automaticamente</Text>
        </Pressable>

        <Pressable
          onPress={() => setModo('manual')}
          className="w-full bg-white border border-slate-200 active:bg-slate-50 rounded-2xl p-5 items-center"
        >
          <Text className="text-slate-600 text-2xl mb-1">📝</Text>
          <Text className="text-slate-800 text-base font-semibold">Preencher manualmente</Text>
        </Pressable>

        <OcrCameraSheet
          visible={cameraOpen}
          onClose={() => setCameraOpen(false)}
          onCapture={(captured) => {
            setCameraOpen(false)
            void handleCaptured(captured)
          }}
        />
      </View>
    )
  }

  if (processandoOcr) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500 mt-2">Analisando comprovante...</Text>
      </View>
    )
  }

  return (
    <LancamentoForm
      initialValues={{
        valor: ocrResult?.campos?.valor != null ? String(ocrResult.campos.valor) : '',
        dataLancamento: ocrResult?.campos?.data ?? '',
        natureza: ocrResult?.campos?.natureza ?? 2,
        descricao: ocrResult?.campos?.descricao ?? '',
        idPessoa: ocrResult?.campos?.idPessoa ?? null,
      }}
      ocrFields={ocrResult?.camposOcr}
      onSubmit={handleSubmit}
      submitLabel="Salvar Lançamento"
    />
  )
}
