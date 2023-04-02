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
  setYearsFilter(context: Context, year: number): void;
}

export default {
  setQuoteItems({ commit, getters, state }) {
    const { Items } = quotesData;
    commit(MutationType.SET_QUOTE_ITEMS, Items);
    if (!state.yearsFilter.length) {
      commit(MutationType.SET_YEARS_FILTER, getters.yearList);
    }
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
  setYearsFilter({ commit, state }, year) {
    const { yearsFilter } = state;
    const newArray = yearsFilter.includes(year)
      ? yearsFilter.filter((y) => y !== year)
      : [...yearsFilter, year];
    commit(MutationType.SET_YEARS_FILTER, newArray);
  },
} as Actions;
