<template>
  <div>
    <el-pagination
      background
      layout="sizes, prev, pager, next, jumper "
      :total="total"
      @size-change="$emit('size-change', $event)"
      @current-change="$emit('current-change', $event)"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MyPagination',
  props: {
    total: {
      type: Number,
      default: 0,
    },
  },
  emits: ['size-change', 'current-change'],
});
</script>

<style  scoped>
</style>
