import React from 'react'
import { View, Text, FlatList } from 'react-native'

interface Account {
  id: number
  conta: string
  saldo: number
  tipo: string
}

interface Props {
  data: Account[]
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function getBalanceColor(saldo: number): string {
  if (saldo > 0) {
    return 'text-emerald-600 dark:text-emerald-400'
  } else if (saldo < 0) {
    return 'text-red-600 dark:text-red-400'
  }
  return 'text-slate-600 dark:text-slate-400'
}

export function DashboardAccountBalances({ data }: Props) {
  const totalBalance = data?.reduce((sum, account) => sum + account.saldo, 0) ?? 0

  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Saldos de Contas
        </Text>
        <View className="bg-slate-100 dark:bg-slate-700 rounded-lg px-2 py-1">
          <Text className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {formatCurrency(totalBalance)}
          </Text>
        </View>
      </View>

      {!data || data.length === 0 ? (
        <Text className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">
          Nenhuma conta
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
                  {item.conta}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.tipo}
                </Text>
              </View>
              <Text className={`font-semibold ${getBalanceColor(item.saldo)}`}>
                {formatCurrency(item.saldo)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  )
}
