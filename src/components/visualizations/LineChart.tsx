import { Line, LineChart as RechartsLineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'

interface LineChartProps {
  data: any[]
  dataPoints: {
    xAxis: string
    yAxis: string[]
    xAxisLabel?: string
    yAxisLabel?: string
  }
  xAxisLabel?: string
  yAxisLabel?: string
}

export const LineChart = ({ data, dataPoints, xAxisLabel, yAxisLabel }: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart 
        data={data}
        margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={dataPoints.xAxis} 
          label={{ 
            value: xAxisLabel || dataPoints.xAxisLabel || 'X-Axis', 
            position: 'insideBottom', 
            offset: -5 
          }} 
        />
        <YAxis 
          label={{ 
            value: yAxisLabel || dataPoints.yAxisLabel || 'Y-Axis', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
            offset: -30
          }} 
        />
        <Tooltip />
        {dataPoints.yAxis.map((axis, index) => (
          <Line
            key={axis}
            name={axis}
            type="monotone"
            dataKey={axis}
            stroke={`hsl(${index * 45}, 70%, 50%)`}
            activeDot={{ r: 8 }}
          />
        ))}
        <Legend 
          verticalAlign="bottom" 
          height={36}
          wrapperStyle={{ marginTop: 15 }}
          formatter={(value) => <span className="text-sm">{value}</span>}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
