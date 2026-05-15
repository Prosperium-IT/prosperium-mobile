import React, { useState } from 'react'
import { View, FlatList, Text, Pressable, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { useOperacoes } from '@/db/hooks/use-operacoes'
import { SearchInput } from '@/components/ds/SearchInput'
import { FAB } from '@/components/ds/FAB'
import { SyncBadge } from '@/components/ds/SyncBadge'
import { useSync } from '@/providers/sync-provider'

const STATUS_LABEL: Record<string, string> = {
  planejada: 'Planejada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
}

export default function OperacoesList() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const operacoes = useOperacoes(search)
  const { triggerSync, isSyncing } = useSync()

  return (
    <View className="flex-1 bg-slate-50">
      <SearchInput value={search} onChangeText={setSearch} placeholder="Buscar operação..." />
      <FlatList
        data={operacoes}
        keyExtractor={(o) => o.id}
        refreshControl={<RefreshControl refreshing={isSyncing} onRefresh={() => void triggerSync()} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-px bg-slate-100" />}
        ListEmptyComponent={
          <View className="px-4 py-12 items-center">
            <Text className="text-slate-500">Nenhuma operação cadastrada.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            className="bg-white px-4 py-3 active:bg-slate-50"
            onPress={() => router.push(`/(tabs)/cadastros/operacoes/${item.id}` as never)}
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-base text-slate-900 font-medium">{item.nome}</Text>
                <Text className="text-xs text-slate-500 mt-0.5">
                  {STATUS_LABEL[item.status] ?? item.status}
                  {item.codigo ? ` • ${item.codigo}` : ''}
                </Text>
              </View>
              <SyncBadge state={item.syncState} />
            </View>
          </Pressable>
        )}
      />
      <FAB onPress={() => router.push('/(tabs)/cadastros/operacoes/nova' as never)} label="Nova" />
    </View>
  )
}
