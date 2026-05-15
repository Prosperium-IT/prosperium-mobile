import React, { useState } from 'react'
import { ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TextInput } from '@/components/ds/TextInput'
import { Button } from '@/components/ds/Button'
import { generateExternalId } from '@/db/sync/uuid-generator'
import { useSync } from '@/providers/sync-provider'
import Porto from '@/db/models/Porto'

export default function PortoNovo() {
  const router = useRouter()
  const database = useDatabase()
  const { triggerSync } = useSync()
  const [nome, setNome] = useState('')
  const [locode, setLocode] = useState('')
  const [pais, setPais] = useState('')
  const [estado, setEstado] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!nome.trim()) return Alert.alert('Validação', 'Nome é obrigatório')
    setSaving(true)
    try {
      const externalId = generateExternalId()
      await database.write(async () => {
        await database.get<Porto>('portos').create((p: any) => {
          p._raw.external_id = externalId
          p._raw.server_id = null
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

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <TextInput label="Nome *" value={nome} onChangeText={setNome} />
      <TextInput label="Código LOCODE" value={locode} onChangeText={setLocode} autoCapitalize="characters" />
      <TextInput label="País" value={pais} onChangeText={setPais} />
      <TextInput label="Estado" value={estado} onChangeText={setEstado} autoCapitalize="characters" />
      <Button label="Salvar" onPress={handleSubmit} loading={saving} className="mt-6" />
    </ScrollView>
  )
}
