<template>
  <i
    class="sort-button bi"
    :class="[
      {
        'sort-button--active': sortBy.property === property,
      },
      {
        'bi-caret-down-fill': sortBy.property === property && sortBy.desc,
      },
      {
        'bi-caret-up-fill':
          (sortBy.property === property && !sortBy.desc) ||
          sortBy.property !== property,
      },
    ]"
    @click="$emit('handleSortClick', property)"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    sortBy: {
      type: Object,
      required: true,
    },
    property: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
.sort-button {
  &--active {
    color: var(--black);
  }
}
</style>
