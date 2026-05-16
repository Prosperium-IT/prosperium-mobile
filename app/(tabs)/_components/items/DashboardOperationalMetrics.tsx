import React from 'react'
import { View, Text } from 'react-native'

interface Props {
  data: {
    operacoes_total?: number
    operacoes_ativas?: number
    operacoes_concluidas?: number
    taxa_conclusao?: number
  }
}

export function DashboardOperationalMetrics({ data }: Props) {
  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        Métricas Operacionais
      </Text>

      <View className="gap-3">
        <View className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Operações Totais
          </Text>
          <Text className="text-lg font-bold text-purple-700 dark:text-purple-300 mt-1">
            {data.operacoes_total ?? 0}
          </Text>
        </View>

        <View className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Operações Ativas
          </Text>
          <Text className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-1">
            {data.operacoes_ativas ?? 0}
          </Text>
        </View>

        <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Operações Concluídas
          </Text>
          <Text className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            {data.operacoes_concluidas ?? 0}
          </Text>
        </View>

        <View className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Taxa de Conclusão
          </Text>
          <Text className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-1">
            {(data.taxa_conclusao ?? 0).toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  )
}
