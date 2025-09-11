
export interface MonthlySale {
  month: string;
  revenue: number;
}

export interface SalesData {
  monthlySales: MonthlySale[];
  goal: number;
}

export type StoreType = 'ATACADO' | 'INDUSTRIA';

export type Month = 'Jan' | 'Fev' | 'Mar' | 'Abr' | 'Mai' | 'Jun' | 'Jul' | 'Agos';

export interface SellerSale {
  name: string;
  month: Month;
  storeType: StoreType;
  quantity: number;
  value: number;
}
