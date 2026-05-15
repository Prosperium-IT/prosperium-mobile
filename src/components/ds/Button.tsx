import { Pressable, Text, ActivityIndicator, PressableProps } from 'react-native'

interface ButtonProps extends PressableProps {
  label: string
  loading?: boolean
  variant?: 'primary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  primary: { container: 'bg-primary-600 active:bg-primary-700', text: 'text-white' },
  outline: { container: 'border border-primary-600 active:bg-primary-50', text: 'text-primary-600' },
  danger: { container: 'bg-danger-500 active:bg-danger-600', text: 'text-white' },
}

const sizeStyles = {
  sm: { container: 'py-2 px-4 rounded-lg', text: 'text-sm' },
  md: { container: 'py-3 px-6 rounded-xl', text: 'text-base' },
  lg: { container: 'py-4 px-8 rounded-2xl', text: 'text-lg' },
}

export function Button({
  label,
  loading = false,
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}: ButtonProps) {
  const v = variantStyles[variant]
  const s = sizeStyles[size]
  const isDisabled = disabled || loading

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      className={`${v.container} ${s.container} items-center justify-center flex-row gap-2 ${isDisabled ? 'opacity-60' : ''}`}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#2563eb' : 'white'}
        />
      )}
      <Text className={`${v.text} ${s.text} font-semibold`}>{label}</Text>
    </Pressable>
  )
}
