import React from 'react'
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface AreaChartProps {
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

export function AreaChart({ data = [], dataPoints, xAxisLabel, yAxisLabel }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={dataPoints.xAxis} 
          label={{ value: xAxisLabel, position: 'bottom' }} 
        />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'left' }} />
        <Tooltip />
        {dataPoints.yAxis.map((axis, index) => (
          <Area 
            key={index}
            type="monotone"
            dataKey={axis} 
            fill={`hsl(${index * 45}, 70%, 50%)`}
            stroke={`hsl(${index * 45}, 70%, 40%)`}
            fillOpacity={0.3}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}
