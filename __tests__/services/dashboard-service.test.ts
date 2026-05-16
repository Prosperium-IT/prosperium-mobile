import { getDashboard, updateDashboardItems, getDashboardItems } from '@/services/dashboard-service'
import { http } from '@/lib/http'

jest.mock('@/lib/http')

describe('dashboard-service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDashboard', () => {
    it('calls correct endpoint with last_timestamp parameter', async () => {
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          data: {
            timestamp: 1735689700,
            items: { FINANCIAL_METRICS: { saldo: 1000 } },
          },
        }),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      const result = await getDashboard(1735689600)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/mobile/dashboard', {
        params: { last_timestamp: 1735689600 },
      })
      expect(result.timestamp).toBe(1735689700)
      expect(result.items).toEqual({ FINANCIAL_METRICS: { saldo: 1000 } })
    })

    it('handles null items in response', async () => {
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          data: {
            timestamp: 1735689700,
            items: null,
          },
        }),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      const result = await getDashboard(1735689600)

      expect(result.items).toBeNull()
    })

    it('handles API errors', async () => {
      const error = new Error('API error')
      const mockAxiosInstance = {
        get: jest.fn().mockRejectedValue(error),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      await expect(getDashboard(1735689600)).rejects.toThrow('API error')
    })

    it('works with timestamp 0', async () => {
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          data: {
            timestamp: 1735689700,
            items: { FINANCIAL_METRICS: { saldo: 1000 } },
          },
        }),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      await getDashboard(0)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/mobile/dashboard', {
        params: { last_timestamp: 0 },
      })
    })

    it('preserves complex nested items structure', async () => {
      const complexItems = {
        FINANCIAL_METRICS: {
          saldo: 1000,
          receita: 5000,
          despesa: 4000,
          sub: {
            nested: 'value',
          },
        },
        DAILY_ACTIVITY: {
          count: 42,
          items: [1, 2, 3],
        },
      }

      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          data: {
            timestamp: 1735689700,
            items: complexItems,
          },
        }),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      const result = await getDashboard(1735689600)

      expect(result.items).toEqual(complexItems)
    })
  })

  describe('updateDashboardItems', () => {
    it('sends PUT request with items array', async () => {
      const mockAxiosInstance = {
        put: jest.fn().mockResolvedValue({}),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      await updateDashboardItems(['FINANCIAL_METRICS', 'DAILY_ACTIVITY'])

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/api/operadores/me/dashboard-items',
        {
          items: ['FINANCIAL_METRICS', 'DAILY_ACTIVITY'],
        }
      )
    })

    it('handles empty items array', async () => {
      const mockAxiosInstance = {
        put: jest.fn().mockResolvedValue({}),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      await updateDashboardItems([])

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/api/operadores/me/dashboard-items',
        {
          items: [],
        }
      )
    })

    it('handles single item array', async () => {
      const mockAxiosInstance = {
        put: jest.fn().mockResolvedValue({}),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      await updateDashboardItems(['FINANCIAL_METRICS'])

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/api/operadores/me/dashboard-items',
        {
          items: ['FINANCIAL_METRICS'],
        }
      )
    })

    it('handles API errors', async () => {
      const error = new Error('Network error')
      const mockAxiosInstance = {
        put: jest.fn().mockRejectedValue(error),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      await expect(updateDashboardItems(['FINANCIAL_METRICS'])).rejects.toThrow('Network error')
    })

    it('returns void on success', async () => {
      const mockAxiosInstance = {
        put: jest.fn().mockResolvedValue({}),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      const result = await updateDashboardItems(['FINANCIAL_METRICS'])

      expect(result).toBeUndefined()
    })
  })

  describe('getDashboardItems', () => {
    it('fetches user dashboard items', async () => {
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          data: {
            items: ['FINANCIAL_METRICS', 'DAILY_ACTIVITY'],
          },
        }),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      const result = await getDashboardItems()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/operadores/me/dashboard-items')
      expect(result.items).toContain('FINANCIAL_METRICS')
      expect(result.items).toContain('DAILY_ACTIVITY')
      expect(result.items.length).toBe(2)
    })

    it('handles empty items list', async () => {
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          data: {
            items: [],
          },
        }),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      const result = await getDashboardItems()

      expect(result.items).toEqual([])
    })

    it('handles single item response', async () => {
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          data: {
            items: ['FINANCIAL_METRICS'],
          },
        }),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      const result = await getDashboardItems()

      expect(result.items).toEqual(['FINANCIAL_METRICS'])
    })

    it('handles API errors', async () => {
      const error = new Error('Unauthorized')
      const mockAxiosInstance = {
        get: jest.fn().mockRejectedValue(error),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      await expect(getDashboardItems()).rejects.toThrow('Unauthorized')
    })

    it('preserves order of items in response', async () => {
      const items = ['ITEM_A', 'ITEM_B', 'ITEM_C', 'ITEM_D']
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          data: { items },
        }),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      const result = await getDashboardItems()

      expect(result.items).toEqual(items)
    })

    it('handles many items in response', async () => {
      const items = Array.from({ length: 50 }, (_, i) => `ITEM_${i}`)
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          data: { items },
        }),
      }
      ;(http.getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance)

      const result = await getDashboardItems()

      expect(result.items).toHaveLength(50)
      expect(result.items).toEqual(items)
    })
  })
})
