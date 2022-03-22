<template>
  <div>
    <el-card shadow class="card">
      <el-descriptions
        :column="3"
        border
      >
        <el-descriptions-item
          align="center"
          label-align="center"
        >
          {{ 111111 }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getDiagnosedPatientDetail } from '../../api/patientList/index';

export default defineComponent({
  name: 'PatientDetail',
  setup() {
    const route = useRoute();
    function toGetDiagnosedPatientDetail() {
      getDiagnosedPatientDetail(route.query.id).then((res) => {
        console.log(res);
      });
    }
    onMounted(() => {
      toGetDiagnosedPatientDetail();
    });
  },
});
</script>

<style lang="scss"  scoped>
.card {
  margin: 20px;
}
</style>
