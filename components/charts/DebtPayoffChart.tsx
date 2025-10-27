'use client'

import { memo, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { MonthlyPayment } from '@/types/debt.types'
import { formatCurrency } from '@/lib/formatters'
import { CHART_COLORS, CHART_HEIGHT } from '@/lib/constants'

interface DebtPayoffChartProps {
  monthlyPayments: MonthlyPayment[]
  debts: Array<{ id: string; name: string }>
}

function DebtPayoffChart({ monthlyPayments, debts }: DebtPayoffChartProps) {
  // Group payments by month and debt - memoized to avoid recalculation
  const data = useMemo(() => {
    const chartData: Record<number, any> = {}

    monthlyPayments.forEach((payment) => {
      if (!chartData[payment.month]) {
        chartData[payment.month] = { month: payment.month }
      }
      chartData[payment.month][payment.debtName] = payment.remainingBalance
    })

    return Object.values(chartData)
  }, [monthlyPayments])

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT.DEBT_PAYOFF}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
        />
        <YAxis
          label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), '']}
          labelFormatter={(label) => `Month ${label}`}
        />
        <Legend />
        {debts.map((debt, index) => (
          <Line
            key={debt.name}
            type="monotone"
            dataKey={debt.name}
            stroke={CHART_COLORS.DEBT_PALETTE[index % CHART_COLORS.DEBT_PALETTE.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// Export memoized version to prevent unnecessary re-renders
export default memo(DebtPayoffChart)
