<template>
  <div class="table-responsive">
    <table class="table table-hover table-responsive">
      <thead class="table__head">
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
      <tbody class="table__body table-group-divider">
        <tr
          v-for="(row, rowIndex) in tableData"
          :key="`${row.id}-${row.companyLabel}`"
          class="table__row"
          :class="{
            'table__row--hidden': hiddenRows.includes(rowIndex),
          }"
        >
          <td class="table__cell">
            <i
              v-if="row.dateSent"
              class="bi"
              :class="
                hiddenRows.includes(rowIndex + 1)
                  ? 'bi-chevron-right'
                  : 'bi-chevron-down'
              "
              @click="handleDropdownClick(rowIndex)"
            />
            {{ row.dateSent }}
          </td>
          <td
            class="table__cell"
            :class="[
              {
                'table__cell--primary': row.displayType === displayFilter,
              },
              {
                'table__cell--disabled': !row.years,
              },
            ]"
          >
            {{ row.companyLabel }}
          </td>
          <td
            class="table__cell"
            v-for="(year, columnIndex) in tableSubHeaders"
            :key="`${row.id}-${columnIndex}`"
            :class="{
              'table__cell--min-value':
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
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import type { Quote } from '../../models/Quote';
import { displayTypes } from '../../models/Quote';

export default Vue.extend({
  data() {
    return {
      hiddenRows: [] as Array<number>,
    };
  },
  computed: {
    ...mapGetters('quotes', ['filteredQuoteItems']),
    ...mapState('quotes', ['yearsFilter', 'displayFilter']),
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
      for (const columnIndex of vm.tableSubHeaders.keys()) {
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
  methods: {
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
    handleDropdownClick(rowIndex: number) {
      const rowsToEvaluate = [rowIndex + 1, rowIndex + 2];
      this.hiddenRows = this.hiddenRows.some((row) =>
        rowsToEvaluate.includes(row)
      )
        ? this.hiddenRows.filter((key: number) => !rowsToEvaluate.includes(key))
        : [...this.hiddenRows, ...rowsToEvaluate];
    },
  },
});
</script>

<style lang="scss" scoped>
.table {
  &__head {
    & th {
      font-size: 1rem;
      font-weight: 500;
      text-align: center;
      color: var(--subtitle-color);
    }
  }
  &__body {
    &.table-group-divider {
      border-top-width: 0.14rem;
      border-top-color: var(--table-primary-color);
    }
  }
  &__row {
    &--hidden {
      display: none;
    }
  }
  &__cell {
    &--min-value {
      background-color: var(--highlight-color);
    }
    &--primary {
      font-weight: bold;
    }
    &--disabled {
      color: var(--table-cell-disabled);
      font-weight: bold;
    }
  }
}
</style>
