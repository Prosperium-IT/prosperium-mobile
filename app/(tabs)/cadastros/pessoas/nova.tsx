import React, { useState } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TextInput } from '@/components/ds/TextInput'
import { Button } from '@/components/ds/Button'
import { generateExternalId } from '@/db/sync/uuid-generator'
import { useSync } from '@/providers/sync-provider'
import { Pessoa } from '@/db/models/Pessoa'

export default function PessoaNova() {
  const router = useRouter()
  const database = useDatabase()
  const { triggerSync } = useSync()
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'F' | 'J'>('F')
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
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
        await database.get<Pessoa>('pessoas').create((p: any) => {
          p._raw.external_id = externalId
          p._raw.server_id = null
          p._raw.nome = nome.trim()
          p._raw.tipo = tipo
          p._raw.cpf_cnpj = cpfCnpj.trim() || null
          p._raw.email = email.trim() || null
          p._raw.telefone = telefone.trim() || null
          p._raw.sync_status = 'pending'
          p._raw.sync_error = null
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
      <View className="my-3">
        <Text className="text-sm text-slate-700 mb-1">Tipo *</Text>
        <View className="flex-row gap-2">
          {(['F', 'J'] as const).map((t) => (
            <Button
              key={t}
              variant={tipo === t ? 'primary' : 'outline'}
              label={t === 'F' ? 'Física' : 'Jurídica'}
              onPress={() => setTipo(t)}
            />
          ))}
        </View>
      </View>
      <TextInput label="CPF/CNPJ" value={cpfCnpj} onChangeText={setCpfCnpj} />
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <Button label="Salvar" onPress={handleSubmit} loading={saving} size="lg" />
    </ScrollView>
  )
}
