
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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

export function BarChart({ data = [], dataPoints }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <XAxis dataKey={dataPoints.xAxis} />
        <YAxis />
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
