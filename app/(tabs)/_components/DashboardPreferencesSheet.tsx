import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Switch, Pressable, Alert } from 'react-native'
import { dashboardConfig } from '@/adapters/mmkv-dashboard-storage'
import { updateDashboardItems } from '@/services/dashboard-service'
import { Button } from '@/components/ds/Button'

const ALL_ITEMS = [
  'FINANCIAL_METRICS',
  'TRANSACTIONS_RECENT',
  'UPCOMING_PAYMENTS',
  'OPERATIONAL_METRICS',
  'ACTIVE_OPERATIONS',
  'CASH_ACCOUNTS_STATUS',
  'DAILY_ACTIVITY',
  'ACCOUNT_BALANCES',
  'REVENUE_BY_CATEGORY',
  'EXPENSE_BY_CATEGORY',
  'PAYMENT_STATUS',
  'CHART_MONTHLY',
]

const ITEM_LABELS: Record<string, string> = {
  FINANCIAL_METRICS: 'Métricas Financeiras',
  TRANSACTIONS_RECENT: 'Transações Recentes',
  UPCOMING_PAYMENTS: 'Próximos Vencimentos',
  OPERATIONAL_METRICS: 'Estatísticas Operacionais',
  ACTIVE_OPERATIONS: 'Operações Ativas',
  CASH_ACCOUNTS_STATUS: 'Status de Contas Caixa',
  DAILY_ACTIVITY: 'Atividade Diária',
  ACCOUNT_BALANCES: 'Saldos de Contas',
  REVENUE_BY_CATEGORY: 'Receitas por Categoria',
  EXPENSE_BY_CATEGORY: 'Despesas por Categoria',
  PAYMENT_STATUS: 'Status de Pagamentos',
  CHART_MONTHLY: 'Gráfico Mensal',
}

interface Props {
  visible: boolean
  onClose: () => void
  onSave?: () => void
}

export function DashboardPreferencesSheet({ visible, onClose, onSave }: Props) {
  const [enabledItems, setEnabledItems] = useState<string[]>([])
  const [refreshInterval, setRefreshInterval] = useState(300)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (visible) {
      setEnabledItems(dashboardConfig.getEnabledItems())
      setRefreshInterval(dashboardConfig.getRefreshIntervalSeconds())
    }
  }, [visible])

  async function handleSave() {
    setSaving(true)
    try {
      // Salva no backend
      await updateDashboardItems(enabledItems)

      // Salva em MMKV
      dashboardConfig.setEnabledItems(enabledItems)
      dashboardConfig.setRefreshIntervalSeconds(refreshInterval)

      Alert.alert('Sucesso', 'Preferências salvas')
      onSave?.()
      onClose()
    } catch (err) {
      Alert.alert('Erro', 'Falha ao salvar preferências')
      console.error('Error saving preferences:', err)
    } finally {
      setSaving(false)
    }
  }

  if (!visible) return null

  return (
    <View className="absolute inset-0 bg-black/50 flex items-end">
      <View className="w-full bg-white rounded-t-3xl p-6 max-h-4/5">
        <Text className="text-xl font-bold text-slate-900 mb-6">Preferências</Text>

        {/* Toggles dos items */}
        <ScrollView className="mb-6 max-h-96">
          {ALL_ITEMS.map((item) => (
            <View
              key={item}
              className="flex-row items-center justify-between py-3 border-b border-slate-100"
            >
              <Text className="text-slate-700 flex-1">{ITEM_LABELS[item]}</Text>
              <Switch
                value={enabledItems.includes(item)}
                onValueChange={(value) => {
                  if (value) {
                    setEnabledItems([...enabledItems, item])
                  } else {
                    setEnabledItems(enabledItems.filter((i) => i !== item))
                  }
                }}
              />
            </View>
          ))}
        </ScrollView>

        {/* Config de refresh */}
        <View className="mb-6 bg-slate-50 rounded-xl p-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Auto-refresh a cada: {refreshInterval} segundos
          </Text>
          <View className="flex-row gap-2">
            {[60, 300, 600, 1800].map((sec) => (
              <Pressable
                key={sec}
                onPress={() => setRefreshInterval(sec)}
                className={`flex-1 py-2 rounded-lg items-center ${
                  refreshInterval === sec ? 'bg-blue-600' : 'bg-white border border-slate-200'
                }`}
              >
                <Text
                  className={
                    refreshInterval === sec
                      ? 'text-white text-xs font-semibold'
                      : 'text-slate-600 text-xs'
                  }
                >
                  {sec < 60 ? sec + 's' : sec < 3600 ? Math.round(sec / 60) + 'm' : Math.round(sec / 3600) + 'h'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Botões */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-300 items-center active:bg-slate-100"
          >
            <Text className="text-slate-700 font-semibold">Cancelar</Text>
          </Pressable>
          <Button label="Salvar" onPress={() => void handleSave()} loading={saving} className="flex-1" />
        </View>
      </View>
    </View>
  )
}
