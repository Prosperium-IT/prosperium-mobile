import React from 'react'
import { View, Text } from 'react-native'

interface Props {
  data: {
    saldo?: number
    receitas_mes?: number
    despesas_mes?: number
    variacao_mes?: number
  }
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function DashboardFinancialMetrics({ data }: Props) {
  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        Métricas Financeiras
      </Text>

      <View className="gap-3">
        <View className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">Saldo Atual</Text>
          <Text className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-1">
            {formatCurrency(data.saldo ?? 0)}
          </Text>
        </View>

        <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">Receitas (Mês)</Text>
          <Text className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            {formatCurrency(data.receitas_mes ?? 0)}
          </Text>
        </View>

        <View className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">Despesas (Mês)</Text>
          <Text className="text-lg font-bold text-red-700 dark:text-red-300 mt-1">
            {formatCurrency(data.despesas_mes ?? 0)}
          </Text>
        </View>

        <View className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">Variação (Mês)</Text>
          <Text
            className={`text-lg font-bold mt-1 ${
              (data.variacao_mes ?? 0) >= 0
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-red-700 dark:text-red-300'
            }`}
          >
            {((data.variacao_mes ?? 0) >= 0 ? '+' : '')}{data.variacao_mes?.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  )
}
