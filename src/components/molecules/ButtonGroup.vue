<template>
  <div class="button-group">
    <ButtonAtom
      v-for="{ label, key } in list"
      :key="key"
      :label="label"
      theme="secondary"
      :class="{ 'btn--active': active.includes(key) }"
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

<style scoped>
.btn--active {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-label);
}
</style>
