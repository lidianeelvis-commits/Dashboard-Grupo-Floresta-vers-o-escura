
import React, { useState, useMemo } from 'react';
import { type SellerSale, type Month, type StoreType } from '../types';
import { SearchIcon } from './icons';

interface AdminPanelProps {
  onAddSale: (sale: Omit<SellerSale, 'id'>) => void;
  existingData: SellerSale[];
  onDeleteSale: (saleId: string) => void;
}

const monthDisplayNames: { [key in Month]: string } = {
  Jan: 'Janeiro',
  Fev: 'Fevereiro',
  Mar: 'Março',
  Abr: 'Abril',
  Mai: 'Maio',
  Jun: 'Junho',
  Jul: 'Julho',
  Agos: 'Agosto',
  Set: 'Setembro',
  Out: 'Outubro',
  Nov: 'Novembro',
  Dez: 'Dezembro',
};

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddSale, existingData, onDeleteSale }) => {
  const initialFormState: Omit<SellerSale, 'id' | 'value' | 'quantity' | 'day'> & { value: string, quantity: string, day: string } = {
    name: '',
    day: '',
    month: 'Jan',
    storeType: 'ATACADO',
    quantity: '',
    value: '',
  };

  const [formState, setFormState] = useState(initialFormState);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // State for filtering sales list
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('All');
  const [dayFilter, setDayFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('All');

  const existingSellers = useMemo(() => {
    return [...new Set(existingData.map(d => d.name))].sort();
  }, [existingData]);
  
  const allMonths: Month[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Agos', 'Set', 'Out', 'Nov', 'Dez'];
  const allStoreTypes: StoreType[] = ['ATACADO', 'INDUSTRIA'];

  const filteredSales = useMemo(() => {
      return existingData.filter(sale => {
          const searchMatch = !searchTerm || sale.name.toLowerCase().includes(searchTerm.toLowerCase());
          const monthMatch = monthFilter === 'All' || sale.month === monthFilter;
          const storeMatch = storeFilter === 'All' || sale.storeType === storeFilter;
          const dayMatch = !dayFilter || sale.day === parseInt(dayFilter, 10);
          return searchMatch && monthMatch && storeMatch && dayMatch;
      }).sort((a, b) => { // Sort by month, then day, then name
          if (a.month !== b.month) return allMonths.indexOf(a.month) - allMonths.indexOf(b.month);
          if (a.day !== b.day) return a.day - b.day;
          return a.name.localeCompare(b.name);
      });
  }, [existingData, searchTerm, monthFilter, dayFilter, storeFilter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const day = parseInt(formState.day, 10);
    const quantity = parseInt(formState.quantity, 10);
    const value = parseFloat(formState.value);

    if (isNaN(day) || day < 1 || day > 31 || isNaN(quantity) || isNaN(value) || !formState.name) {
        setFeedbackMessage('Erro: Verifique se todos os campos estão preenchidos corretamente.');
        setTimeout(() => setFeedbackMessage(null), 3000);
        return;
    }

    const newSale: Omit<SellerSale, 'id'> = {
      name: formState.name,
      day,
      month: formState.month,
      storeType: formState.storeType,
      quantity,
      value,
    };

    onAddSale(newSale);
    setFeedbackMessage(`Venda para ${newSale.name} adicionada com sucesso!`);
    setFormState(initialFormState);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleDelete = (saleId: string) => {
      if (window.confirm('Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.')) {
          onDeleteSale(saleId);
      }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Nova Venda</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">Vendedor</label>
            <select 
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="" disabled>Selecione um vendedor</option>
              {existingSellers.map(seller => <option key={seller} value={seller}>{seller}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-slate-400 mb-1">Dia</label>
              <input
                type="number"
                id="day"
                name="day"
                min="1"
                max="31"
                value={formState.day}
                onChange={handleChange}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Ex: 15"
              />
            </div>
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-slate-400 mb-1">Mês</label>
              <select
                id="month"
                name="month"
                value={formState.month}
                onChange={handleChange}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
              >
                {allMonths.map(m => <option key={m} value={m}>{monthDisplayNames[m]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="storeType" className="block text-sm font-medium text-slate-400 mb-1">Tipo de Loja</label>
              <select
                id="storeType"
                name="storeType"
                value={formState.storeType}
                onChange={handleChange}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
              >
                {allStoreTypes.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-400 mb-1">Quantidade</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formState.quantity}
                onChange={handleChange}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Ex: 10"
              />
            </div>
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-slate-400 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                id="value"
                name="value"
                value={formState.value}
                onChange={handleChange}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Ex: 2500.50"
              />
            </div>
          </div>

          <div className="pt-2">
              <button type="submit" className="w-full text-center py-2.5 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-800">
                  Adicionar Venda
              </button>
          </div>
        </form>
        {feedbackMessage && (
          <div className={`mt-4 p-3 rounded-md text-sm text-center ${feedbackMessage.startsWith('Erro') ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
            {feedbackMessage}
          </div>
        )}
      </div>

      <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Gerenciar Lançamentos</h2>
        
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
            <option value="All">Todos os Meses</option>
            {allMonths.map(m => <option key={m} value={m}>{monthDisplayNames[m]}</option>)}
          </select>
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white focus:ring-cyan-500 focus:border-cyan-500"
            aria-label="Filtrar por tipo de loja"
          >
            <option value="All">Todas as Lojas</option>
            {allStoreTypes.map(st => <option key={st} value={st}>{st}</option>)}
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
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
              <tr>
                <th scope="col" className="px-4 py-3">Vendedor</th>
                <th scope="col" className="px-4 py-3">Data</th>
                <th scope="col" className="px-4 py-3">Loja</th>
                <th scope="col" className="px-4 py-3 text-right">Quantidade</th>
                <th scope="col" className="px-4 py-3 text-right">Valor</th>
                <th scope="col" className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => (
                <tr key={sale.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="px-4 py-2 font-medium text-white whitespace-nowrap">{sale.name}</td>
                  <td className="px-4 py-2">{`${sale.day} de ${monthDisplayNames[sale.month]}`}</td>
                  <td className="px-4 py-2">{sale.storeType}</td>
                  <td className="px-4 py-2 text-right">{sale.quantity.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-2 text-right font-semibold text-cyan-400">{sale.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-500 hover:text-red-400 text-xs font-semibold py-1 px-2 rounded-md bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      aria-label={`Excluir lançamento de ${sale.name} no dia ${sale.day} de ${monthDisplayNames[sale.month]}`}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Nenhum lançamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
