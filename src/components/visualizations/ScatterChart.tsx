import React from 'react'
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart as RechartsScatterChart, Tooltip, XAxis, YAxis } from 'recharts'

interface ScatterChartProps {
  data: any[]
  dataPoints: {
    xAxis: string
    yAxis: string[]
    xAxisLabel: string
    yAxisLabel: string
  }
  xAxisLabel: string
  yAxisLabel: string
}

export function ScatterChart({ data, dataPoints, xAxisLabel, yAxisLabel }: ScatterChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsScatterChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={dataPoints.xAxis} 
          label={{ value: xAxisLabel, position: 'bottom' }} 
        />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'left' }} />
        <Tooltip />
        {dataPoints.yAxis.map((axis, index) => (
          <Scatter 
            key={index}
            name={axis}
            dataKey={axis} 
            fill={`hsl(${index * 45}, 70%, 50%)`} 
          />
        ))}
      </RechartsScatterChart>
    </ResponsiveContainer>
  )
}
