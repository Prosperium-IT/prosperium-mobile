import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, Switch, Alert, TextInput as RNTextInput } from 'react-native'
import { useTpLctos } from '@/db/hooks/use-tp-lctos'
import { useUnNegociosPermitidos } from '@/db/hooks/use-un-negocios-permitidos'
import { TipoDocumento } from '@/services/lancamento-service'

const TIPOS_DOCUMENTO: { label: string; value: TipoDocumento }[] = [
  { label: 'Nota Fiscal', value: 'nota_fiscal' },
  { label: 'Nota Débito', value: 'nota_debito' },
  { label: 'Recibo', value: 'recibo' },
  { label: 'Boleto', value: 'boleto' },
  { label: 'Contrato', value: 'contrato' },
  { label: 'Comprovante Pgto', value: 'comprovante_pagamento' },
  { label: 'Invoice', value: 'invoice' },
]

export interface FormValues {
  dataLancamento: string
  valor: string
  natureza: 1 | 2
  descricao: string
  idTpLcto: number | null
  idPessoa: number | null
  idUnNegocio: number | null
  observacoes: string
  tipoDocumento: TipoDocumento | null
  enviarContabilidade: boolean
}

interface Props {
  initialValues?: Partial<FormValues>
  ocrFields?: Set<string>
  onSubmit: (values: FormValues) => Promise<void>
  submitLabel?: string
}

