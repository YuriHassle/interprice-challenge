<template>
  <div class="container">
    <HomePage />
  </div>
</template>

<script>
import Vue from 'vue';
import HomePage from './pages/HomePage.vue';

export default Vue.extend({
  components: {
    HomePage,
  },
});
</script>

<style lang="scss" scoped>
.container {
  padding-block: 1.5rem;
}
</style>
