import React, { useState } from 'react'
import { View, FlatList, Text, Pressable, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { usePortos } from '@/db/hooks/use-portos'
import { SearchInput } from '@/components/ds/SearchInput'
import { FAB } from '@/components/ds/FAB'
import { SyncBadge } from '@/components/ds/SyncBadge'
import { useSync } from '@/providers/sync-provider'

export default function PortosList() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const portos = usePortos(search)
  const { triggerSync, isSyncing } = useSync()

  return (
    <View className="flex-1 bg-slate-50">
      <SearchInput value={search} onChangeText={setSearch} placeholder="Buscar porto..." />
      <FlatList
        data={portos}
        keyExtractor={(p) => p.id}
        refreshControl={<RefreshControl refreshing={isSyncing} onRefresh={() => void triggerSync()} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-px bg-slate-100" />}
        ListEmptyComponent={
          <View className="px-4 py-12 items-center">
            <Text className="text-slate-500">Nenhum porto cadastrado.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            className="bg-white px-4 py-3 active:bg-slate-50"
            onPress={() => router.push(`/(tabs)/cadastros/portos/${item.id}` as never)}
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-base text-slate-900 font-medium">{item.nome}</Text>
                <Text className="text-xs text-slate-500 mt-0.5">
                  {item.codigoLocode ?? 'Sem LOCODE'}
                  {item.pais ? ` • ${item.pais}` : ''}
                  {item.estado ? `/${item.estado}` : ''}
                </Text>
              </View>
              <SyncBadge state={item.syncState} />
            </View>
          </Pressable>
        )}
      />
      <FAB onPress={() => router.push('/(tabs)/cadastros/portos/novo' as never)} label="Novo" />
    </View>
  )
}
