
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailySale {
  day: number;
  totalValue: number;
}

interface DailySalesChartProps {
  data: DailySale[];
}

const formatCurrencyShort = (value: number) => {
  if (value >= 1_000_000) {
    return `R$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `R$${(value / 1_000).toFixed(0)}k`;
  }
  return `R$${value}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 p-2 border border-slate-600 rounded-md shadow-lg">
        <p className="label text-white font-semibold">{`Dia ${label}`}</p>
        <p className="intro text-cyan-400">{`Total: ${payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</p>
      </div>
    );
  }
  return null;
};

const DailySalesChart: React.FC<DailySalesChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            dataKey="day" 
            stroke="#94a3b8" 
            padding={{ left: 10, right: 10 }}
            tickFormatter={(value) => `Dia ${value}`}
          />
          <YAxis stroke="#94a3b8" tickFormatter={formatCurrencyShort} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="totalValue"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ r: 4, fill: '#22d3ee' }}
            activeDot={{ r: 8, stroke: '#67e8f9', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySalesChart;
