<template>
  <div>
    <ButtonGroup
      :list="currencyButtonList"
      :active="[currencyFilter]"
      @handleButtonGroupClick="(currency) => setCurrencyFilter(currency)"
    />
    <ButtonGroup
      :list="yearsButtonList"
      :active="[...yearsFilter]"
      @handleButtonGroupClick="(year) => setYearsFilter(year)"
    />
    <ButtonGroup
      :list="displayButtonList"
      :active="[displayFilter]"
      @handleButtonGroupClick="(display) => setDisplayFilter(display)"
    />
    <InputAtom
      placeholder="Filter by company name..."
      @handleInput="(name) => setCompanyNameFilter(name)"
    />
    <table>
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th colspan="2" v-for="year in yearsFilter" :key="year">
            {{ year }} YRS
          </th>
        </tr>
        <tr>
          <th>DATE SENT</th>
          <th>COMPANY</th>
          <th
            v-for="(year, index) in tableSubHeaders"
            :key="`${index}-${year}`"
          >
            {{ index % 2 === 0 ? 'FIX' : 'FRN' }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="`${row.id}-${row.companyLabel}`">
          <td>{{ row.dateSent }}</td>
          <td>{{ row.companyLabel }}</td>
          <td
            v-for="(year, index) in tableSubHeaders"
            :key="`${index}-${year}`"
          >
            {{
              row['years']?.[year]?.[index % 2 === 0 ? 'FIX' : 'FRN']?.[
                row.displayType
              ] || ''
            }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="2">Average by Spread</th>
          <td
            v-for="(average, index) in tableFooter"
            :key="`${index}-${average}`"
          >
            {{ average ? average.toFixed(2) : '' }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
interface ButtonGroupProps {
  list: { key: string; label: string };
}

import Vue from 'vue';
import ButtonGroup from '../components/molecules/ButtonGroup.vue';
import InputAtom from '../components/atoms/InputAtom.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import type { Quote } from '../models/Quote';
import { displayTypes } from '../models/Quote';

export default Vue.extend({
  data() {
    return {};
  },
  mounted() {
    this.setQuoteItems();
  },
  computed: {
    ...mapGetters('quotes', [
      'filteredQuoteItems',
      'currencyList',
      'yearList',
      'displayList',
    ]),
    ...mapState('quotes', [
      'currencyFilter',
      'yearsFilter',
      'displayFilter',
      'companyNameFilter',
    ]),
    currencyButtonList(): ButtonGroupProps[] {
      return (this as any).currencyList.map((currency: string) => ({
        key: currency,
        label: currency,
      }));
    },
    yearsButtonList(): ButtonGroupProps[] {
      return (this as any).yearList.map((years: string) => ({
        key: years,
        label: `${years} YRS`,
      }));
    },
    displayButtonList(): ButtonGroupProps[] {
      return (this as any).displayList.map((display: string) => ({
        key: display,
        label: display,
      }));
    },
    tableData(): any {
      const vm = this as any;
      const tableData = [] as any;
      for (const quoteItem of vm.filteredQuoteItems) {
        const quotesGroupedByYear = {} as any;

        const isQuotesNull = quoteItem.Quote === null;

        if (!isQuotesNull) {
          quoteItem.Quote.forEach((quote: Quote) => {
            if (!quotesGroupedByYear[quote.Years]) {
              quotesGroupedByYear[quote.Years] = {};
            }
            quotesGroupedByYear[quote.Years][quote.CouponType] = quote;
          });

          displayTypes.forEach((displayType: string) => {
            const isSelectedDisplayType = displayType === vm.displayFilter;
            tableData.push({
              id: quoteItem.Id,
              dateSent: isSelectedDisplayType ? quoteItem.DateSent : '',
              companyLabel: isSelectedDisplayType
                ? quoteItem.Company
                : displayType,
              displayType,
              years: { ...quotesGroupedByYear },
            });
          });
        } else {
          tableData.push({
            id: quoteItem.Id,
            dateSent: quoteItem.DateSent,
            companyLabel: quoteItem.Company,
          });
        }
      }
      console.log('tableData', tableData);
      return tableData;
    },
    tableFooter(): any {
      const vm = this as any;
      const tableFooter = [] as any;
      for (const [index, year] of vm.tableSubHeaders.entries()) {
        let counter = 0;
        const averageByYear = vm.tableData.reduce((acc: any, curr: any) => {
          if (curr.displayType === vm.displayFilter) {
            const value =
              curr.years[year]?.[index % 2 === 0 ? 'FIX' : 'FRN']?.[
                vm.displayFilter
              ];
            if (value) {
              acc += value;
              counter++;
            }
          }
          return acc;
        }, 0);
        tableFooter.push(counter ? averageByYear / counter : 0);
      }

      return tableFooter;
    },
    tableSubHeaders(): Array<number> {
      const vm = this as any;
      const tableSubHeaders = [] as Array<number>;
      vm.yearsFilter.forEach((year: number) =>
        tableSubHeaders.push(year, year)
      );
      return tableSubHeaders;
    },
  },
  components: {
    ButtonGroup,
    InputAtom,
  },
  methods: {
    ...mapActions('quotes', [
      'setQuoteItems',
      'setCurrencyFilter',
      'setYearsFilter',
      'setDisplayFilter',
      'setCompanyNameFilter',
    ]),
  },
});
</script>

<style lang="scss" scoped></style>
