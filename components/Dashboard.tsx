
import React, { useState, useMemo } from 'react';
import KpiCard from './KpiCard';
import MonthlySalesChart from './MonthlySalesChart';
import GoalProgressChart from './GoalProgressChart';
import DailySalesChart from './DailySalesChart'; // Import the new component
import { 
  DollarSignIcon, 
  TargetIcon, 
  TrendingUpIcon, 
  AlertTriangleIcon, 
  SearchIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  TrophyIcon,
  CalendarDaysIcon, // Import the new icon
} from './icons';
import { type SellerSale, type SalesData, type Month } from '../types';

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// --- SellerPerformance Component ---

interface AggregatedSellerData {
  name: string;
  quantity: number;
  value: number;
}

type SortKey = keyof AggregatedSellerData;

interface SellerPerformanceProps {
  data: SellerSale[];
}

const SellerPerformance: React.FC<SellerPerformanceProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('All');
  const [storeFilter, setStoreFilter] = useState('All');
  const [dayFilter, setDayFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'value', direction: 'descending' });

  const months = useMemo(() => ['All', ...Array.from(new Set(data.map(item => item.month)))], [data]);
  const storeTypes = useMemo(() => ['All', ...Array.from(new Set(data.map(item => item.storeType)))], [data]);

  const processedData = useMemo(() => {
    let filteredData = data;

    if (monthFilter !== 'All') {
      filteredData = filteredData.filter(item => item.month === monthFilter);
    }

    if (storeFilter !== 'All') {
      filteredData = filteredData.filter(item => item.storeType === storeFilter);
    }
    
    if (dayFilter) {
      const day = parseInt(dayFilter, 10);
      if (!isNaN(day)) {
        filteredData = filteredData.filter(item => item.day === day);
      }
    }

    if (searchTerm) {
      filteredData = filteredData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    const aggregated = filteredData.reduce<Record<string, AggregatedSellerData>>((acc, curr) => {
      if (!acc[curr.name]) {
        acc[curr.name] = { name: curr.name, quantity: 0, value: 0 };
      }
      acc[curr.name].quantity += curr.quantity;
      acc[curr.name].value += curr.value;
      return acc;
    }, {});
    
    let sortableItems = Object.values(aggregated);

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [data, searchTerm, monthFilter, storeFilter, dayFilter, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: SortKey) => {
      if (!sortConfig || sortConfig.key !== key) {
        return <span className="opacity-30">↑↓</span>;
      }
      if (sortConfig.direction === 'ascending') {
        return <ArrowUpIcon className="w-4 h-4 ml-1" />;
      }
      return <ArrowDownIcon className="w-4 h-4 ml-1" />;
  }

  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4">Desempenho por Vendedor</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Buscar vendedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500"
            aria-label="Buscar vendedor"
          />
        </div>
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white focus:ring-cyan-500 focus:border-cyan-500"
          aria-label="Filtrar por mês"
        >
          {months.map(month => <option key={month} value={month}>{month === 'All' ? 'Todos os Meses' : month}</option>)}
        </select>
        <select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white focus:ring-cyan-500 focus:border-cyan-500"
          aria-label="Filtrar por tipo de loja"
        >
          {storeTypes.map(store => <option key={store} value={store}>{store === 'All' ? 'Todas as Lojas' : `Loja ${store}`}</option>)}
        </select>
        <input
          type="number"
          placeholder="Dia"
          value={dayFilter}
          onChange={(e) => setDayFilter(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500 sm:w-24"
          aria-label="Filtrar por dia"
          min="1"
          max="31"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <button onClick={() => requestSort('name')} className="flex items-center hover:text-white transition-colors">
                    Vendedor {getSortIcon('name')}
                </button>
              </th>
              <th scope="col" className="px-6 py-3">
                <button onClick={() => requestSort('quantity')} className="flex items-center hover:text-white transition-colors">
                    Qtd. Vendas {getSortIcon('quantity')}
                </button>
              </th>
              <th scope="col" className="px-6 py-3">
                <button onClick={() => requestSort('value')} className="flex items-center hover:text-white transition-colors">
                    Valor Vendas {getSortIcon('value')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((seller) => (
              <tr key={seller.name} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {seller.name}
                </th>
                <td className="px-6 py-4">{seller.quantity.toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4 font-semibold text-cyan-400">{formatCurrency(seller.value)}</td>
              </tr>
            ))}
             {processedData.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center py-8 text-slate-400">
                        Nenhum resultado encontrado.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- Dashboard Component ---
interface DashboardProps {
    salesData: SalesData;
    sellerSalesData: SellerSale[];
}

const Dashboard: React.FC<DashboardProps> = ({ salesData, sellerSalesData }) => {
  const { monthlySales, goal } = salesData;
  const [monthFilter, setMonthFilter] = useState('All');

  const allMonths = useMemo(() => ['All', ...monthlySales.map(s => s.month)], [monthlySales]);

  const totalSales = useMemo(
    () => monthlySales.reduce((acc, sale) => acc + sale.revenue, 0),
    [monthlySales]
  );
  
  const displayTotalSales = useMemo(() => {
    if (monthFilter === 'All') {
        return totalSales;
    }
    return monthlySales.find(sale => sale.month === monthFilter)?.revenue ?? 0;
  }, [monthFilter, monthlySales, totalSales]);


  const remainingToGo = goal - totalSales;

  const topSellerData = useMemo(() => {
    const dataToFilter = sellerSalesData;

    if (monthFilter === 'All') {
        const salesBySeller = dataToFilter.reduce<Record<string, number>>((acc, sale) => {
            if (!acc[sale.name]) {
                acc[sale.name] = 0;
            }
            acc[sale.name] += sale.value;
            return acc;
        }, {});

        if (Object.keys(salesBySeller).length === 0) return null;

        const [topSellerName, topSellerValue] = Object.entries(salesBySeller).reduce((top, current) => {
            return current[1] > top[1] ? current : top;
        });

        return {
            title: "Melhor Vendedor (Geral)",
            name: topSellerName.split(' ').slice(1).join(' '), // Remove number prefix
            value: topSellerValue,
        };
    } else {
        const monthSales = dataToFilter.filter(sale => sale.month === monthFilter);

        const salesBySeller = monthSales.reduce<Record<string, number>>((acc, sale) => {
            if (!acc[sale.name]) {
                acc[sale.name] = 0;
            }
            acc[sale.name] += sale.value;
            return acc;
        }, {});

        if (Object.keys(salesBySeller).length === 0) return null;

        const [topSellerName, topSellerValue] = Object.entries(salesBySeller).reduce((top, current) => {
            return current[1] > top[1] ? current : top;
        });

        return {
            title: `Vendedor do Mês (${monthFilter})`,
            name: topSellerName.split(' ').slice(1).join(' '), // Remove number prefix
            value: topSellerValue,
        };
    }
  }, [monthFilter, sellerSalesData]);

  const dailySalesData = useMemo(() => {
    if (monthFilter === 'All') {
      return [];
    }
    const monthSales = sellerSalesData.filter(sale => sale.month === monthFilter);
    const salesByDay = monthSales.reduce<Record<number, number>>((acc, sale) => {
      acc[sale.day] = (acc[sale.day] || 0) + sale.value;
      return acc;
    }, {});

    return Object.entries(salesByDay)
      .map(([day, totalValue]) => ({
        day: parseInt(day, 10),
        totalValue,
      }))
      .sort((a, b) => a.day - b.day);
  }, [monthFilter, sellerSalesData]);


  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
            <label htmlFor="month-filter" className="text-sm font-medium text-slate-400">Filtrar por Mês:</label>
            <select
                id="month-filter"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                aria-label="Filtrar faturamento por mês"
                >
                {allMonths.map(month => <option key={month} value={month}>{month === 'All' ? 'Todos os Meses' : month}</option>)}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total de Vendas" 
          value={formatCurrency(displayTotalSales)}
          icon={<TrendingUpIcon className="w-8 h-8 text-cyan-400" />} 
        />
        <KpiCard
          title={topSellerData ? topSellerData.title : 'Vendedor do Mês'}
          value={topSellerData ? topSellerData.name : 'N/A'}
          subValue={topSellerData ? formatCurrency(topSellerData.value) : undefined}
          icon={<TrophyIcon className="w-8 h-8 text-yellow-400" />}
        />
        <KpiCard 
          title="Meta 2025" 
          value={formatCurrency(goal)}
          icon={<TargetIcon className="w-8 h-8 text-green-400" />} 
        />
         <KpiCard 
          title="Faltante" 
          value={formatCurrency(remainingToGo)}
          icon={<AlertTriangleIcon className="w-8 h-8 text-amber-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Faturamento Mensal</h2>
            <MonthlySalesChart data={monthlySales} selectedMonth={monthFilter !== 'All' ? monthFilter : undefined} />
        </div>
        <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Progresso da Meta</h2>
            <GoalProgressChart achieved={totalSales} remaining={remainingToGo} goal={goal} />
        </div>
      </div>

      <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CalendarDaysIcon className="w-6 h-6 text-slate-400" />
            Desempenho Diário de Vendas {monthFilter !== 'All' && `(${monthFilter})`}
        </h2>
        {monthFilter !== 'All' && dailySalesData.length > 0 ? (
          <DailySalesChart data={dailySalesData} />
        ) : (
          <div className="flex items-center justify-center h-80 text-slate-400">
            <p>{monthFilter === 'All' ? 'Selecione um mês para ver o desempenho diário.' : 'Nenhum dado de venda para este mês.'}</p>
          </div>
        )}
      </div>
      
      <SellerPerformance data={sellerSalesData} />

    </div>
  );
};

export default Dashboard;
