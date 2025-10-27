'use client'

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

interface DebtPayoffChartProps {
  monthlyPayments: MonthlyPayment[]
  debts: Array<{ id: string; name: string }>
}

export default function DebtPayoffChart({ monthlyPayments, debts }: DebtPayoffChartProps) {
  // Group payments by month and debt
  const chartData: Record<number, any> = {}

  monthlyPayments.forEach((payment) => {
    if (!chartData[payment.month]) {
      chartData[payment.month] = { month: payment.month }
    }
    chartData[payment.month][payment.debtName] = payment.remainingBalance
  })

  const data = Object.values(chartData)

  // Generate colors for each debt
  const colors = [
    '#6366f1', // indigo
    '#ec4899', // pink
    '#10b981', // emerald
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ef4444', // red
  ]

  return (
    <ResponsiveContainer width="100%" height={400}>
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
          formatter={(value: number) => [
            `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            '',
          ]}
          labelFormatter={(label) => `Month ${label}`}
        />
        <Legend />
        {debts.map((debt, index) => (
          <Line
            key={debt.name}
            type="monotone"
            dataKey={debt.name}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
