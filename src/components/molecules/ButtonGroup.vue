<template>
  <div class="button-group">
    <ButtonAtom
      v-for="{ label, key } in list"
      :key="key"
      :label="label"
      theme="secondary"
      :class="{ 'button-group--active': active.includes(key) }"
      @handleButtonClick="$emit('handleButtonGroupClick', key)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ButtonAtom from '../atoms/ButtonAtom.vue';

export default Vue.extend({
  components: {
    ButtonAtom,
  },
  props: {
    list: Array,
    active: Array,
  },
});
</script>

<style scoped lang="scss">
.button-group {
  & button {
    border-radius: 0;
    &:first-child {
      border-radius: 0.25rem 0 0 0.25rem;
    }
    &:last-child {
      border-radius: 0 0.25rem 0.25rem 0;
    }
  }
  &--active {
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-label);
    border-right-color: var(--white);
  }
}
</style>
