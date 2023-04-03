<template>
  <section>
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
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import ButtonGroup from '../molecules/ButtonGroup.vue';
import InputAtom from '../atoms/InputAtom.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { displayTypes } from '../../models/Quote';

interface ButtonGroupProps {
  key: string;
  label: string;
}

export default Vue.extend({
  components: {
    ButtonGroup,
    InputAtom,
  },
  computed: {
    ...mapGetters('quotes', ['filteredQuoteItems', 'currencyList', 'yearList']),
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
      return displayTypes.map((display: string) => ({
        key: display,
        label: display,
      }));
    },
  },
  methods: {
    ...mapActions('quotes', [
      'setCurrencyFilter',
      'setYearsFilter',
      'setDisplayFilter',
      'setCompanyNameFilter',
    ]),
  },
});
</script>

<style scoped></style>
