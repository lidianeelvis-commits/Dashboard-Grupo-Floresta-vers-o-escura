import React from 'react';

interface KpiCardProps {
  title: React.ReactNode;
  value: string;
  icon: React.ReactNode;
  subValue?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, subValue }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-4">
      <div className="bg-slate-900 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <div className="text-sm text-slate-400">{title}</div>
        <p className="text-2xl font-bold text-white truncate" title={value}>{value}</p>
        {subValue && <p className="text-sm font-medium text-slate-300">{subValue}</p>}
      </div>
    </div>
  );
};

export default KpiCard;