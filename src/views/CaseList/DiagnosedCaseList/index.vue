<template>
  <div>
    <case-list
      :patient-list-data="patientListData"
      :total="total"
      @to-detail="toDetail"
      @sort-change="sortChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @screen="screen"
    />
  </div>
</template>

<script>
import {
  defineComponent, onMounted, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import caseList from '../../../components/CaseList/index.vue';
import { getDiagnosedCaseList } from '../../../api/patientList/index';
import formatDate from '../../../utils/formatDate';

export default defineComponent({
  name: 'DiagnosedCaseList',
  components: {
    caseList,
  },
  setup() {
    const router = useRouter();
    const { t } = useI18n();
    const patientListData = ref([]);
    const total = ref(0);
    const diagnosedCaseListParams = {
      name: '',
      pageNum: '1',
      pageSize: '10',
      ageSort: 'ascending',
      dateSort: 'ascending',
    };

    function getList() {
      getDiagnosedCaseList(
        diagnosedCaseListParams.name,
        diagnosedCaseListParams.pageNum,
        diagnosedCaseListParams.pageSize,
        diagnosedCaseListParams.ageSort,
        diagnosedCaseListParams.dateSort,
      ).then((res) => {
        patientListData.value = res.data.data.map((item) => ({
          ...item,
          patientSex: item.patientSex === 'man' ? t('global.man') : t('global.feman'),
          patientBirthDate: formatDate(item.patientBirthDate).slice(0, 10),
          inspectionDate: formatDate(item.inspectionDate),
        }));
        total.value = res.data.total;
      });
    }

    onMounted(() => {
      getList();
    });

    function toDetail(row) {
      router.push({
        name: 'patientDetail',
        query: {
          id: row.inspectionNum,
        },
        params: {
          type: 'DiagnosedCaseList',
        },
      });
    }
    function currentChange(pageNum) {
      diagnosedCaseListParams.pageNum = pageNum;
      getList();
    }
    function sizeChange(pageSize) {
      diagnosedCaseListParams.pageSize = pageSize;
      getList();
    }
    function sortChange(value) {
      if (value.prop === 'inspectionDate') {
        diagnosedCaseListParams.dateSort = value.order;
        getList();
        return;
      }
      diagnosedCaseListParams.ageSort = value.order;
      getList();
    }
    function screen(searchValue) {
      diagnosedCaseListParams.name = searchValue;
      getList();
    }

    return {
      patientListData,
      total,
      toDetail,
      currentChange,
      sizeChange,
      sortChange,
      screen,
    };
  },
});
</script>

<style  scoped lang='scss'>
</style>
