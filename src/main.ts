import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.filter('formatQuoteValue', function (value: number, displayType: string) {
  switch (displayType) {
    case 'Spread':
    case '3MLSpread':
      return value ? `+${Math.round(value)}bp` : '';
    case 'Yield':
      return value ? `${value.toFixed(3)}%` : '';
    default:
      return value;
  }
});

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
