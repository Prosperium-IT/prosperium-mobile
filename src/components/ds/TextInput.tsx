import {
  TextInput as RNTextInput,
  TextInputProps as RNProps,
  View,
  Text,
} from 'react-native'

interface TextInputProps extends RNProps {
  label?: string
  error?: string
  hint?: string
}

export function TextInput({ label, error, hint, ...props }: TextInputProps) {
  return (
    <View className="gap-1">
      {label && (
        <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </Text>
      )}
      <RNTextInput
        {...props}
        className={`bg-white dark:bg-slate-800 border rounded-xl px-4 py-3 text-slate-900 dark:text-white text-base ${
          error
            ? 'border-danger-500'
            : 'border-slate-300 dark:border-slate-600'
        } ${props.className ?? ''}`}
        placeholderTextColor="#94a3b8"
      />
      {hint && !error && (
        <Text className="text-xs text-slate-400">{hint}</Text>
      )}
      {error && (
        <Text className="text-xs text-danger-500">{error}</Text>
      )}
    </View>
  )
}
