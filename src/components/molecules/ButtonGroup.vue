<template>
  <div class="button-group">
    <ButtonAtom
      v-for="(label, index) in list"
      :key="`${index}-${label}`"
      :label="label"
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
  },
});
</script>

<style scoped></style>
