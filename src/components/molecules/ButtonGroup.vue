<template>
  <div class="button-group">
    <ButtonAtom
      v-for="{ label, key } in list"
      :key="key"
      :label="label"
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
  },
});
</script>

<style scoped></style>
