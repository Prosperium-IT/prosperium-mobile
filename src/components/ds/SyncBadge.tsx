import React from 'react'
import { View, Text } from 'react-native'
import type { SyncState } from '@/db/models/Lancamento'

interface Props {
  state: SyncState
  size?: 'sm' | 'md'
}

export function SyncBadge({ state, size = 'sm' }: Props) {
  if (state === 'synced') return null

  const isPending = state === 'pending' || state === 'syncing'

  const bg = isPending ? 'bg-amber-100' : 'bg-red-100'
  const text = isPending ? 'text-amber-800' : 'text-red-800'
  const label = isPending ? '⏳' : '⚠'
  const padding = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-1'

  return (
    <View className={`${bg} ${padding} rounded-full self-start`}>
      <Text className={`${text} text-xs font-medium`}>{label}</Text>
    </View>
  )
}
