import React from 'react'
import { View, Text, FlatList } from 'react-native'

interface CashAccount {
  id: number
  nome: string
  saldo: number
  tipo: string
}

interface Props {
  data: CashAccount[]
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function getAccountTypeColor(tipo: string): string {
  switch (tipo?.toUpperCase()) {
    case 'CAIXA':
      return 'text-blue-600 dark:text-blue-400'
    case 'BANCO':
      return 'text-emerald-600 dark:text-emerald-400'
    case 'CARTAO':
      return 'text-purple-600 dark:text-purple-400'
    default:
      return 'text-slate-600 dark:text-slate-400'
  }
}

export function DashboardCashAccountsStatus({ data }: Props) {
  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        Status Contas de Caixa
      </Text>

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
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-medium text-slate-900 dark:text-white flex-1">
                    {item.nome}
                  </Text>
                  <Text className={`text-xs font-semibold ${getAccountTypeColor(item.tipo)}`}>
                    {item.tipo}
                  </Text>
                </View>
                <Text className={`text-xs font-medium mt-1 ${item.saldo >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(item.saldo)}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  )
}
