<template>
  <button
    @click="$emit('handleButtonClick')"
    class="btn"
    :class="`btn-${theme}`"
    v-bind="$attrs"
  >
    {{ label }}
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    label: String,
    theme: {
      type: String,
      default: 'primary',
    },
  },
});
</script>

<style lang="scss" scoped>
.btn-primary {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-label);
}
</style>
