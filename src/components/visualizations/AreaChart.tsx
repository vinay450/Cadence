
import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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

export function AreaChart({ data = [], dataPoints }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data}>
        <XAxis dataKey={dataPoints.xAxis} />
        <YAxis />
        <Tooltip />
        {dataPoints.yAxis.map((axis, index) => (
          <Area
            key={index}
            type="monotone"
            dataKey={axis}
            stroke={`hsl(${index * 45}, 70%, 50%)`}
            fill={`hsl(${index * 45}, 70%, 50%)`}
            fillOpacity={0.3}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}
