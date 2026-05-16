import React from 'react'
import { View, Text, FlatList } from 'react-native'

interface Activity {
  id: number
  tipo: string
  descricao: string
  data: string
  hora?: string
  usuario?: string
}

interface Props {
  data: Activity[]
}

function formatData(data: string): string {
  const [year, month, day] = data.split('-')
  return `${day}/${month}`
}

function getActivityTypeColor(tipo: string): string {
  switch (tipo?.toUpperCase()) {
    case 'LANCAMENTO':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
    case 'OPERACAO':
      return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
    case 'PAGAMENTO':
      return 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400'
    default:
      return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
  }
}

export function DashboardDailyActivity({ data }: Props) {
  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        Atividade Diária
      </Text>

      {!data || data.length === 0 ? (
        <Text className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">
          Nenhuma atividade
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-px bg-slate-100 dark:bg-slate-700" />}
          renderItem={({ item }) => (
            <View className="flex-row items-start gap-3 py-2">
              <View
                className={`rounded-full px-3 py-1 mt-0.5 ${getActivityTypeColor(item.tipo)}`}
              >
                <Text className="text-xs font-semibold">{item.tipo.slice(0, 3)}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-slate-900 dark:text-white">
                  {item.descricao}
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                    {formatData(item.data)}
                  </Text>
                  {item.hora && (
                    <>
                      <Text className="text-xs text-slate-300">•</Text>
                      <Text className="text-xs text-slate-500 dark:text-slate-400">
                        {item.hora}
                      </Text>
                    </>
                  )}
                  {item.usuario && (
                    <>
                      <Text className="text-xs text-slate-300">•</Text>
                      <Text className="text-xs text-slate-500 dark:text-slate-400">
                        {item.usuario}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  )
}
