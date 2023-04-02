import type { MutationTree } from 'vuex';
import type { State } from './state';
import type { QuoteItem } from '../../models/Quote';

export enum MutationType {
  SET_QUOTE_ITEMS = 'SET_QUOTE_ITEMS',
  SET_CURRENCY_FILTER = 'SET_CURRENCY_FILTER',
  SET_YEARS_FILTER = 'SET_YEARS_FILTER',
  SET_DISPLAY_FILTER = 'SET_DISPLAY_FILTER',
  SET_COMPANY_NAME_FILTER = 'SET_COMPANY_NAME_FILTER',
}

export interface Mutations extends MutationTree<State> {
  [MutationType.SET_QUOTE_ITEMS](state: State, items: Array<QuoteItem>): void;
  [MutationType.SET_CURRENCY_FILTER](state: State, currency: string): void;
  [MutationType.SET_YEARS_FILTER](state: State, years: Array<number>): void;
  [MutationType.SET_DISPLAY_FILTER](state: State, display: string): void;
  [MutationType.SET_COMPANY_NAME_FILTER](state: State, name: string): void;
}

export default {
  [MutationType.SET_QUOTE_ITEMS](state, items) {
    state.quoteItems = items;
  },
  [MutationType.SET_CURRENCY_FILTER](state, currency) {
    state.currencyFilter = currency;
  },
  [MutationType.SET_YEARS_FILTER](state, years) {
    state.yearsFilter = years;
  },
  [MutationType.SET_DISPLAY_FILTER](state, display) {
    state.displayFilter = display;
  },
  [MutationType.SET_COMPANY_NAME_FILTER](state, name) {
    state.companyNameFilter = name;
  },
} as Mutations;
