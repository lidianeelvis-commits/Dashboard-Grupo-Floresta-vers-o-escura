
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface GoalProgressChartProps {
  achieved: number;
  remaining: number;
  goal: number;
}

const GoalProgressChart: React.FC<GoalProgressChartProps> = ({ achieved, remaining, goal }) => {
  const data = [
    { name: 'Alcançado', value: achieved },
    { name: 'Faltante', value: remaining },
  ];

  const COLORS = ['#22d3ee', '#f59e0b'];

  const achievedPercentage = (achieved / goal) * 100;

  return (
    <div style={{ width: '100%', height: 350 }} className="relative flex flex-col items-center justify-center">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
           <Legend 
            verticalAlign="bottom" 
            height={36} 
            formatter={(value, entry, index) => <span className="text-slate-300">{value}</span>}
            />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-4xl font-bold text-white">{achievedPercentage.toFixed(2)}%</span>
        <p className="text-slate-400 text-sm">Alcançado</p>
      </div>
    </div>
  );
};

export default GoalProgressChart;