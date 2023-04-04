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
          <th>
            <span> DATE SENT </span>
            <SortIcon
              :sortBy="sortBy"
              property="dateSent"
              @handleSortClick="handleSortClick"
            />
          </th>
          <th>
            <span> COMPANY </span>
            <SortIcon
              :sortBy="sortBy"
              property="companyName"
              @handleSortClick="handleSortClick"
            />
          </th>
          <th
            v-for="(year, index) in tableSubHeaders"
            :key="`${index}-${year}`"
          >
            {{ getCouponType(index) }}
          </th>
        </tr>
      </thead>
      <tbody class="table__body">
        <tr
          v-for="(row, rowIndex) in tableData"
          :key="`${row.id}-${rowIndex}`"
          :class="{
            'table__body--row-hidden': hiddenRows.includes(rowIndex),
          }"
        >
          <td>
            <i
              v-if="isSelectedDisplayType(row.displayType)"
              class="table__dropdown-button bi"
              :class="
                hiddenRows.includes(rowIndex + 1)
                  ? 'bi-chevron-right'
                  : 'bi-chevron-down'
              "
              @click="handleDropdownClick(row)"
            />
            <span>
              {{
                isSelectedDisplayType(row.displayType)
                  ? row.dateSent
                  : '' | formatDate
              }}
            </span>
          </td>
          <td
            :class="[
              {
                'table__body--cell-primary': isSelectedDisplayType(
                  row.displayType
                ),
              },
              {
                'table__body--cell-disabled': !row.years,
              },
            ]"
          >
            {{
              isSelectedDisplayType(row.displayType) || !row.years
                ? row.companyName
                : row.displayType
            }}
          </td>
          <td
            v-for="(year, columnIndex) in tableSubHeaders"
            :key="`${row.id}-${columnIndex}`"
            :class="{
              'table__body--cell-highlight':
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
      <tfoot class="table__footer">
        <tr>
          <th></th>
          <th>Average by Spread</th>
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
import type { Quote, TableData } from '../../models/Quote';
import SortIcon from '../atoms/SortIcon.vue';
import { displayTypes } from '../../models/Quote';

