<template>
  <div>
    <FilterSection />
    <QuotesTable />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import QuotesTable from '../components/organisms/QuotesTable.vue';
import FilterSection from '../components/organisms/FilterSection.vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  data() {
    return {};
  },
  mounted() {
    this.setQuoteItems();
  },
  components: {
    FilterSection,
    QuotesTable,
  },
  methods: {
    ...mapActions('quotes', ['setQuoteItems']),
  },
});
</script>

<style lang="scss" scoped></style>
