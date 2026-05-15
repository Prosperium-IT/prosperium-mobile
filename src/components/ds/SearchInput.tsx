import React from 'react'
import { View, TextInput, Pressable, Text } from 'react-native'

interface Props {
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChangeText, placeholder = 'Buscar...' }: Props) {
  return (
    <View className="flex-row items-center bg-slate-100 rounded-lg px-3 py-2 mx-4 my-2">
      <Text className="text-slate-500 mr-2">🔍</Text>
      <TextInput
        className="flex-1 text-base text-slate-900"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <Text className="text-slate-500 text-lg">✕</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
