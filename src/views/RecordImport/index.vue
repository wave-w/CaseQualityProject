<template>
  <el-card shadow class="card">
    <el-form
      ref="fromRef"
      :model="patientData"
      :rules="rules"
      label-width="120px"
      class="patient_data_from"
    >
      <el-form-item prop="inspectionNum" :label="$t('recordImport.inspectionNum')">
        <el-input v-model="patientData.inspectionNum" />
      </el-form-item>
      <el-form-item prop="patientName" :label="$t('recordImport.patientName')">
        <el-input v-model="patientData.patientName" />
      </el-form-item>
      <el-form-item prop="patientSex" :label="$t('recordImport.patientSex')">
        <el-select
          v-model="patientData.patientSex"
          :placeholder="$t('recordImport.enterPatientSex')"
          size="large"
        >
          <el-option
            v-for="item in sexOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="hospital" :label="$t('recordImport.hospital')">
        <el-input v-model="patientData.hospital" />
      </el-form-item>
      <el-form-item prop="inspectionDoctor" :label="$t('recordImport.inspectionDoctor')">
        <el-input v-model="patientData.inspectionDoctor" />
      </el-form-item>
      <el-form-item prop="nation" :label="$t('recordImport.nation')">
        <el-input v-model="patientData.nation" />
      </el-form-item>
      <el-form-item prop="nationality" :label="$t('recordImport.nationality')">
        <el-select
          v-model="patientData.nationality"
          filterable
          size="large"
          :placeholder="$t('recordImport.enterNationality')"
        >
          <el-option
            v-for="item in countries"
            :key="item.code"
            :label="item.country_name"
            :value="item.country_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="nativePlace" :label="$t('recordImport.nativePlace')">
        <el-cascader
          v-model="patientData.nativePlace"
          :options="chainRegions"
          filterable
          clearable
          :placeholder="$t('recordImport.enterNativePlace')"
          :props="{
            value: 'name',
            label: 'name'
          }"
        />
      </el-form-item>
      <el-form-item prop="inspectionDate" :label="$t('recordImport.inspectionDate')">
        <el-date-picker
          v-model="patientData.inspectionDate"
          type="datetime"
          value-format="x"
          :disabled-date="disabledDate"
          :placeholder="$t('recordImport.enterInspectionDate')"
        />
      </el-form-item>
      <el-form-item prop="patientBirthDate" :label="$t('recordImport.patientBirthDate')">
        <el-date-picker
          v-model="patientData.patientBirthDate"
          type="date"
          value-format="x"
          :disabled-date="disabledDate"
          :placeholder="$t('recordImport.enterPatientBirthDate')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="OpenRecordImport">
          {{ $t('recordImport.importImage') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="50%"
    destroy-on-close
    :before-close="beforeClose"
  >
    <el-upload
      ref="imageUploadRef"
      class="upload"
      drag
      accept="image/*,.dicom"
      action="http://localhost:8080/imageupload"
      multiple
      :data="{inspectionNum:patientData.inspectionNum}"
      :auto-upload="false"
      :on-error="uploadError"
      :file-list="fileList"
      :on-change="fileChange"
      :on-remove="fileRemove"
    >
      <div class="iconfont icon-weibiaoti1" />
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :disabled="isDisabledUoload" @click="recordImport">
          {{ $t('recordImport.upload') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { getChainRegions, addRecord } from '../../api/recordImport';

export default defineComponent({
  name: 'RecordImport',
  setup() {
    const { t } = useI18n();
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
      nativePlace: [],
    });
    const chainRegions = ref([]);
    const countries = ref([]);
    const fileList = ref([]);
    const fromRef = ref();
    const imageUploadRef = ref();
    const dialogVisible = ref(false);
    const isDisabledUoload = ref(false);
    const rules = {
      inspectionNum: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
      ],
      patientName: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
      ],
      patientSex: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
      ],
      hospital: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
      ],
      nationality: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
      ],
      nation: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
      ],
      inspectionDoctor: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
      ],
      inspectionDate: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
      ],
      patientBirthDate: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
      ],
      nativePlace: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
      ],
    };
    const sexOptions = [
      {
        value: 'man',
        label: t('global.man'),
      },
      {
        value: 'feman',
        label: t('global.feman'),
      },
      {
        value: 'unknow',
        label: t('global.unknow'),
      }];

    const toGetRegions = () => {
      getChainRegions().then((res) => {
        chainRegions.value = res.data.china_regions;
        countries.value = res.data.countries;
      });
    };
    const OpenRecordImport = () => {
      fromRef.value.validate((isValid) => {
        if (!isValid) {
          return;
        }
        dialogVisible.value = true;
      });
    };
    const disabledDate = (date) => (Date.now() < new Date(date).getTime());
    const uploadError = () => {
      dialogVisible.value = false;
      isDisabledUoload.value = false;
      ElMessage({
        message: t('recordImport.uploadError'),
        type: 'error',
      });
    };
    const uploadImage = () => {
      const formData = new FormData(); //  用FormData存放上传文件
      fileList.value.forEach((file) => {
        formData.append('file', file.raw);
      });
      axios({
        url: 'http://localhost:8080/imageupload',
        method: 'POST',
        data: formData,
        params: {
          inspectionNum: patientData.inspectionNum,
        },
      }).then((res) => {
        if (res.data.success) {
          addRecord(patientData).then((data) => {
            if (data.data.success) {
              dialogVisible.value = false;
              isDisabledUoload.value = false;
              fromRef.value.resetFields();
              ElMessage({
                message: t('recordImport.uploadSuccess'),
                type: 'success',
              });
            }
          });
        }
      });
    };
    const recordImport = () => {
      isDisabledUoload.value = true;
      uploadImage();
    };
    const fileChange = (uploadFile, uploadFiles) => {
      fileList.value = uploadFiles;
    };
    const fileRemove = (uploadFile, uploadFiles) => {
      fileList.value = uploadFiles;
    };

    const beforeClose = (done) => {
      fileList.value = [];
      done();
    };
    toGetRegions();

    return {
      patientData,
      chainRegions,
      dialogVisible,
      countries,
      rules,
      fromRef,
      imageUploadRef,
      sexOptions,
      isDisabledUoload,
      fileList,
      recordImport,
      disabledDate,
      OpenRecordImport,
      uploadError,
      fileChange,
      fileRemove,
      uploadImage,
      beforeClose,
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
    justify-content: space-around;
    flex-wrap: wrap;
    width: 700px;
    margin: auto;
    :deep(.el-input__inner) {
      height: 35px;
    }
  }
}
.upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon-weibiaoti1 {
  margin: 40px 0;
  font-size: 50px;
}
</style>
