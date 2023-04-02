import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import state from './state';
import type { State } from './state';

Vue.use(Vuex);

export default new Vuex.Store<State>({
  state,
  mutations: {},
  actions,
  getters,
});
