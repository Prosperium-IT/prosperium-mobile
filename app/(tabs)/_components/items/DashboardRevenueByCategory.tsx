import React from 'react'
import { View, Text, FlatList } from 'react-native'

interface Category {
  id: number
  categoria: string
  valor: number
  percentual: number
}

interface Props {
  data: Category[]
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function DashboardRevenueByCategory({ data }: Props) {
  const total = data?.reduce((sum, cat) => sum + cat.valor, 0) ?? 0

  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Receitas por Categoria
        </Text>
        <View className="bg-emerald-100 dark:bg-emerald-900 rounded-lg px-2 py-1">
          <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-300">
            {formatCurrency(total)}
          </Text>
        </View>
      </View>

      {!data || data.length === 0 ? (
        <Text className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">
          Nenhuma categoria
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-px bg-slate-100 dark:bg-slate-700" />}
          renderItem={({ item }) => (
            <View className="py-2">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-sm font-medium text-slate-900 dark:text-white flex-1">
                  {item.categoria}
                </Text>
                <Text className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(item.valor)}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <View
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-400 h-full"
                    style={{ width: `${item.percentual}%` }}
                  />
                </View>
                <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-10 text-right">
                  {item.percentual.toFixed(1)}%
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  )
}
