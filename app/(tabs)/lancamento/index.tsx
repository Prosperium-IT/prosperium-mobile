import React, { useState } from 'react'
import { View, FlatList, Text, RefreshControl, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useLancamentos } from '@/db/hooks/use-lancamentos'
import { useSync } from '@/providers/sync-provider'
import { SearchInput } from '@/components/ds/SearchInput'
import { FAB } from '@/components/ds/FAB'
import { LancamentoCard } from '@/components/lancamento/LancamentoCard'

export default function LancamentosTab() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [apenasAuditoria, setApenasAuditoria] = useState(false)

  const lancamentos = useLancamentos({ search, apenasAuditoria })
  const lancamentosAuditoria = useLancamentos({ apenasAuditoria: true })
  const { triggerSync, isSyncing } = useSync()

  const totalAuditoria = lancamentosAuditoria.length

  return (
    <View className="flex-1 bg-slate-50">
      {/* SearchInput */}
      <SearchInput value={search} onChangeText={setSearch} placeholder="Buscar lançamento..." />

      {/* Filtros */}
      <View className="px-4 pt-2 pb-2 flex-row gap-2">
        <Pressable
          onPress={() => setApenasAuditoria(false)}
          className={`px-3 py-1.5 rounded-full border ${!apenasAuditoria ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
        >
          <Text className={`text-xs font-medium ${!apenasAuditoria ? 'text-white' : 'text-slate-600'}`}>
            Todos
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setApenasAuditoria(true)}
          className={`px-3 py-1.5 rounded-full border flex-row items-center gap-1 ${apenasAuditoria ? 'bg-amber-500 border-amber-500' : 'bg-white border-slate-200'}`}
        >
          <Text className={`text-xs font-medium ${apenasAuditoria ? 'text-white' : 'text-slate-600'}`}>
            Auditoria
          </Text>
          {totalAuditoria > 0 && (
            <View className={`rounded-full px-1.5 py-0.5 ${apenasAuditoria ? 'bg-white' : 'bg-amber-500'}`}>
              <Text className={`text-xs font-bold ${apenasAuditoria ? 'text-amber-600' : 'text-white'}`}>
                {totalAuditoria}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Lista de Lançamentos */}
      <FlatList
        data={lancamentos}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-px bg-slate-100" />}
        ListEmptyComponent={
          <View className="px-4 py-12 items-center">
            <Text className="text-slate-500">
              {apenasAuditoria ? 'Nenhum lançamento pendente de auditoria.' : 'Nenhum lançamento encontrado.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <LancamentoCard
            lancamento={item}
            onPress={() => router.push(`/(tabs)/lancamento/${item.id}` as never)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isSyncing} onRefresh={() => triggerSync()} />
        }
      />

      {/* FAB — botão flutuante para novo lançamento */}
      <FAB onPress={() => router.push('/(tabs)/lancamento/novo' as never)} />
    </View>
  )
}
