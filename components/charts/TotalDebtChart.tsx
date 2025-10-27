'use client'

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

interface TotalDebtChartProps {
  monthlyPayments: MonthlyPayment[]
}

export default function TotalDebtChart({ monthlyPayments }: TotalDebtChartProps) {
  // Calculate total remaining debt per month
  const monthlyTotals: Record<number, number> = {}

  monthlyPayments.forEach((payment) => {
    if (!monthlyTotals[payment.month]) {
      monthlyTotals[payment.month] = 0
    }
    monthlyTotals[payment.month] += payment.remainingBalance
  })

  const data = Object.entries(monthlyTotals).map(([month, total]) => ({
    month: parseInt(month),
    total: total,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
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
          formatter={(value: number) => [
            `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            'Total Debt',
          ]}
          labelFormatter={(label) => `Month ${label}`}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
