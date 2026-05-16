import React from 'react'
import { View, Text } from 'react-native'
import { DashboardFinancialMetrics } from './items/DashboardFinancialMetrics'
import { DashboardTransactionsRecent } from './items/DashboardTransactionsRecent'
import { DashboardUpcomingPayments } from './items/DashboardUpcomingPayments'
import { DashboardOperationalMetrics } from './items/DashboardOperationalMetrics'
import { DashboardActiveOperations } from './items/DashboardActiveOperations'
import { DashboardCashAccountsStatus } from './items/DashboardCashAccountsStatus'
import { DashboardDailyActivity } from './items/DashboardDailyActivity'
import { DashboardAccountBalances } from './items/DashboardAccountBalances'
import { DashboardRevenueByCategory } from './items/DashboardRevenueByCategory'
import { DashboardExpenseByCategory } from './items/DashboardExpenseByCategory'
import { DashboardPaymentStatus } from './items/DashboardPaymentStatus'
import { DashboardChartMonthly } from './items/DashboardChartMonthly'

interface Props {
  itemEnum: string
  itemData: any
}

export function DashboardItemRenderer({ itemEnum, itemData }: Props) {
  if (!itemData) {
    return null
  }

  switch (itemEnum) {
    case 'FINANCIAL_METRICS':
      return <DashboardFinancialMetrics data={itemData} />
    case 'TRANSACTIONS_RECENT':
      return <DashboardTransactionsRecent data={itemData} />
    case 'UPCOMING_PAYMENTS':
      return <DashboardUpcomingPayments data={itemData} />
    case 'OPERATIONAL_METRICS':
      return <DashboardOperationalMetrics data={itemData} />
    case 'ACTIVE_OPERATIONS':
      return <DashboardActiveOperations data={itemData} />
    case 'CASH_ACCOUNTS_STATUS':
      return <DashboardCashAccountsStatus data={itemData} />
    case 'DAILY_ACTIVITY':
      return <DashboardDailyActivity data={itemData} />
    case 'ACCOUNT_BALANCES':
      return <DashboardAccountBalances data={itemData} />
    case 'REVENUE_BY_CATEGORY':
      return <DashboardRevenueByCategory data={itemData} />
    case 'EXPENSE_BY_CATEGORY':
      return <DashboardExpenseByCategory data={itemData} />
    case 'PAYMENT_STATUS':
      return <DashboardPaymentStatus data={itemData} />
    case 'CHART_MONTHLY':
      return <DashboardChartMonthly data={itemData} />
    default:
      return (
        <View className="bg-slate-100 rounded-xl p-4">
          <Text className="text-slate-500 text-sm">{itemEnum} (not implemented)</Text>
        </View>
      )
  }
}
