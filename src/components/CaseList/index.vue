<template>
  <div>
    <el-card shadow class="card">
      <div class="Top">
        <my-table
          :table-column="tableColumn"
          :table-data="patientListData"
          @row-click="$emit('to-detail', $event)"
          @sort-change="$emit('sort-change', $event)"
        />
      </div>
      <div class="bottom">
        <el-input v-model="searchName" placeholder="请输入姓名搜索">
          <template #append>
            <el-button
              class="iconfont icon-sousuo"
              @click="$emit('screen', searchName )"
            />
          </template>
        </el-input>
        <my-pagination
          :total="total"
          @current-change="$emit('current-change', $event)"
          @size-change="$emit('size-change', $event)"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MyTable from '../MyTable/index.vue';
import MyPagination from '../MyPagination/index.vue';

export default defineComponent({
  name: 'CaseList',
  components: { MyTable, MyPagination },
  props: {
    patientListData: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  emits: ['to-detail', 'sort-change', 'current-change', 'size-change', 'screen'],
  setup() {
    const { t } = useI18n();

    const searchName = ref('');
    const tableColumn = reactive([
      {
        prop: 'inspectionNum',
        label: t('caseList.inspectionNum'),
      },
      {
        prop: 'patientName',
        label: t('caseList.patientName'),
        width: '100px',
      },
      {
        prop: 'patientSex',
        label: t('caseList.patientSex'),
        width: '100px',
      },
      {
        prop: 'patientAge',
        label: t('caseList.patientAge'),
        width: '100px',
        isSortable: true,
      },
      {
        prop: 'nationality',
        label: t('caseList.nationality'),
        width: '100px',
      },
      {
        prop: 'nation',
        label: t('caseList.nation'),
        width: '100px',
      },

      {
        prop: 'inspectionDoctor',
        label: t('caseList.inspectionDoctor'),
        width: '100px',
      },
      {
        prop: 'inspectionDate',
        label: t('caseList.inspectionDate'),
        isSortable: true,
      },
      {
        prop: 'patientBirthDate',
        label: t('caseList.patientBirthDate'),
      },
      {
        prop: 'nativePlace',
        label: t('caseList.nativePlace'),
      },
    ]);
    return {
      tableColumn, searchName,
    };
  },
});
</script>

<style lang="scss" scoped>
.card {
  height: 85vh;
  margin: 20px;
  :deep(.el-card__body){
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 80vh;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .el-input{
      width: 300px;
      :deep(.el-input__inner) {
        height: 35px;
        border: 1px solid #409EFF;
      }
      :deep(.el-input-group__append) {
        background-color: #409EFF;
        border: 1px solid #409EFF;
        color: #fff;
      }
      .icon-sousuo {
        font-size: 20px;
      }
    }
  }
}
</style>
