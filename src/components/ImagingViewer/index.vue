<template>
  <div class="main">
    <div
      ref="imageBox"
      v-loading="!isHasDraw"
      class="iamge_box"
    />
    <div class="switch_box">
      <span
        :class="[
          'iconfont icon-bofang last_btn',
          isHasPreviousImage ? '' : 'disabled_class']"
        @click="$emit('toLastImage')"
      />
      <span
        :class="[
          'iconfont icon-bofang',
          isHasNextImage ? '' : 'disabled_class'
        ]"
        @click="$emit('toNextImage')"
      />
    </div>
    <div v-show="isHasDraw" class="btn_list">
      <div
        v-for="item in MeasureTools.basicsTools"
        :key="item.value"
      >
        <div
          v-if="!item.children"
          :class="[activeTool === item.function ? 'activeClass' : '',
                   isDisabledTool(item.mode) ? 'disabled_class' : '',
                   'iconfont', item.icon]"
          @click="chooseTool(item.function)"
        >
          {{ item.name }}
        </div>
        <div v-else>
          <el-dropdown
            trigger="click"
            @command="chooseTool($event)"
            @visible-change="dropVisibleChange"
          >
            <div class="el-dropdown-link">
              <div :class="['iconfont', item.icon]" />
              <div class="el_link_text">
                <span>{{ item.name }}</span>
                <span v-show="!isDroped" class="iconfont icon-xiangxiajiantou1" />
                <span v-show="isDroped" class="iconfont icon-xiangshang_jiantou" />
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="btn in item.children"
                  :key="btn.vlaue"
                  :command="btn.function"
                >
                  {{ btn.name }}
                  <span :class="['iconfont', btn.icon]" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div
        class="iconfont icon-a-zujian751"
        @click="resetView"
      >
        重置
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent, onMounted, ref, watch,
} from 'vue';
import { ElMessageBox } from 'element-plus';
import ImagingViewer from '../../assets/js/ImagingViewer';
import MeasureTools from '../../assets/js/MeasureTools';

export default defineComponent({
  name: 'ImagingViewer',
  props: {
    imageUrl: {
      type: String,
      default: '',
    },
    isHasPreviousImage: {
      type: Boolean,
      default: false,
    },
    isHasNextImage: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['toLastImage', 'toNextImage'],
  setup(props) {
    const imagingViewer = new ImagingViewer();
    const imageBox = ref(null);
    const imageMode = ref([]);
    const activeTool = ref('');
    const isHasDraw = ref(false);
    const isDroped = ref(false);

    const drawImage = (imageId) => {
      imagingViewer.drawImage(imageId).then(() => {
        imageMode.value = imagingViewer.getImageMode();
        isHasDraw.value = true;
      });
    };
    const openAnnotateToolinputBox = (text) => {
      ElMessageBox.prompt('备注', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputValue: text,
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '不能保存备注为空!',
      }).then(({ value }) => {
        imagingViewer.setArrowAnnotateText(value);
      }).catch(() => {
        imagingViewer.cancelArrowAnnotateTool();
      });
    };
    const chooseTool = (func) => {
      if (!func) {
        return;
      }
      activeTool.value = func;
      if (func === 'arrowAnnotateTool') {
        imagingViewer[func]((text) => {
          openAnnotateToolinputBox(text);
        });
        return;
      }
      imagingViewer[func]();
    };
    const resetView = () => {
      imagingViewer.resetView();
    };
    const isDisabledTool = (mode) => {
      if (!mode) {
        return false;
      }
      const length = mode.length + imageMode.value.length;
      return length === Array.from(new Set([...mode, ...imageMode.value])).length;
    };
    const dropVisibleChange = (isDrop) => {
      isDroped.value = isDrop;
    };

    onMounted(() => {
      imagingViewer.init(imageBox.value);
    });

    watch(() => props.imageUrl, (val) => {
      if (val) {
        drawImage(val);
      }
    }, {
      immediate: true,
    });

    return {
      imageBox,
      MeasureTools,
      activeTool,
      isHasDraw,
      isDroped,
      chooseTool,
      resetView,
      isDisabledTool,
      dropVisibleChange,
    };
  },
});
</script>

<style scoped lang='scss'>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 750px;
  width: 1000px;
  background: #000;
  .iamge_box {
    height: 700px;
    width: 800px;
  }
  .switch_box {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    bottom: 100px;
    span {
      font-size: 35px;
      cursor: pointer;
      margin: 0 10px;
      color: #fff;
    }
    .last_btn {
      transform: rotateY(180deg);
    }
    span:hover {
      color: #409eff;
    }
  }
  .btn_list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    padding: 0 10px;
    color: #fff;
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 50px;
      justify-content: space-around;
      cursor: pointer;
    }
    div:hover {
      color: #409eff;
    }
    :deep(.el-dropdown-link) {
      color: #fff;
      font-size: 16px;
      .el_link_text {
        display: flex;
        flex-direction: row;
        padding: 2px 0;
        span {
          padding: 0 2px;
        }
      }
    }
  }
  .activeClass {
      color: #409eff !important;
    }
  .disabled_class {
      pointer-events: none;
      color: #7b7b7b !important;
    }
}
</style>