export default Vue.extend({
  data() {
    return {
      hiddenRows: [] as Array<number>,
      sortBy: {
        property: 'dateSent',
        desc: true,
      },
    };
  },
  components: {
    SortIcon,
  },
  computed: {
    ...mapGetters('quotes', ['filteredQuoteItems']),
    ...mapState('quotes', ['yearsFilter', 'displayFilter']),
    tableData(): TableData[] {
      const vm = this as any;
      const tableData = [] as TableData[];
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
            tableData.push({
              id: quoteItem.Id,
              dateSent: quoteItem.DateSent,
              companyName: quoteItem.Company,
              displayType,
              preferred: quoteItem.Preferred,
              years: { ...quotesGroupedByYear },
            });
          });
        } else {
          tableData.push({
            id: quoteItem.Id,
            dateSent: quoteItem.DateSent,
            companyName: quoteItem.Company,
          });
        }
      }

      const sortedTable = tableData
        .sort(this.sortByProperty('displayType') as any)
        .sort(this.sortByProperty('preferred') as any)
        .sort((a: TableData, b: TableData) =>
          this.sortByProperty(this.sortBy.property)(a, b, this.sortBy.desc)
        )
        .sort(this.sortByProperty('validValues') as any);

      console.log('tableData', sortedTable);
      return sortedTable;
    },
    tableFooter(): Array<number> {
      const vm = this as any;
      const tableFooter = [];
      for (const columnIndex of vm.tableSubHeaders.keys()) {
        let counter = 0;
        const totalByYear = vm.tableData.reduce(
          (sum: number, data: TableData, rowIndex: number) => {
            if (this.isSelectedDisplayType(data.displayType || '')) {
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
      const col = vm.tableSubHeaders[columnIndex] as number;
      const couponType = vm.getCouponType(columnIndex) as string;

      const minValue = vm.tableData.reduce(
        (findMinValue: number, data: TableData) => {
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
    handleDropdownClick(row: TableData) {
      const rowsToEvaluate = this.findRelatedRowsIndexes(row);
      const isHidden = this.hiddenRows.some((row) =>
        rowsToEvaluate.includes(row)
      );
      this.hiddenRows = isHidden
        ? this.hiddenRows.filter((key: number) => !rowsToEvaluate.includes(key))
        : [...this.hiddenRows, ...rowsToEvaluate];
    },
    handleSortClick(property: string) {
      this.sortBy = {
        property,
        desc: this.sortBy.property === property ? !this.sortBy.desc : true,
      };
    },
    isSelectedDisplayType(displayType: string) {
      return displayType === (this as any).displayFilter;
    },

    sortByProperty(property: string) {
      const sortByPreferred = (a: TableData, b: TableData) => {
        return Number(b.preferred) - Number(a.preferred);
      };

      const sortByDisplayType = (a: TableData, b: TableData) => {
        return (
          Number(this.isSelectedDisplayType(b.displayType || '')) -
          Number(this.isSelectedDisplayType(a.displayType || ''))
        );
      };

      const sortByDate = (a: TableData, b: TableData, desc: boolean) => {
        const dateA = new Date(a.dateSent || '').getTime();
        const dateB = new Date(b.dateSent || '').getTime();
        return desc ? dateB - dateA : dateA - dateB;
      };

      const sortByCompanyName = (a: TableData, b: TableData, desc: boolean) => {
        return desc
          ? a.companyName.localeCompare(b.companyName)
          : b.companyName.localeCompare(a.companyName);
      };

      const sortByValidValues = (a: TableData, b: TableData) => {
        return Number(!a.years) - Number(!b.years);
      };

      const sortMethod = {
        dateSent: sortByDate,
        companyName: sortByCompanyName,
        preferred: sortByPreferred,
        displayType: sortByDisplayType,
        validValues: sortByValidValues,
      };

      return sortMethod[property as keyof typeof sortMethod];
    },
    findRelatedRowsIndexes(row: TableData) {
      return this.tableData.reduce(
        (indexes: Array<number>, tableRow: TableData, index: number) => {
          const isRelated =
            tableRow.companyName === row.companyName &&
            tableRow.dateSent === row.dateSent &&
            tableRow.displayType !== (this as any).displayFilter;
          if (isRelated) {
            indexes.push(index);
          }
          return indexes;
        },
        []
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.table {
  font-size: 0.9rem;
  text-align: center;

  &__head {
    & th {
      font-weight: 500;
      color: var(--subtitle-color);
    }

    tr:first-child {
      & th {
        border-bottom-width: 0;
      }
      & th:not(:nth-child(1)):not(:nth-child(2)) {
        color: var(--black);
        border-bottom: 0.1rem solid var(--table-primary-color);
      }
    }

    & tr:last-child th {
      border-bottom: 0.1rem solid var(--table-primary-color);
    }
  }

  &__body {
    & tr:last-child td {
      border-bottom: 0.1rem solid var(--table-primary-color);
    }

    & td {
      transition: max-height 0.6s, padding 0.6s;
    }

    &--row-hidden {
      display: table-column;

      & td {
        max-height: 0;
        padding: 0 0.5rem;
        overflow: hidden;
        border: 0;
        transition: max-height 0.3s, padding 0.3s;
      }
    }

    &--cell-highlight {
      background-color: var(--highlight-color);
    }

    &--cell-primary {
      font-weight: bold;
    }

    &--cell-disabled {
      color: var(--table-cell-disabled);
      font-weight: bold;
    }
  }

  &__footer {
    border: 0.1rem solid var(--table-primary-color);
  }

  &__dropdown-button {
    font-size: 1.1rem;
    cursor: pointer;
  }
}
</style>
