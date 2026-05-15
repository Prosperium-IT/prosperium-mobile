import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'

interface Item {
  label: string
  icon: string
  href: string
}

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: 'PESSOAS',
    items: [
      { label: 'Pessoas', icon: '👤', href: '/(tabs)/cadastros/pessoas' },
    ],
  },
  {
    title: 'OPERAÇÕES MARÍTIMAS',
    items: [
      { label: 'Navios', icon: '🚢', href: '/(tabs)/cadastros/navios' },
      { label: 'Portos', icon: '⚓', href: '/(tabs)/cadastros/portos' },
      { label: 'Operações', icon: '📋', href: '/(tabs)/cadastros/operacoes' },
    ],
  },
]

export default function CadastrosHub() {
  const router = useRouter()
  return (
    <ScrollView className="flex-1 bg-slate-50">
      {GROUPS.map((group) => (
        <View key={group.title} className="mt-6 mx-4">
          <Text className="text-xs font-bold text-slate-500 mb-2">
            {group.title}
          </Text>
          <View className="bg-white rounded-lg shadow-sm divide-y divide-slate-100">
            {group.items.map((item) => (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href as never)}
                className="flex-row items-center px-4 py-4 active:bg-slate-50"
              >
                <Text className="text-2xl mr-3">{item.icon}</Text>
                <Text className="flex-1 text-base text-slate-900">{item.label}</Text>
                <Text className="text-slate-400 text-xl">›</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}
