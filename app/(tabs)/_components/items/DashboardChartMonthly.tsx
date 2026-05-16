import React from 'react'
import { View, Text, FlatList } from 'react-native'

interface MonthlyData {
  mes: string
  receitas: number
  despesas: number
  resultado: number
}

interface Props {
  data: MonthlyData[]
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function getMonthName(mes: string): string {
  const mesNum = parseInt(mes)
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ]
  return meses[mesNum - 1] || mes
}

function getMaxValue(data: MonthlyData[]): number {
  return Math.max(...data.map(d => Math.max(d.receitas, d.despesas)))
}

export function DashboardChartMonthly({ data }: Props) {
  const maxValue = getMaxValue(data || [])
  const scale = maxValue > 0 ? 100 / maxValue : 1

  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        Resultado Mensal
      </Text>

      {!data || data.length === 0 ? (
        <Text className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">
          Nenhum dado
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.mes}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-px bg-slate-100 dark:bg-slate-700 my-2" />}
          renderItem={({ item }) => {
            const receitasHeight = (item.receitas * scale)
            const despesasHeight = (item.despesas * scale)

            return (
              <View className="py-2">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {getMonthName(item.mes)}
                  </Text>
                  <Text
                    className={`text-xs font-bold ${
                      item.resultado >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatCurrency(item.resultado)}
                  </Text>
                </View>

                <View className="flex-row items-end gap-1 h-8">
                  <View className="flex-1 items-center gap-0.5">
                    <View
                      className="w-full bg-gradient-to-t from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-400 rounded-t"
                      style={{ height: `${Math.max(receitasHeight, 4)}%` }}
                    />
                    <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {(item.receitas / 1000).toFixed(0)}k
                    </Text>
                  </View>
                  <View className="flex-1 items-center gap-0.5">
                    <View
                      className="w-full bg-gradient-to-t from-red-400 to-red-500 dark:from-red-500 dark:to-red-400 rounded-t"
                      style={{ height: `${Math.max(despesasHeight, 4)}%` }}
                    />
                    <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {(item.despesas / 1000).toFixed(0)}k
                    </Text>
                  </View>
                </View>
              </View>
            )
          }}
        />
      )}

      <View className="flex-row items-center gap-4 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 bg-emerald-500 rounded-full" />
          <Text className="text-xs text-slate-600 dark:text-slate-400">Receitas</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 bg-red-500 rounded-full" />
          <Text className="text-xs text-slate-600 dark:text-slate-400">Despesas</Text>
        </View>
      </View>
    </View>
  )
}
