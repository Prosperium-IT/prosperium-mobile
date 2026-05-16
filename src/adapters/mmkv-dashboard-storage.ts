import { createMMKV } from 'react-native-mmkv'

const dashboardStorage = createMMKV({ id: 'dashboard' })

export const dashboardConfig = {
  /**
   * Obtém último timestamp sincronizado
   */
  getLastTimestamp(): number {
    return dashboardStorage.getNumber('lastTimestamp') ?? 0
  },

  /**
   * Atualiza último timestamp sincronizado
   */
  setLastTimestamp(ts: number): void {
    dashboardStorage.setNumber('lastTimestamp', ts)
  },

  /**
   * Obtém intervalo de auto-refresh em segundos
   */
  getRefreshIntervalSeconds(): number {
    return dashboardStorage.getNumber('refreshIntervalSeconds') ?? 300 // 5 min default
  },

  /**
   * Atualiza intervalo de auto-refresh
   */
  setRefreshIntervalSeconds(seconds: number): void {
    dashboardStorage.setNumber('refreshIntervalSeconds', seconds)
  },

  /**
   * Obtém lista de items habilitados
   */
  getEnabledItems(): string[] {
    const json = dashboardStorage.getString('enabledItems')
    return json ? JSON.parse(json) : []
  },

  /**
   * Atualiza lista de items habilitados
   */
  setEnabledItems(items: string[]): void {
    dashboardStorage.setString('enabledItems', JSON.stringify(items))
  },

  /**
   * Limpa toda a configuração do dashboard
   */
  clear(): void {
    dashboardStorage.clearAll()
  },
}
