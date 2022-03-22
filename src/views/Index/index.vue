<template>
  <div />
</template>

<script>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'IndexU',
  setup() {
    const user = reactive({});
    return {
      user,
    };
  },
});
</script>

<style  scoped>
</style>
