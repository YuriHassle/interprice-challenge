<template>
  <div>
    <ButtonAtom label="USD" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ButtonAtom from '../components/atoms/ButtonAtom.vue';

export default Vue.extend({
  components: {
    ButtonAtom,
  },
});
</script>

<style lang="scss" scoped></style>
