
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';

// Mock data for the chart
const data = [
  { month: 'Jan', yield: 4.2 },
  { month: 'Feb', yield: 4.5 },
  { month: 'Mar', yield: 6.0 },
  { month: 'Apr', yield: 8.5 },
  { month: 'May', yield: 7.8 },
  { month: 'Jun', yield: 9.1 },
  { month: 'Jul', yield: 9.5 },
  { month: 'Aug', yield: 10.2 },
  { month: 'Sep', yield: 8.7 },
];

// Define proper types for the CustomTooltip component
type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
} & TooltipProps<any, any>;

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-teal-600">
          {`Yield: ${payload[0].value}%`}
        </p>
      </div>
    );
  }

  return null;
};

const PoolPerformanceChart = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1A2B6D" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#20C997" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="yield" 
            stroke="#1A2B6D" 
            fillOpacity={1} 
            fill="url(#colorYield)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PoolPerformanceChart;
