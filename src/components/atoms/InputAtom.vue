<template>
  <div>
    <label v-if="label" for="input">{{ label }}</label>
    <input
      id="input"
      class="input"
      v-bind="$attrs"
      @input="$emit('handleInput', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
});
</script>

<style scoped></style>
