import { Line, LineChart as RechartsLineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface LineChartProps {
  data: any[]
  dataPoints: {
    xAxis: string
    yAxis: string
    xAxisLabel?: string
    yAxisLabel?: string
  }
  xAxisLabel?: string
  yAxisLabel?: string
}

export const LineChart = ({ data, dataPoints, xAxisLabel, yAxisLabel }: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataPoints.xAxis} label={{ value: xAxisLabel || dataPoints.xAxisLabel || 'X-Axis', position: 'insideBottom', offset: -5 }} />
        <YAxis dataKey={dataPoints.yAxis} label={{ value: yAxisLabel || dataPoints.yAxisLabel || 'Y-Axis', angle: -90, position: 'insideLeft', offset: -15 }} />
        <Tooltip />
        <Line type="monotone" dataKey={dataPoints.yAxis} stroke="#8884d8" activeDot={{ r: 8 }} />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
