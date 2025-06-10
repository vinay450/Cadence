
import { ResponsiveContainer, Scatter, ScatterChart as RechartsScatterChart, Tooltip, XAxis, YAxis } from 'recharts'

interface ScatterChartProps {
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

export function ScatterChart({ data = [], dataPoints }: ScatterChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsScatterChart data={data}>
        <XAxis dataKey={dataPoints.xAxis} />
        <YAxis dataKey={dataPoints.yAxis[0]} />
        <Tooltip />
        <Scatter dataKey={dataPoints.yAxis[0]} fill="hsl(210, 70%, 50%)" />
      </RechartsScatterChart>
    </ResponsiveContainer>
  )
}
