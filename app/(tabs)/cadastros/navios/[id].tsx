import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useNavio } from '@/db/hooks/use-navios'
import { TextInput } from '@/components/ds/TextInput'
import { Button } from '@/components/ds/Button'
import { SyncBadge } from '@/components/ds/SyncBadge'
import { useSync } from '@/providers/sync-provider'

export default function NavioDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const database = useDatabase()
  const navio = useNavio(id)
  const { triggerSync } = useSync()
  const [nome, setNome] = useState('')
  const [imo, setImo] = useState('')
  const [bandeira, setBandeira] = useState('')
  const [tipo, setTipo] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!navio) return
    setNome(navio.nome)
    setImo(navio.imo ?? '')
    setBandeira(navio.bandeira ?? '')
    setTipo(navio.tipo ?? '')
  }, [navio])

  if (!navio) {
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
        await navio!.update((n: any) => {
          n._raw.nome = nome.trim()
          n._raw.imo = imo.trim() || null
          n._raw.bandeira = bandeira.trim() || null
          n._raw.tipo = tipo.trim() || null
          n._raw.sync_status = 'pending'
        })
      })
      void triggerSync()
      router.back()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    Alert.alert('Excluir', 'Deseja excluir este navio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await database.write(async () => {
            await navio!.destroyPermanently()
          })
          router.back()
        },
      },
    ])
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-4">
        <SyncBadge state={navio.syncState} size="md" />
      </View>
      <TextInput label="Nome *" value={nome} onChangeText={setNome} />
      <TextInput label="IMO" value={imo} onChangeText={setImo} />
      <TextInput label="Bandeira" value={bandeira} onChangeText={setBandeira} />
      <TextInput label="Tipo" value={tipo} onChangeText={setTipo} />
      <Button label="Salvar" onPress={handleSave} loading={saving} className="mt-6" />
      <Button label="Excluir" onPress={handleDelete} variant="outline" className="mt-3" />
    </ScrollView>
  )
}
