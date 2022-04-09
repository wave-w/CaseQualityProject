<template>
  <el-card shadow class="card">
    <el-form :model="patientData" class="patient_data_from">
      <el-form-item label-width="120px" :label="$t('recordImport.inspectionNum')">
        <el-input v-model="patientData.inspectionNum" />
      </el-form-item>
      <el-form-item label-width="120px" :label="$t('recordImport.patientName')">
        <el-input v-model="patientData.patientName" />
      </el-form-item>
      <el-form-item label-width="120px" :label="$t('recordImport.patientSex')">
        <el-input v-model="patientData.patientSex" />
      </el-form-item>
      <el-form-item label-width="120px" :label="$t('recordImport.hospital')">
        <el-input v-model="patientData.hospital" />
      </el-form-item>
      <el-form-item label-width="120px" :label="$t('recordImport.nationality')">
        <el-input v-model="patientData.nationality" />
      </el-form-item>
      <el-form-item label-width="120px" :label="$t('recordImport.nation')">
        <el-input v-model="patientData.nation" />
      </el-form-item>
      <el-form-item label-width="120px" :label="$t('recordImport.nativePlace')">
        <el-cascader
          v-model="patientData.nativePlace"
          :options="chainRegions"
          :props="{
            value: 'name',
            label: 'name'
          }"
        />
      </el-form-item>
      <el-form-item label-width="120px" :label="$t('recordImport.inspectionDoctor')">
        <el-input v-model="patientData.inspectionDoctor" />
      </el-form-item>
      <el-form-item label-width="120px" :label="$t('recordImport.inspectionDate')">
        <el-date-picker
          v-model="patientData.inspectionDate"
          type="datetime"
          value-format="x"
          placeholder="请选择检查时间"
        />
      </el-form-item>
      <el-form-item label-width="120px" :label="$t('recordImport.patientBirthDate')">
        <el-date-picker
          v-model="patientData.patientBirthDate"
          type="date"
          value-format="x"
          placeholder="请选择出生日期"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { getChainRegions } from '../../api/recordImport';

export default defineComponent({
  name: 'RecordImport',
  setup() {
    const patientData = reactive({
      inspectionNum: '',
      patientName: '',
      patientSex: '',
      hospital: '',
      nationality: '',
      nation: '',
      inspectionDoctor: '',
      inspectionDate: '',
      patientBirthDate: '',
      nativePlace: '',
    });
    const chainRegions = ref([]);
    function toGetChainRegions() {
      getChainRegions().then((res) => {
        chainRegions.value = res.data;
      });
    }
    toGetChainRegions();
    return {
      patientData, chainRegions,
    };
  },
});
</script>

<style lang="scss" scoped>
.card {
  margin: 30px;
  padding: 50px 0;
  .patient_data_from {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 700px;
    margin: auto;
    :deep(.el-input__inner) {
      height: 35px;
    }
}
}
</style>
