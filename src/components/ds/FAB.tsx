import React from 'react'
import { Pressable, Text, View } from 'react-native'

interface Props {
  onPress: () => void
  label?: string
  icon?: string
  disabled?: boolean
}

export function FAB({ onPress, label, icon = '+', disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`absolute bottom-6 right-6 rounded-full shadow-lg ${
        disabled ? 'bg-blue-300' : 'bg-blue-600 active:bg-blue-700'
      }`}
    >
      <View
        className={`flex-row items-center ${
          label ? 'px-5 py-4' : 'w-14 h-14 justify-center'
        }`}
      >
        <Text className="text-white text-2xl font-bold">{icon}</Text>
        {label ? (
          <Text className="text-white font-semibold ml-2">{label}</Text>
        ) : null}
      </View>
    </Pressable>
  )
}
