import React from 'react'
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts'

interface LineChartProps {
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

function getPaddedDomain(data: any[], yKeys: string[]) {
  let min = Infinity
  let max = -Infinity
  data.forEach(row => {
    yKeys.forEach(key => {
      const val = parseFloat(row[key])
      if (!isNaN(val)) {
        if (val < min) min = val
        if (val > max) max = val
      }
    })
  })
  if (!isFinite(min) || !isFinite(max)) return ['auto', 'auto']
  const padding = (max - min) * 0.05 || 1
  return [min - padding, max + padding]
}

export function LineChart({ data, dataPoints, xAxisLabel, yAxisLabel }: LineChartProps) {
  const domain = getPaddedDomain(data, dataPoints.yAxis)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={dataPoints.xAxis} 
          label={{ value: xAxisLabel, position: 'bottom' }} 
        />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'left' }} domain={domain} allowDecimals={false} />
        <Tooltip />
        <Brush dataKey={dataPoints.xAxis} height={24} stroke="#8884d8" />
        {dataPoints.yAxis.map((axis, index) => (
          <Line 
            key={index}
            type="monotone" 
            dataKey={axis} 
            stroke={`hsl(${index * 45}, 70%, 50%)`} 
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
} 