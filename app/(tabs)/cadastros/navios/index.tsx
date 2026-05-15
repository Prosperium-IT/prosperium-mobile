import React, { useState } from 'react'
import { View, FlatList, Text, Pressable, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { useNavios } from '@/db/hooks/use-navios'
import { SearchInput } from '@/components/ds/SearchInput'
import { FAB } from '@/components/ds/FAB'
import { SyncBadge } from '@/components/ds/SyncBadge'
import { useSync } from '@/providers/sync-provider'

export default function NaviosList() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const navios = useNavios(search)
  const { triggerSync, isSyncing } = useSync()

  return (
    <View className="flex-1 bg-slate-50">
      <SearchInput value={search} onChangeText={setSearch} placeholder="Buscar navio..." />
      <FlatList
        data={navios}
        keyExtractor={(n) => n.id}
        refreshControl={<RefreshControl refreshing={isSyncing} onRefresh={() => void triggerSync()} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-px bg-slate-100" />}
        ListEmptyComponent={
          <View className="px-4 py-12 items-center">
            <Text className="text-slate-500">Nenhum navio cadastrado.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            className="bg-white px-4 py-3 active:bg-slate-50"
            onPress={() => router.push(`/(tabs)/cadastros/navios/${item.id}` as never)}
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-base text-slate-900 font-medium">{item.nome}</Text>
                <Text className="text-xs text-slate-500 mt-0.5">
                  {item.imo ? `IMO ${item.imo}` : 'Sem IMO'}
                  {item.bandeira ? ` • ${item.bandeira}` : ''}
                </Text>
              </View>
              <SyncBadge state={item.syncState} />
            </View>
          </Pressable>
        )}
      />
      <FAB onPress={() => router.push('/(tabs)/cadastros/navios/novo' as never)} label="Novo" />
    </View>
  )
}
