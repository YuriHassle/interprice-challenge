<template>
  <div>
    <ButtonGroup
      :list="currencyButtonList"
      @handleButtonGroupClick="(currency) => setCurrencyFilter(currency)"
    />
    <ButtonGroup
      :list="yearsButtonList"
      @handleButtonGroupClick="(year) => setYearsFilter(year)"
    />
    <ButtonGroup
      :list="displayButtonList"
      @handleButtonGroupClick="(display) => setDisplayFilter(display)"
    />
    <InputAtom
      placeholder="Filter by company name..."
      @handleInput="(name) => setCompanyNameFilter(name)"
    />
    {{ filteredQuoteItems }}
  </div>
</template>

<script lang="ts">
interface ButtonGroupProps {
  list: { key: string; label: string };
}

import Vue from 'vue';
import ButtonGroup from '../components/molecules/ButtonGroup.vue';
import InputAtom from '../components/atoms/InputAtom.vue';
import { mapActions, mapGetters } from 'vuex';

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
