import { http, CORE_BASE_URL } from '@/lib/http'

export interface DashboardResponse {
  timestamp: number
  items: Record<string, any> | null
}

/**
 * Obtém dashboard, comparando com timestamp anterior
 */
export async function getDashboard(lastTimestamp: number): Promise<DashboardResponse> {
  const axios = http.getAxiosInstance()
  const response = await axios.get<DashboardResponse>(`${CORE_BASE_URL}/mobile/dashboard`, {
    params: { last_timestamp: lastTimestamp },
  })
  return response.data
}

/**
 * Atualiza items habilitados para operador logado
 */
export async function updateDashboardItems(itemsEnabled: string[]): Promise<void> {
  const axios = http.getAxiosInstance()
  await axios.put(`${CORE_BASE_URL}/operadores/me/dashboard-items`, {
    items: itemsEnabled,
  })
}

/**
 * Obtém items habilitados para operador logado
 */
export async function getDashboardItems(): Promise<{ items: string[] }> {
  const axios = http.getAxiosInstance()
  const response = await axios.get<{ items: string[] }>(
    `${CORE_BASE_URL}/operadores/me/dashboard-items`
  )
  return response.data
}
