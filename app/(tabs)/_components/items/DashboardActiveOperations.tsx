import React from 'react'
import { View, Text, FlatList } from 'react-native'

interface Operation {
  id: number
  numero: string
  descricao: string
  status: string
  navio?: string
  data_inicio?: string
}

interface Props {
  data: Operation[]
}

function formatData(data: string): string {
  const [year, month, day] = data.split('-')
  return `${day}/${month}/${year.slice(-2)}`
}

function getStatusColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'ATIVA':
      return 'text-blue-600 dark:text-blue-400'
    case 'CONCLUIDA':
      return 'text-emerald-600 dark:text-emerald-400'
    case 'CANCELADA':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-slate-600 dark:text-slate-400'
  }
}

export function DashboardActiveOperations({ data }: Props) {
  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        Operações Ativas
      </Text>

      {!data || data.length === 0 ? (
        <Text className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">
          Nenhuma operação
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-px bg-slate-100 dark:bg-slate-700" />}
          renderItem={({ item }) => (
            <View className="py-2">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-sm font-medium text-slate-900 dark:text-white flex-1">
                  {item.numero}
                </Text>
                <Text className={`text-xs font-semibold ${getStatusColor(item.status)}`}>
                  {item.status}
                </Text>
              </View>
              <Text className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">
                {item.descricao}
              </Text>
              {item.navio && (
                <Text className="text-xs text-slate-500 dark:text-slate-500">
                  Navio: {item.navio}
                </Text>
              )}
              {item.data_inicio && (
                <Text className="text-xs text-slate-500 dark:text-slate-500">
                  Desde: {formatData(item.data_inicio)}
                </Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  )
}
