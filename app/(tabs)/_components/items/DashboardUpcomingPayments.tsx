import React from 'react'
import { View, Text, FlatList } from 'react-native'

interface Payment {
  id: number
  valor: number
  descricao: string
  data_vencimento: string
  pessoa?: string
}

interface Props {
  data: Payment[]
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function daysUntil(date: string): number {
  const vencimento = new Date(date)
  const hoje = new Date()
  const diff = vencimento.getTime() - hoje.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function formatData(data: string): string {
  const [year, month, day] = data.split('-')
  return `${day}/${month}/${year.slice(-2)}`
}

export function DashboardUpcomingPayments({ data }: Props) {
  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        Próximos Vencimentos
      </Text>

      {!data || data.length === 0 ? (
        <Text className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">
          Nenhum vencimento
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-px bg-slate-100 dark:bg-slate-700" />}
          renderItem={({ item }) => {
            const days = daysUntil(item.data_vencimento)
            const isUrgent = days <= 3
            return (
              <View className="flex-row items-center justify-between py-2">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-900 dark:text-white">
                    {item.descricao}
                  </Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatData(item.data_vencimento)} ({days} dias)
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(item.valor)}
                  </Text>
                  {isUrgent && (
                    <View className="bg-red-100 dark:bg-red-900 rounded-full px-2 py-0.5">
                      <Text className="text-red-700 dark:text-red-300 text-xs font-bold">!</Text>
                    </View>
                  )}
                </View>
              </View>
            )
          }}
        />
      )}
    </View>
  )
}
