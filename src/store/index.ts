import Vue from 'vue';
import Vuex from 'vuex';
import quotes from './quotes';
import type { State as QuoteState } from './quotes/state';

Vue.use(Vuex);

export interface GlobalState {
  modules: {
    quotes: QuoteState;
  };
}

export default new Vuex.Store({
  modules: {
    quotes,
  },
});
