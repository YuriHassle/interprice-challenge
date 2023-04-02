import type { ActionTree, ActionContext } from 'vuex';
import type { State } from './state';
import quotesData from '../../mock/data.json';
import { MutationType } from './mutations';

type Context = ActionContext<State, State>;

export interface Actions extends ActionTree<State, State> {
  setQuoteItems(context: Context): void;
  setCurrencyFilter(context: Context, currency: string): void;
  setDisplayFilter(context: Context, display: string): void;
  setCompanyNameFilter(context: Context, companyName: string): void;
  setYearsFilter(context: Context, years: Array<number>): void;
}

export default {
  setQuoteItems(context) {
    const { Items } = quotesData;
    context.commit(MutationType.SET_QUOTE_ITEMS, Items);
  },
  setCurrencyFilter(context, currency) {
    context.commit(MutationType.SET_CURRENCY_FILTER, currency);
  },
  setDisplayFilter(context, display) {
    context.commit(MutationType.SET_DISPLAY_FILTER, display);
  },
  setCompanyNameFilter(context, companyName) {
    context.commit(MutationType.SET_COMPANY_NAME_FILTER, companyName);
  },
  setYearsFilter(context, years) {
    context.commit(MutationType.SET_YEARS_FILTER, years);
  },
} as Actions;
