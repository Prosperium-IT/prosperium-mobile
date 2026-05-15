import { MMKV } from 'react-native-mmkv'

// Uma instância por app — configs leves (tenant slug, preferências)
export const mmkv = new MMKV({ id: 'prosperium-config' })

export const configStorage = {
  get: (key: string) => mmkv.getString(key) ?? null,
  set: (key: string, value: string) => mmkv.set(key, value),
  remove: (key: string) => mmkv.delete(key),
  getBool: (key: string) => mmkv.getBoolean(key) ?? null,
  setBool: (key: string, value: boolean) => mmkv.set(key, value),
}
