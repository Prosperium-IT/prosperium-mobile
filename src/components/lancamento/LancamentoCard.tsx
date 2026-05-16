import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Lancamento } from '@/db/models/Lancamento'
import { SyncBadge } from '@/components/ds/SyncBadge'

interface Props {
  lancamento: Lancamento
  onPress: () => void
}

function formatValor(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(data: string): string {
  const parts = data.split('-')
  if (parts.length === 3) return `${parts[2]}/${parts[1]}`
  return data
}

export function LancamentoCard({ lancamento, onPress }: Props) {
  const isEntrada = lancamento.natureza === 1

  return (
    <Pressable
      onPress={onPress}
      className={`bg-white px-4 py-3 active:bg-slate-50 flex-row items-center ${
        lancamento.pendenteRevisao ? 'border-l-4 border-l-amber-400' : ''
      }`}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-base text-slate-900 font-medium flex-1" numberOfLines={1}>
            {lancamento.descricao || '(sem descrição)'}
          </Text>
          {lancamento.pendenteRevisao && (
            <View className="bg-amber-100 rounded-full px-2 py-0.5">
              <Text className="text-amber-700 text-xs font-medium">revisão</Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center gap-2 mt-0.5">
          <Text className={`text-sm font-semibold ${isEntrada ? 'text-emerald-600' : 'text-red-500'}`}>
            {isEntrada ? '+' : '-'} {formatValor(lancamento.valor)}
          </Text>
          <Text className="text-xs text-slate-400">
            {formatData(lancamento.dataLancamento)}
          </Text>
        </View>
      </View>
      <View className="ml-2">
        <SyncBadge state={lancamento.syncState} size="sm" />
      </View>
    </Pressable>
  )
}
