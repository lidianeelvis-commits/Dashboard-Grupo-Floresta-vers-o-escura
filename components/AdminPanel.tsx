import React, { useState, useMemo } from 'react';
import { type SellerSale, type Month, type StoreType } from '../types';

interface AdminPanelProps {
  onAddSale: (sale: SellerSale) => void;
  existingData: SellerSale[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddSale, existingData }) => {
  const initialFormState: Omit<SellerSale, 'value' | 'quantity'> & { value: string, quantity: string } = {
    name: '',
    month: 'Jan',
    storeType: 'ATACADO',
    quantity: '',
    value: '',
  };

  const [formState, setFormState] = useState(initialFormState);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const existingSellers = useMemo(() => {
    return [...new Set(existingData.map(d => d.name))].sort();
  }, [existingData]);
  
  const allMonths: Month[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Agos'];
  const allStoreTypes: StoreType[] = ['ATACADO', 'INDUSTRIA'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSale: SellerSale = {
      ...formState,
      quantity: parseInt(formState.quantity, 10),
      value: parseFloat(formState.value),
    };
    
    if (isNaN(newSale.quantity) || isNaN(newSale.value) || !newSale.name) {
        setFeedbackMessage('Erro: Verifique se todos os campos estão preenchidos corretamente.');
        setTimeout(() => setFeedbackMessage(null), 3000);
        return;
    }

    onAddSale(newSale);
    setFeedbackMessage(`Venda para ${newSale.name} adicionada com sucesso!`);
    setFormState(initialFormState);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Adicionar Nova Venda</h2>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
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
  );
};

export default AdminPanel;
