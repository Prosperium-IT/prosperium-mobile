import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDatabase } from '@nozbe/watermelondb/react'
import { usePorto } from '@/db/hooks/use-portos'
import { TextInput } from '@/components/ds/TextInput'
import { Button } from '@/components/ds/Button'
import { SyncBadge } from '@/components/ds/SyncBadge'
import { useSync } from '@/providers/sync-provider'

export default function PortoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const database = useDatabase()
  const porto = usePorto(id)
  const { triggerSync } = useSync()
  const [nome, setNome] = useState('')
  const [locode, setLocode] = useState('')
  const [pais, setPais] = useState('')
  const [estado, setEstado] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!porto) return
    setNome(porto.nome)
    setLocode(porto.codigoLocode ?? '')
    setPais(porto.pais ?? '')
    setEstado(porto.estado ?? '')
  }, [porto])

  if (!porto) {
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
        await porto!.update((p: any) => {
          p._raw.nome = nome.trim()
          p._raw.codigo_locode = locode.trim() || null
          p._raw.pais = pais.trim() || null
          p._raw.estado = estado.trim() || null
          p._raw.sync_status = 'pending'
        })
      })
      void triggerSync()
      router.back()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    Alert.alert('Excluir', 'Deseja excluir este porto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await database.write(async () => {
            await porto!.destroyPermanently()
          })
          router.back()
        },
      },
    ])
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-4">
        <SyncBadge state={porto.syncState} size="md" />
      </View>
      <TextInput label="Nome *" value={nome} onChangeText={setNome} />
      <TextInput label="Código LOCODE" value={locode} onChangeText={setLocode} autoCapitalize="characters" />
      <TextInput label="País" value={pais} onChangeText={setPais} />
      <TextInput label="Estado" value={estado} onChangeText={setEstado} autoCapitalize="characters" />
      <Button label="Salvar" onPress={handleSave} loading={saving} className="mt-6" />
      <Button label="Excluir" onPress={handleDelete} variant="outline" className="mt-3" />
    </ScrollView>
  )
}
