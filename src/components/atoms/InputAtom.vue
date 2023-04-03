<template>
  <div class="input-container">
    <label v-if="label" for="input" class="form-label">{{ label }}</label>
    <input
      id="input"
      class="form-control"
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

<style scoped lang="scss"></style>
