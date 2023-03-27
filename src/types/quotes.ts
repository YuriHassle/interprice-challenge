export interface Item {
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

export type CouponType = 'FIX' | 'FRN';
