import React, { useState } from 'react'
import { View, ScrollView, RefreshControl, Pressable, Text } from 'react-native'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { dashboardConfig } from '@/adapters/mmkv-dashboard-storage'
import { DashboardItemRenderer } from './_components/DashboardItemRenderer'
import { DashboardPreferencesSheet } from './_components/DashboardPreferencesSheet'

export default function DashboardTab() {
  const { data, loading, error, refresh } = useDashboardData()
  const [showPreferences, setShowPreferences] = useState(false)

  const enabledItems = dashboardConfig.getEnabledItems()

  if (!data) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500">Carregando dashboard...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void refresh()} />}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-4 py-4 bg-white border-b border-slate-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-900">Dashboard</Text>
              <Text className="text-sm text-slate-500 mt-1">
                Última atualização: {new Date(data.timestamp * 1000).toLocaleString('pt-BR')}
              </Text>
            </View>
            <Pressable
              onPress={() => setShowPreferences(true)}
              className="p-2 rounded-lg bg-slate-100 active:bg-slate-200"
            >
              <Text className="text-xl">⚙️</Text>
            </Pressable>
          </View>
        </View>

        {/* Error banner */}
        {error && (
          <View className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <Text className="text-red-700 text-sm font-medium">{error}</Text>
          </View>
        )}

        {/* Items renderizados */}
        <View className="p-4 gap-4">
          {enabledItems.length === 0 ? (
            <View className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <Text className="text-amber-700 font-medium">
                Nenhum widget configurado. Abra as preferências para habilitar.
              </Text>
            </View>
          ) : (
            enabledItems.map((itemEnum) => (
              <DashboardItemRenderer
                key={itemEnum}
                itemEnum={itemEnum}
                itemData={data.items[itemEnum]}
              />
            ))
          )}
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Preferences Sheet */}
      <DashboardPreferencesSheet
        visible={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSave={() => {
          // Trigger refresh com novos items
          void refresh()
        }}
      />
    </View>
  )
}
