<template>
  <div>
    <ButtonGroup :list="currencyList" />
    <ButtonGroup :list="yearList" />
    <ButtonGroup :list="displayList" />
    {{ filteredQuoteItems }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ButtonGroup from '../components/molecules/ButtonGroup.vue';
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
  data() {
    return {};
  },
  mounted() {
    this.loadQuoteItems();
  },
  computed: {
    ...mapGetters('quotes', [
      'filteredQuoteItems',
      'currencyList',
      'yearList',
      'displayList',
    ]),
  },
  components: {
    ButtonGroup,
  },
  methods: {
    ...mapActions('quotes', ['loadQuoteItems']),
  },
});
</script>

<style lang="scss" scoped></style>
