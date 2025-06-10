import React from 'react'
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface BarChartProps {
  dataPoints: {
    xAxis: string
    yAxis: string[]
    xAxisLabel: string
    yAxisLabel: string
  }
  xAxisLabel: string
  yAxisLabel: string
}

export function BarChart({ dataPoints, xAxisLabel, yAxisLabel }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={[]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={dataPoints.xAxis} 
          label={{ value: xAxisLabel, position: 'bottom' }} 
        />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'left' }} />
        <Tooltip />
        {dataPoints.yAxis.map((axis, index) => (
          <Bar 
            key={index}
            dataKey={axis} 
            fill={`hsl(${index * 45}, 70%, 50%)`} 
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
} 