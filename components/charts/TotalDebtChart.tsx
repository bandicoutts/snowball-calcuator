'use client'

import { memo, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { MonthlyPayment } from '@/types/debt.types'
import { formatCurrency } from '@/lib/formatters'
import { CHART_COLORS, CHART_HEIGHT } from '@/lib/constants'

interface TotalDebtChartProps {
  monthlyPayments: MonthlyPayment[]
}

function TotalDebtChart({ monthlyPayments }: TotalDebtChartProps) {
  // Calculate total remaining debt per month - memoized to avoid recalculation
  const data = useMemo(() => {
    const monthlyTotals: Record<number, number> = {}

    monthlyPayments.forEach((payment) => {
      if (!monthlyTotals[payment.month]) {
        monthlyTotals[payment.month] = 0
      }
      monthlyTotals[payment.month] += payment.remainingBalance
    })

    return Object.entries(monthlyTotals).map(([month, total]) => ({
      month: parseInt(month),
      total: total,
    }))
  }, [monthlyPayments])

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT.TOTAL_DEBT}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
        />
        <YAxis
          label={{ value: 'Total Debt ($)', angle: -90, position: 'insideLeft' }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), 'Total Debt']}
          labelFormatter={(label) => `Month ${label}`}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke={CHART_COLORS.PRIMARY}
          fill={CHART_COLORS.PRIMARY}
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Export memoized version to prevent unnecessary re-renders
export default memo(TotalDebtChart)
