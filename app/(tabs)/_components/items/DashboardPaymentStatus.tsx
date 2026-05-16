import React from 'react'
import { View, Text } from 'react-native'

interface Props {
  data: {
    total_pendente?: number
    total_pago?: number
    total_cancelado?: number
    percentual_pago?: number
  }
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function DashboardPaymentStatus({ data }: Props) {
  const total = (data.total_pendente ?? 0) + (data.total_pago ?? 0) + (data.total_cancelado ?? 0)

  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        Status de Pagamentos
      </Text>

      <View className="gap-3">
        <View className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">Pendente</Text>
          <Text className="text-lg font-bold text-orange-700 dark:text-orange-300 mt-1">
            {formatCurrency(data.total_pendente ?? 0)}
          </Text>
        </View>

        <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">Pago</Text>
          <Text className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            {formatCurrency(data.total_pago ?? 0)}
          </Text>
        </View>

        <View className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-lg p-3">
          <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">Cancelado</Text>
          <Text className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-1">
            {formatCurrency(data.total_cancelado ?? 0)}
          </Text>
        </View>

        <View className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 border-l-4 border-blue-500">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Taxa de Liquidação
            </Text>
            <Text className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {(data.percentual_pago ?? 0).toFixed(1)}%
            </Text>
          </View>
          <View className="bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
            <View
              className="bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-400 h-full"
              style={{ width: `${Math.min(data.percentual_pago ?? 0, 100)}%` }}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
