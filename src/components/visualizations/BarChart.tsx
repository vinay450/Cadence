
import React from 'react'
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface BarChartProps {
  data?: any[]
  dataPoints: {
    xAxis: string
    yAxis: string[]
    xAxisLabel: string
    yAxisLabel: string
  }
  xAxisLabel: string
  yAxisLabel: string
}

export function BarChart({ data = [], dataPoints, xAxisLabel, yAxisLabel }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
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
