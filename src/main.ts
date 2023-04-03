import Vue from 'vue';
import App from './App.vue';
import store from './store';
import format from 'date-fns/format';

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

Vue.filter(
  'formatDate',
  function (value: string, formatAs = 'dd/MMM/yy' as string) {
    if (!value) return value;
    return format(new Date(`${value}T00:00`), formatAs);
  }
);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
