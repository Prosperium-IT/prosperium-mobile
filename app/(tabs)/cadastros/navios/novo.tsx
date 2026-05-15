import React, { useState } from 'react'
import { ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TextInput } from '@/components/ds/TextInput'
import { Button } from '@/components/ds/Button'
import { generateExternalId } from '@/db/sync/uuid-generator'
import { useSync } from '@/providers/sync-provider'
import Navio from '@/db/models/Navio'

export default function NavioNovo() {
  const router = useRouter()
  const database = useDatabase()
  const { triggerSync } = useSync()
  const [nome, setNome] = useState('')
  const [imo, setImo] = useState('')
  const [bandeira, setBandeira] = useState('')
  const [tipo, setTipo] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!nome.trim()) {
      Alert.alert('Validação', 'Nome é obrigatório')
      return
    }
    setSaving(true)
    try {
      const externalId = generateExternalId()
      await database.write(async () => {
        await database.get<Navio>('navios').create((n: any) => {
          n._raw.external_id = externalId
          n._raw.server_id = null
          n._raw.nome = nome.trim()
          n._raw.imo = imo.trim() || null
          n._raw.bandeira = bandeira.trim() || null
          n._raw.tipo = tipo.trim() || null
          n._raw.sync_status = 'pending'
        })
      })
      void triggerSync()
      router.back()
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <TextInput label="Nome *" value={nome} onChangeText={setNome} />
      <TextInput label="IMO" value={imo} onChangeText={setImo} />
      <TextInput label="Bandeira" value={bandeira} onChangeText={setBandeira} />
      <TextInput label="Tipo" value={tipo} onChangeText={setTipo} />
      <Button label="Salvar" onPress={handleSubmit} loading={saving} className="mt-6" />
    </ScrollView>
  )
}
