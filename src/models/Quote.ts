export interface QuoteItem {
  Id: string | null;
  DateSent: string | null;
  Company: string;
  Preferred: string;
  Quote: Quote[] | null;
}

export interface Quote {
  Amount: number;
  Currency: string;
  Years: number;
  CouponType: CouponType;
  Spread: number | null;
  Yield: number | null;
  '3MLSpread': number | null;
}

export interface TableData {
  companyName: string;
  dateSent: string | null;
  displayType?: string;
  id: string | null;
  preferred?: string;
  years?: any;
}

export type CouponType = 'FIX' | 'FRN';

export const displayTypes = ['Spread', 'Yield', '3MLSpread'];
