import React from 'react'
import { View, Text, FlatList } from 'react-native'

interface Transaction {
  id: number
  valor: number
  descricao: string
  data: string
  natureza: 1 | 2
}

interface Props {
  data: Transaction[]
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(data: string): string {
  const [year, month, day] = data.split('-')
  return `${day}/${month}`
}

export function DashboardTransactionsRecent({ data }: Props) {
  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        Transações Recentes
      </Text>

      {!data || data.length === 0 ? (
        <Text className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">
          Nenhuma transação
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-px bg-slate-100 dark:bg-slate-700" />}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-1">
                <Text className="text-sm font-medium text-slate-900 dark:text-white">
                  {item.descricao}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formatData(item.data)}
                </Text>
              </View>
              <Text
                className={`font-semibold ${
                  item.natureza === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {item.natureza === 1 ? '+' : '-'} {formatCurrency(item.valor)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  )
}
