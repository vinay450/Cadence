import React from 'react'
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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
  console.log('BarChart Data:', data)
  console.log('BarChart DataPoints:', dataPoints)
  
  // Ensure data is an array and has items
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('BarChart: No data provided or data is not an array')
    return <div>No data available</div>
  }

  // Ensure dataPoints has required properties
  if (!dataPoints?.xAxis || !dataPoints?.yAxis) {
    console.warn('BarChart: Missing required dataPoints properties')
    return <div>Invalid chart configuration</div>
  }

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
