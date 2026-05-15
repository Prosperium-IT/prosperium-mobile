import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDatabase } from '@nozbe/watermelondb/react'
import { usePessoa } from '@/db/hooks/use-pessoas'
import { TextInput } from '@/components/ds/TextInput'
import { Button } from '@/components/ds/Button'
import { SyncBadge } from '@/components/ds/SyncBadge'
import { useSync } from '@/providers/sync-provider'

export default function PessoaDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const database = useDatabase()
  const pessoa = usePessoa(id)
  const { triggerSync } = useSync()

  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'F' | 'J'>('F')
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!pessoa) return
    setNome(pessoa.nome)
    setTipo(pessoa.tipo)
    setCpfCnpj(pessoa.cpfCnpj ?? '')
    setEmail(pessoa.email ?? '')
    setTelefone(pessoa.telefone ?? '')
  }, [pessoa])

  if (!pessoa) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-slate-500">Carregando...</Text>
      </View>
    )
  }

  async function handleSave() {
    if (!nome.trim()) {
      Alert.alert('Validação', 'Nome é obrigatório')
      return
    }
    setSaving(true)
    try {
      await database.write(async () => {
        await pessoa!.update((p: any) => {
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

  async function handleDelete() {
    Alert.alert('Excluir', 'Deseja excluir esta pessoa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await database.write(async () => {
            await pessoa!.destroyPermanently()
          })
          router.back()
        },
      },
    ])
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-4 flex-row items-center">
        <SyncBadge state={pessoa.syncState} size="md" />
        {pessoa.syncError ? (
          <Text className="text-red-600 text-xs ml-2 flex-1">{pessoa.syncError}</Text>
        ) : null}
      </View>
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
      <Button label="Salvar" onPress={handleSave} loading={saving} size="lg" />
      <Button label="Excluir" onPress={handleDelete} variant="danger" size="lg" />
    </ScrollView>
  )
}
