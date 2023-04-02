import type { ActionTree, ActionContext } from 'vuex';
import type { State } from './state';
import quotesData from '../mock/data.json';
import type { QuoteItem } from '../models/Quote';

type Context = ActionContext<State, State>;

export interface Actions extends ActionTree<State, State> {
  loadQuoteItems(context: Context): QuoteItem[];
}

export default {
  loadQuoteItems() {
    return quotesData.Items;
  },
} as Actions;
