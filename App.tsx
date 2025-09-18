
import React, { useState, useMemo, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { SALES_DATA, SELLER_SALES_DATA, ADMIN_PASSWORD } from './constants';
import { type SalesData, type SellerSale, type MonthlySale } from './types';
import { LockIcon, LogOutIcon, ArrowLeftIcon, PrinterIcon } from './components/icons';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'dashboard' | 'admin'>('dashboard');
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Initialize state from localStorage or fallback to constants
  const [sellerSalesData, setSellerSalesData] = useState<SellerSale[]>(() => {
    try {
      const savedData = localStorage.getItem('sellerSalesData');
      return savedData ? JSON.parse(savedData) : SELLER_SALES_DATA;
    } catch (error) {
      console.error("Failed to parse seller sales data from localStorage", error);
      return SELLER_SALES_DATA;
    }
  });

  // Persist state to localStorage on change
  useEffect(() => {
    localStorage.setItem('sellerSalesData', JSON.stringify(sellerSalesData));
  }, [sellerSalesData]);
  
  const salesData: SalesData = useMemo(() => {
    const monthlySalesMap = sellerSalesData.reduce<Record<string, number>>((acc, sale) => {
      acc[sale.month] = (acc[sale.month] || 0) + sale.value;
      return acc;
    }, {});

    // Use SALES_DATA.monthlySales as a template to ensure all months are present and ordered correctly.
    const monthlySales: MonthlySale[] = SALES_DATA.monthlySales.map(templateMonth => ({
        month: templateMonth.month,
        revenue: monthlySalesMap[templateMonth.month] || 0
    }));
      
    return {
      monthlySales,
      goal: SALES_DATA.goal,
    };
  }, [sellerSalesData]);

  const handleLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setView('admin');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('dashboard');
  };

  const handleAddSale = (newSale: SellerSale) => {
    setSellerSalesData(prevData => [...prevData, newSale]);
  };
  
  const renderHeaderControls = () => {
    if (view === 'admin' && isLoggedIn) {
      return (
        <>
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Voltar ao Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
            Sair
          </button>
        </>
      );
    }
    
    if (isLoggedIn) {
        return (
            <>
                <button
                    onClick={() => setView('admin')}
                    className="text-sm font-medium py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                    Painel Admin
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors"
                >
                    <LogOutIcon className="w-4 h-4" />
                    Sair
                </button>
            </>
        );
    }

    return (
      <button
        onClick={() => setShowLoginModal(true)}
        className="flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
      >
        <LockIcon className="w-4 h-4" />
        Acesso Admin
      </button>
    );
  };

  return (
    <main className="bg-slate-900 min-h-screen text-gray-200 font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-6">
           <div>
             <h1 className="text-3xl font-bold text-white">Dashboard de Vendas</h1>
             {view === 'dashboard' && <p className="text-lg text-slate-400">Resumo de performance de Janeiro a Dezembro.</p>}
           </div>
           <div className="flex items-center gap-4">
            {view === 'dashboard' && (
                <button
                    id="print-dashboard-btn"
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                    aria-label="Imprimir Dashboard"
                >
                    <PrinterIcon className="w-4 h-4" />
                    Imprimir
                </button>
            )}
            {renderHeaderControls()}
           </div>
        </header>

        {view === 'dashboard' && <Dashboard salesData={salesData} sellerSalesData={sellerSalesData} />}
        {view === 'admin' && isLoggedIn && <AdminPanel onAddSale={handleAddSale} existingData={sellerSalesData} />}
        
        {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
      </div>
    </main>
  );
};

export default App;
