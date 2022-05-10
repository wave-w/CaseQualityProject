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
          <span v-if="!item.isImagelist">
            <el-input
              v-if="item.editable"
              v-model="ultrasonicInfo[item.prop]"
              type="textarea"
              resize="none"
              :autosize="{
                minRows: 1, maxRows: 6
              }"
              @blur="saveText(item.prop)"
            />
            <span v-else>{{ patientData[item.prop] }}</span>
          </span>
          <div v-else class="image_list">
            <div
              v-for="(imageUrl, index) in patientData[item.prop]"
              :key="index"
              class="image_box"
              @dblclick="showImagingViewer(index)"
            >
              <img :src="imageUrl">
              <div>{{ $t('caseList.ultrasonic_image') }}{{ index + 1 }}</div>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <image-viewer-dialog
      v-if="imageDialogVisible"
      :image-list="patientData.image_list"
      :active-index="activeIndex"
      class="image_dialog"
      @image-dialog-close="imageDialogClose"
    />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getDiagnosedPatientDetail } from '../../api/patientList/index';
import formatDate from '../../utils/formatDate';
import ImageViewerDialog from '../../components/ImageViewerDialog/index.vue';

export default defineComponent({
  name: 'PatientDetail',
  components: { ImageViewerDialog },
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
        prop: 'image_list',
        label: t('caseList.image_list'),
        isImagelist: true,
        span: 2,
      },
      {
        prop: 'ultrasonic_diagnosis',
        label: t('caseList.ultrasonic_diagnosis'),
        span: 2,
        editable: true,
      },
      {
        prop: 'ultrasonic_findings',
        label: t('caseList.ultrasonic_findings'),
        span: 2,
        editable: true,
      },
    ]);
    const patientData = ref({});
    const ultrasonicInfo = ref({
      ultrasonic_diagnosis: '',
      ultrasonic_findings: '',
    });
    const imageDialogVisible = ref(false);
    const activeIndex = ref(-1);

    const toGetDiagnosedPatientDetail = () => {
      getDiagnosedPatientDetail(route.params.id, route.params.type).then((res) => {
        patientData.value = {
          ...res.data,
          patientSex: res.data.patientSex === 'man' ? t('global.man') : t('global.feman'),
          patientBirthDate: formatDate(res.data.patientBirthDate).slice(0, 10),
          inspectionDate: formatDate(res.data.inspectionDate),
        };
        ultrasonicInfo.value = {
          ultrasonic_diagnosis: res.data.ultrasonic_diagnosis.replace(/[\s*,\r\n]/g, ''),
          ultrasonic_findings: res.data.ultrasonic_findings.replace(/[\s*,\r\n]/g, ''),
        };
      });
    };
    const showImagingViewer = (index) => {
      activeIndex.value = index;
      imageDialogVisible.value = true;
    };
    const imageDialogClose = () => {
      imageDialogVisible.value = false;
    };
    const saveText = (props) => {
      console.log(props);
      console.log(ultrasonicInfo.value);
    };

    onMounted(() => {
      toGetDiagnosedPatientDetail();
    });

    return {
      patientTitle,
      patientData,
      imageDialogVisible,
      activeIndex,
      ultrasonicInfo,
      showImagingViewer,
      imageDialogClose,
      saveText,
    };
  },
});
</script>

<style lang="scss"  scoped>
.card {
  margin: 20px;
  .image_list {
    display: flex;
    overflow: hidden;
    overflow-y: auto;
    flex-wrap: wrap;
    max-height: 300px;
    max-width: 1260px;
    margin: 10px 20px;
    border: 1px solid #eee;
    .image_box {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 210px;
      width: 200px;
      padding: 10px 5px;
      cursor: pointer;
      img {
        height: 200px;
        width: 200px;
      }
    }
    .image_box:hover {
        background: #66a6ff;
      }
  }
  .image_list::-webkit-scrollbar { display: none; }
}
.image_dialog {
  position: absolute;
  z-index: 99;
  top: 100px;
}
</style>
