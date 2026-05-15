import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, Alert, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useOperacao } from '@/db/hooks/use-operacoes'
import { useNavios } from '@/db/hooks/use-navios'
import { usePortos } from '@/db/hooks/use-portos'
import { TextInput } from '@/components/ds/TextInput'
import { Button } from '@/components/ds/Button'
import { SyncBadge } from '@/components/ds/SyncBadge'
import { useSync } from '@/providers/sync-provider'

const STATUS_OPTIONS = ['planejada', 'em_andamento', 'concluida', 'cancelada'] as const
type Status = (typeof STATUS_OPTIONS)[number]

export default function OperacaoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const database = useDatabase()
  const op = useOperacao(id)
  const { triggerSync } = useSync()
  const navios = useNavios()
  const portos = usePortos()

  const [nome, setNome] = useState('')
  const [codigo, setCodigo] = useState('')
  const [navioServerId, setNavioServerId] = useState<number | null>(null)
  const [portoServerId, setPortoServerId] = useState<number | null>(null)
  const [dataInicio, setDataInicio] = useState('')
  const [dataFimPrev, setDataFimPrev] = useState('')
  const [valorPrev, setValorPrev] = useState('')
  const [status, setStatus] = useState<Status>('planejada')
  const [observacoes, setObservacoes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!op) return
    setNome(op.nome)
    setCodigo(op.codigo ?? '')
    setNavioServerId(op.idNavio)
    setPortoServerId(op.idPorto)
    setDataInicio(op.dataInicio ?? '')
    setDataFimPrev(op.dataFimPrevista ?? '')
    setValorPrev(op.valorPrevisto != null ? String(op.valorPrevisto) : '')
    setStatus((op.status as Status) ?? 'planejada')
    setObservacoes(op.observacoes ?? '')
  }, [op])

  if (!op) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-slate-500">Carregando...</Text>
      </View>
    )
  }

  async function handleSave() {
    if (!nome.trim()) return Alert.alert('Validação', 'Nome é obrigatório')
    setSaving(true)
    try {
      await database.write(async () => {
        await op!.update((o: any) => {
          o._raw.nome = nome.trim()
          o._raw.codigo = codigo.trim() || null
          o._raw.id_navio = navioServerId
          o._raw.id_porto = portoServerId
          o._raw.data_inicio = dataInicio.trim() || null
          o._raw.data_fim_prevista = dataFimPrev.trim() || null
          o._raw.valor_previsto = valorPrev ? Number(valorPrev) : null
          o._raw.status = status
          o._raw.observacoes = observacoes.trim() || null
          o._raw.sync_status = 'pending'
        })
      })
      void triggerSync()
      router.back()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    Alert.alert('Excluir', 'Deseja excluir esta operação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await database.write(async () => {
            await op!.destroyPermanently()
          })
          router.back()
        },
      },
    ])
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-4">
        <SyncBadge state={op.syncState} size="md" />
      </View>
      <TextInput label="Nome *" value={nome} onChangeText={setNome} />
      <TextInput label="Código" value={codigo} onChangeText={setCodigo} />

      <Text className="text-sm text-slate-700 mt-3 mb-1">Navio</Text>
      <View className="flex-row flex-wrap">
        <Pressable
          className={`mr-2 mb-2 px-3 py-1.5 rounded-full ${navioServerId === null ? 'bg-blue-600' : 'bg-slate-200'}`}
          onPress={() => setNavioServerId(null)}
        >
          <Text className={navioServerId === null ? 'text-white text-xs' : 'text-slate-700 text-xs'}>Nenhum</Text>
        </Pressable>
        {navios.filter((n) => n.serverId).map((n) => (
          <Pressable
            key={n.id}
            className={`mr-2 mb-2 px-3 py-1.5 rounded-full ${navioServerId === n.serverId ? 'bg-blue-600' : 'bg-slate-200'}`}
            onPress={() => setNavioServerId(n.serverId)}
          >
            <Text className={navioServerId === n.serverId ? 'text-white text-xs' : 'text-slate-700 text-xs'}>{n.nome}</Text>
          </Pressable>
        ))}
      </View>

      <Text className="text-sm text-slate-700 mt-3 mb-1">Porto</Text>
      <View className="flex-row flex-wrap">
        <Pressable
          className={`mr-2 mb-2 px-3 py-1.5 rounded-full ${portoServerId === null ? 'bg-blue-600' : 'bg-slate-200'}`}
          onPress={() => setPortoServerId(null)}
        >
          <Text className={portoServerId === null ? 'text-white text-xs' : 'text-slate-700 text-xs'}>Nenhum</Text>
        </Pressable>
        {portos.filter((p) => p.serverId).map((p) => (
          <Pressable
            key={p.id}
            className={`mr-2 mb-2 px-3 py-1.5 rounded-full ${portoServerId === p.serverId ? 'bg-blue-600' : 'bg-slate-200'}`}
            onPress={() => setPortoServerId(p.serverId)}
          >
            <Text className={portoServerId === p.serverId ? 'text-white text-xs' : 'text-slate-700 text-xs'}>{p.nome}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput label="Data início (YYYY-MM-DD)" value={dataInicio} onChangeText={setDataInicio} autoCapitalize="none" />
      <TextInput label="Data fim prevista (YYYY-MM-DD)" value={dataFimPrev} onChangeText={setDataFimPrev} autoCapitalize="none" />
      <TextInput label="Valor previsto" value={valorPrev} onChangeText={setValorPrev} keyboardType="numeric" />

      <Text className="text-sm text-slate-700 mt-3 mb-1">Status *</Text>
      <View className="flex-row flex-wrap">
        {STATUS_OPTIONS.map((s) => (
          <Pressable
            key={s}
            className={`mr-2 mb-2 px-3 py-1.5 rounded-full ${status === s ? 'bg-blue-600' : 'bg-slate-200'}`}
            onPress={() => setStatus(s)}
          >
            <Text className={status === s ? 'text-white text-xs' : 'text-slate-700 text-xs'}>
              {s.replace('_', ' ')}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput label="Observações" value={observacoes} onChangeText={setObservacoes} multiline />
      <Button label="Salvar" onPress={handleSave} loading={saving} className="mt-6" />
      <Button label="Excluir" onPress={handleDelete} variant="outline" className="mt-3" />
    </ScrollView>
  )
}
