<template>
  <div>
    <case-list
      :patient-list-data="patientListData.list"
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
  defineComponent, onMounted, reactive, ref,
} from 'vue';
import { useRouter } from 'vue-router';
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

    const patientListData = reactive({});
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
        formatDate(res.data.data[0].patientBirthDate);
        patientListData.list = res.data.data.map((item) => ({
          ...item,
          patientBirthDate: formatDate(item.patientBirthDate),
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
