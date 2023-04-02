import type { QuoteItem } from '../models/Quote';

export interface State {
  quoteItems: QuoteItem[];
  companyNameFilter: string;
  currencyFilter: string;
  yearsFilter: number[];
}

export default (): State => ({
  quoteItems: [],
  companyNameFilter: '',
  currencyFilter: '',
  yearsFilter: [],
});
