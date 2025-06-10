
import React from 'react'
import { Pie, PieChart as RechartsPieChart, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface PieChartProps {
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

export function PieChart({ data = [], dataPoints }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Tooltip />
        {dataPoints.yAxis.map((axis, index) => (
          <Pie
            key={index}
            data={data}
            dataKey={axis}
            nameKey={dataPoints.xAxis}
            cx="50%"
            cy="50%"
            outerRadius={80}
          >
            {data.map((_, cellIndex) => (
              <Cell key={cellIndex} fill={`hsl(${cellIndex * 45}, 70%, 50%)`} />
            ))}
          </Pie>
        ))}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