export function LancamentoForm({ initialValues, ocrFields = new Set(), onSubmit, submitLabel = 'Salvar' }: Props) {
  const [dataLancamento, setDataLancamento] = useState(initialValues?.dataLancamento ?? '')
  const [valor, setValor] = useState(initialValues?.valor ?? '')
  const [natureza, setNatureza] = useState<1 | 2>(initialValues?.natureza ?? 2)
  const [descricao, setDescricao] = useState(initialValues?.descricao ?? '')
  const [idTpLcto, setIdTpLcto] = useState<number | null>(initialValues?.idTpLcto ?? null)
  const [idUnNegocio, setIdUnNegocio] = useState<number | null>(initialValues?.idUnNegocio ?? null)
  const [observacoes, setObservacoes] = useState(initialValues?.observacoes ?? '')
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento | null>(initialValues?.tipoDocumento ?? null)
  const [enviarContabilidade, setEnviarContabilidade] = useState(initialValues?.enviarContabilidade ?? false)
  const [saving, setSaving] = useState(false)

  const tpLctos = useTpLctos(natureza)
  const uns = useUnNegociosPermitidos()

  React.useEffect(() => {
    if (uns.length === 1 && !idUnNegocio) {
      setIdUnNegocio(uns[0].serverId)
    }
  }, [uns])

  async function handleSubmit() {
    const valorNum = parseFloat(valor.replace(',', '.'))
    if (!valor || isNaN(valorNum) || valorNum <= 0) {
      Alert.alert('Validação', 'Informe um valor válido.')
      return
    }
    if (!dataLancamento) {
      Alert.alert('Validação', 'Informe a data do lançamento.')
      return
    }
    setSaving(true)
    try {
      await onSubmit({
        dataLancamento,
        valor: valor.replace(',', '.'),
        natureza,
        descricao,
        idTpLcto,
        idPessoa: initialValues?.idPessoa ?? null,
        idUnNegocio,
        observacoes,
        tipoDocumento,
        enviarContabilidade,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4" keyboardShouldPersistTaps="handled">
      {/* Natureza */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-slate-700 mb-1">Natureza *</Text>
        <View className="flex-row gap-2">
          {([1, 2] as const).map((n) => (
            <Pressable
              key={n}
              onPress={() => { setNatureza(n); setIdTpLcto(null) }}
              className={`flex-1 py-3 rounded-xl items-center border ${
                natureza === n
                  ? n === 1 ? 'bg-emerald-100 border-emerald-400' : 'bg-red-100 border-red-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`font-semibold ${natureza === n ? (n === 1 ? 'text-emerald-700' : 'text-red-600') : 'text-slate-500'}`}>
                {n === 1 ? '↑ Entrada' : '↓ Saída'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Valor */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-slate-700 mb-1">
          Valor * {ocrFields.has('valor') ? '(OCR — revise)' : ''}
        </Text>
        <RNTextInput
          value={valor}
          onChangeText={setValor}
          keyboardType="decimal-pad"
          placeholder="0,00"
          className={`bg-white border rounded-xl px-4 py-3 text-slate-900 ${ocrFields.has('valor') ? 'border-blue-400' : 'border-slate-200'}`}
        />
      </View>

      {/* Data */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-slate-700 mb-1">
          Data * {ocrFields.has('data') ? '(OCR — revise)' : ''}
        </Text>
        <RNTextInput
          value={dataLancamento}
          onChangeText={setDataLancamento}
          placeholder="YYYY-MM-DD"
          className={`bg-white border rounded-xl px-4 py-3 text-slate-900 ${ocrFields.has('data') ? 'border-blue-400' : 'border-slate-200'}`}
        />
      </View>

      {/* Descrição */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-slate-700 mb-1">
          Descrição {ocrFields.has('descricao') ? '(OCR — revise)' : ''}
        </Text>
        <RNTextInput
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição do lançamento"
          className={`bg-white border rounded-xl px-4 py-3 text-slate-900 ${ocrFields.has('descricao') ? 'border-blue-400' : 'border-slate-200'}`}
        />
      </View>

      {/* Tipo de Lançamento */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-slate-700 mb-1">Tipo de Lançamento *</Text>
        <View className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {tpLctos.length === 0 ? (
            <Text className="p-3 text-slate-400 text-sm">Nenhum tipo disponível (sync pendente)</Text>
          ) : (
            tpLctos.map((tp) => (
              <Pressable
                key={tp.id}
                onPress={() => setIdTpLcto(tp.serverId)}
                className={`px-4 py-3 border-b border-slate-100 active:bg-slate-50 ${idTpLcto === tp.serverId ? 'bg-blue-50' : ''}`}
              >
                <Text className={`text-sm ${idTpLcto === tp.serverId ? 'text-blue-700 font-semibold' : 'text-slate-800'}`}>
                  {tp.descricao}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      </View>

      {/* UN Negócio */}
      {uns.length > 1 && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-1">UN Negócio</Text>
          <View className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {uns.map((un) => (
              <Pressable
                key={un.id}
                onPress={() => setIdUnNegocio(un.serverId)}
                className={`px-4 py-3 border-b border-slate-100 active:bg-slate-50 ${idUnNegocio === un.serverId ? 'bg-blue-50' : ''}`}
              >
                <Text className={`text-sm ${idUnNegocio === un.serverId ? 'text-blue-700 font-semibold' : 'text-slate-800'}`}>
                  {un.nome}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Tipo de Documento */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-slate-700 mb-1">Tipo de Documento</Text>
        <View className="flex-row flex-wrap gap-2">
          {TIPOS_DOCUMENTO.map((t) => (
            <Pressable
              key={t.value}
              onPress={() => setTipoDocumento(tipoDocumento === t.value ? null : t.value)}
              className={`px-3 py-2 rounded-lg border ${
                tipoDocumento === t.value ? 'bg-blue-100 border-blue-400' : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`text-xs ${tipoDocumento === t.value ? 'text-blue-700 font-semibold' : 'text-slate-600'}`}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Enviar para Contabilidade */}
      <View className="mb-4 flex-row items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3">
        <Text className="text-sm text-slate-700">Enviar para Contabilidade</Text>
        <Switch value={enviarContabilidade} onValueChange={setEnviarContabilidade} />
      </View>

      {/* Observações */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-slate-700 mb-1">Observações</Text>
        <RNTextInput
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Observações adicionais"
          multiline
          numberOfLines={3}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
          style={{ textAlignVertical: 'top', minHeight: 80 }}
        />
      </View>

      {/* Botão Submit */}
      <Pressable
        onPress={handleSubmit}
        disabled={saving}
        className={`py-4 rounded-xl items-center ${saving ? 'bg-slate-300' : 'bg-blue-600 active:bg-blue-700'}`}
      >
        <Text className="text-white font-semibold text-base">
          {saving ? 'Salvando...' : submitLabel}
        </Text>
      </Pressable>
      <View className="h-8" />
    </ScrollView>
  )
}
