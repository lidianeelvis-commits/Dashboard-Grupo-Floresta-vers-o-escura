
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { type MonthlySale } from '../types';

interface MonthlySalesChartProps {
  data: MonthlySale[];
  selectedMonth?: string;
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

const formatValueShort = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k`;
  }
  return value;
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 p-2 border border-slate-600 rounded-md shadow-lg">
        <p className="label text-white font-semibold">{`${label}`}</p>
        <p className="intro text-cyan-400">{`Faturamento: ${payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</p>
      </div>
    );
  }
  return null;
};

const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({ data, selectedMonth }) => {
  const revenues = data.map(d => d.revenue);
  const maxRevenue = Math.max(...revenues);
  const minRevenue = Math.min(...revenues);

  const BEST_MONTH_COLOR = "#10b981"; // green-500
  const WORST_MONTH_COLOR = "#ef4444"; // red-500
  const DEFAULT_COLOR = "#22d3ee"; // cyan-400
  const SELECTED_MONTH_COLOR = "#67e8f9"; // cyan-300

  return (
    <div className="flex flex-col h-full">
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 40,
              right: 10,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" tickFormatter={formatCurrencyShort} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(71, 85, 105, 0.3)'}}/>
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="revenue" position="top" formatter={formatValueShort} fill="#94a3b8" fontSize={12} />
              {data.map((entry, index) => {
                let color = DEFAULT_COLOR;
                if (entry.month === selectedMonth) {
                  color = SELECTED_MONTH_COLOR;
                } else if (entry.revenue === maxRevenue) {
                  color = BEST_MONTH_COLOR;
                } else if (entry.revenue === minRevenue) {
                  color = WORST_MONTH_COLOR;
                }
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
        <div className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: SELECTED_MONTH_COLOR}}></span>Mês Selecionado</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: BEST_MONTH_COLOR}}></span>Melhor Mês</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: DEFAULT_COLOR}}></span>Mês Normal</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: WORST_MONTH_COLOR}}></span>Pior Mês</div>
      </div>
    </div>
  );
};

export default MonthlySalesChart;