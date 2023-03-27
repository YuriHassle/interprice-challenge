<template>
  <div>
    <ButtonGroup :list="currencyList" />
    <ButtonGroup :list="yearList" />
    <ButtonGroup :list="displayList" />
    {{ tableData }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ButtonGroup from '../components/molecules/ButtonGroup.vue';
import quotesData from '../mock/data.json';
import { mapQuotes } from '../mappers/quotes';
import type { Item } from '../types/quotes';

export default Vue.extend({
  data() {
    return {};
  },
  computed: {
    currencyList(): Array<string> {
      //should be a getter
      const { Items } = quotesData;
      const list = [] as Array<string>;
      Items.forEach(({ Quote }) => {
        Quote?.forEach(({ Currency }) => {
          if (!list.includes(Currency)) {
            list.push(Currency);
          }
        });
      });
      return list;
    },
    yearList(): Array<string> {
      //should be a getter
      const { Items } = quotesData;
      const list = [] as Array<number>;
      Items.forEach(({ Quote }) => {
        Quote?.forEach(({ Years }) => {
          if (!list.includes(Years)) {
            list.push(Years);
          }
        });
      });
      return list.map((year) => `${year} YRS`);
    },
    displayList(): Array<string> {
      return ['Spread', 'Yield', '3MLSpread'];
    },
    tableData() {
      const mapQuoteParams = {
        items: quotesData.Items as Item[],
        years: [12, 10],
        currency: 'USD',
        companyName: 'Open',
      };
      const mappedQuotes = mapQuotes(mapQuoteParams);
      return mappedQuotes;
    },
  },
  components: {
    ButtonGroup,
  },
  // mounted() {},
});
</script>

<style lang="scss" scoped></style>
