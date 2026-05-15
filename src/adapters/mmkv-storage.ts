import { createMMKV } from 'react-native-mmkv'

export const mmkv = createMMKV({ id: 'prosperium-config' })

export const configStorage = {
  get: (key: string) => mmkv.getString(key) ?? null,
  set: (key: string, value: string) => mmkv.set(key, value),
  remove: (key: string) => mmkv.remove(key),
  getBool: (key: string) => mmkv.getBoolean(key) ?? null,
  setBool: (key: string, value: boolean) => mmkv.set(key, value),
}
