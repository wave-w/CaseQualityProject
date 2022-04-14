<template>
  <div>
    <el-card shadow class="card">
      <el-descriptions
        :column="2"
      >
        <el-descriptions-item
          v-for="item of patientTitle"
          :key="item.prop"
          :label="`${item.label}:`"
          :span="item.span"
        >
          {{ patientData[item.prop] }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getDiagnosedPatientDetail } from '../../api/patientList/index';
import formatDate from '../../utils/formatDate';

export default defineComponent({
  name: 'PatientDetail',
  setup() {
    const route = useRoute();
    const { t } = useI18n();

    const patientTitle = ref([
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
      {
        prop: 'ultrasonic_diagnosis',
        label: t('caseList.ultrasonic_diagnosis'),
        span: 2,
      },
      {
        prop: 'ultrasonic_findings',
        label: t('caseList.ultrasonic_findings'),
        span: 2,
      },

    ]);
    const patientData = ref({});
    function toGetDiagnosedPatientDetail() {
      getDiagnosedPatientDetail(route.query.id).then((res) => {
        console.log(res);
        patientData.value = {
          ...res.data,
          patientSex: res.data.patientSex === 'man' ? t('global.man') : t('global.feman'),
          patientBirthDate: formatDate(res.data.patientBirthDate).slice(0, 10),
          inspectionDate: formatDate(res.data.inspectionDate),
        };
      });
    }
    onMounted(() => {
      toGetDiagnosedPatientDetail();
    });

    return {
      patientTitle, patientData,
    };
  },
});
</script>

<style lang="scss"  scoped>
.card {
  margin: 20px;
}
</style>
