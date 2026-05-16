import React from 'react'
import { View, Text, Alert, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useLancamento, updateLancamento, deleteLancamento } from '@/db/hooks/use-lancamentos'
import { LancamentoForm, FormValues } from './_components/LancamentoForm'
import { useSync } from '@/providers/sync-provider'

export default function LancamentoDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { triggerSync } = useSync()
  const lancamento = useLancamento(id)

  if (!lancamento) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500">Lançamento não encontrado.</Text>
      </View>
    )
  }

  async function handleSubmit(values: FormValues) {
    const valorNum = parseFloat(String(values.valor).replace(',', '.'))
    const pendenteRevisao =
      !valorNum || !values.dataLancamento || !values.idTpLcto || !values.idPessoa

    await updateLancamento(lancamento!, {
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
    void triggerSync()
    router.back()
  }

  function handleDelete() {
    Alert.alert('Excluir', 'Tem certeza que deseja excluir este lançamento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteLancamento(lancamento!)
          void triggerSync()
          router.back()
        },
      },
    ])
  }

  return (
    <View className="flex-1">
      {lancamento.pendenteRevisao && (
        <View className="bg-amber-50 border-b border-amber-200 px-4 py-2">
          <Text className="text-amber-700 text-xs font-medium">
            ⚠️ Este lançamento está pendente de revisão — preencha os campos obrigatórios para concluir.
          </Text>
        </View>
      )}

      <LancamentoForm
        initialValues={{
          dataLancamento: lancamento.dataLancamento,
          valor: String(lancamento.valor),
          natureza: lancamento.natureza,
          descricao: lancamento.descricao,
          idTpLcto: lancamento.idTpLcto,
          idPessoa: lancamento.idPessoa,
          idUnNegocio: lancamento.idUnNegocio,
          observacoes: lancamento.observacoes ?? '',
        }}
        onSubmit={handleSubmit}
        submitLabel="Salvar Alterações"
      />

      <Pressable
        onPress={handleDelete}
        className="mx-4 mb-6 py-3 rounded-xl border border-red-200 items-center active:bg-red-50"
      >
        <Text className="text-red-500 font-semibold">Excluir lançamento</Text>
      </Pressable>
    </View>
  )
}
