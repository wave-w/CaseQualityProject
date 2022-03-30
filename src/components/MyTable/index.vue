<template>
  <div>
    <el-table
      :data="tableData"
      max-height="650"
      @row-dblclick="$emit('row-click', $event)"
      @sort-change="$emit('sort-change', $event)"
    >
      <el-table-column type="index" align="center" />
      <el-table-column
        v-for="(cloumn, index) in tableColumn "
        :key="index"
        :prop="cloumn.prop"
        :label="cloumn.label"
        :width="cloumn.width"
        :sortable="cloumn.isSortable"
        align="center"
      />
    </el-table>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MyTable',
  props: {
    tableColumn: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['row-click', 'sort-change'],
});
</script>

<style  scoped>
</style>
