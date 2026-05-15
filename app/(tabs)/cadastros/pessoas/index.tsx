import React, { useState } from 'react'
import { View, FlatList, Text, Pressable, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { usePessoas } from '@/db/hooks/use-pessoas'
import { SearchInput } from '@/components/ds/SearchInput'
import { FAB } from '@/components/ds/FAB'
import { SyncBadge } from '@/components/ds/SyncBadge'
import { useSync } from '@/providers/sync-provider'

export default function PessoasList() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const pessoas = usePessoas(search)
  const { triggerSync, isSyncing } = useSync()

  return (
    <View className="flex-1 bg-slate-50">
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar pessoa..."
      />
      <FlatList
        data={pessoas}
        keyExtractor={(p) => p.id}
        refreshControl={
          <RefreshControl refreshing={isSyncing} onRefresh={() => void triggerSync()} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-px bg-slate-100" />}
        ListEmptyComponent={
          <View className="px-4 py-12 items-center">
            <Text className="text-slate-500">Nenhuma pessoa cadastrada.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            className="bg-white px-4 py-3 active:bg-slate-50"
            onPress={() => router.push(`/(tabs)/cadastros/pessoas/${item.id}` as never)}
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-base text-slate-900 font-medium">{item.nome}</Text>
                <Text className="text-xs text-slate-500 mt-0.5">
                  {item.tipo === 'F' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  {item.cpfCnpj ? ` • ${item.cpfCnpj}` : ''}
                </Text>
              </View>
              <SyncBadge state={item.syncState} />
            </View>
          </Pressable>
        )}
      />
      <FAB
        onPress={() => router.push('/(tabs)/cadastros/pessoas/nova' as never)}
        label="Nova"
      />
    </View>
  )
}
