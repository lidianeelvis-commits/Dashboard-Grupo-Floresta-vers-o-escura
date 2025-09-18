
export interface MonthlySale {
  month: string;
  revenue: number;
}

export interface SalesData {
  monthlySales: MonthlySale[];
  goal: number;
}

export type StoreType = 'ATACADO' | 'INDUSTRIA';

export type Month = 'Jan' | 'Fev' | 'Mar' | 'Abr' | 'Mai' | 'Jun' | 'Jul' | 'Agos' | 'Set' | 'Out' | 'Nov' | 'Dez';

export interface SellerSale {
  name: string;
  day: number;
  month: Month;
  storeType: StoreType;
  quantity: number;
  value: number;
}
