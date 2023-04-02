import type { QuoteItem } from '../../models/Quote';

export interface State {
  quoteItems: Array<QuoteItem>;
  companyNameFilter: string;
  currencyFilter: string;
  displayFilter: string;
  yearsFilter: Array<number>;
}

export default (): State => ({
  quoteItems: [],
  companyNameFilter: '',
  currencyFilter: '',
  displayFilter: '',
  yearsFilter: [],
});
