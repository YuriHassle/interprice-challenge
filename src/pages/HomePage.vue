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
            {{ getCouponType(index) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in tableData"
          :key="`${row.id}-${row.companyLabel}`"
        >
          <td>{{ row.dateSent }}</td>
          <td>{{ row.companyLabel }}</td>
          <td
            v-for="(year, columnIndex) in tableSubHeaders"
            :key="`${row.id}-${columnIndex}`"
            :class="{
              '--min-value':
                getMinValueByColumn(columnIndex) ===
                getQuoteValue(rowIndex, columnIndex),
            }"
          >
            {{
              getQuoteValue(rowIndex, columnIndex) ||
              '' | formatQuoteValue(row.displayType)
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
            {{ average || '' | formatQuoteValue(displayFilter) }}
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
      for (const [columnIndex, year] of vm.tableSubHeaders.entries()) {
        let counter = 0;
        const totalByYear = vm.tableData.reduce(
          (sum: number, data: any, rowIndex: number) => {
            if (data.displayType === vm.displayFilter) {
              const value = vm.getQuoteValue(rowIndex, columnIndex);
              if (value) {
                sum += value;
                counter++;
              }
            }
            return sum;
          },
          0
        );
        tableFooter.push(counter ? totalByYear / counter : 0);
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
    getMinValueByColumn(columnIndex: number): number {
      const vm = this as any;
      const col = vm.tableSubHeaders[columnIndex];
      const couponType = vm.getCouponType(columnIndex);

      const minValue = vm.tableData.reduce(
        (findMinValue: number, data: any) => {
          const value = data.years?.[col]?.[couponType]?.[vm.displayFilter];
          if (value) {
            findMinValue =
              findMinValue === null || value < findMinValue
                ? value
                : findMinValue;
          }
          return findMinValue;
        },
        null
      );
      return minValue;
    },
    getCouponType(columnIndex: number): string {
      return columnIndex % 2 === 0 ? 'FIX' : 'FRN';
    },
    getQuoteValue(rowIndex: number, columnIndex: number): string {
      const vm = this as any;
      const row = vm.tableData[rowIndex];
      const col = vm.tableSubHeaders[columnIndex];
      return row.years?.[col]?.[vm.getCouponType(columnIndex)]?.[
        row.displayType
      ];
    },
  },
});
</script>

<style lang="scss" scoped>
.--min-value {
  background-color: yellow;
}
</style>
