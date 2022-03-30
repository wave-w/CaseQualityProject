<template>
  <div class="viewer_box">
    <div v-show="isHaveDraw" class="viewer_btn">
      <div
        v-for="btn in basicsTools"
        :key="btn.value"
        @click="chooseToos(btn.function)"
      >
        <i :class="['iconfont', btn.icon]" />
        <span>{{ btn.name }}</span>
      </div>
      <el-dropdown
        trigger="click"
        class="iconfont icon-celiang"
        @command="toolCommand"
        @visible-change="visibleChange"
      >
        <span class="el-dropdown-link">
          {{ standardToolsValue }}
          <i :class="dropMenu ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in standardTools"
              :key="item.value"
              :command="item"
              :disabled="isDisabledTool(item.mode)"
            >
              {{ item.name }}
              <i :class="['iconfont', item.icon]" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div ref="viewer_content" class="viewer_content" />
  </div>
</template>

<script>
import ImageingViewer from '../../utils/ImagingViewer';

export default {
  name: 'ImagingViewer',
  props: {
    imageUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      imageMode: [],
      imageViewer: {},
      dropMenu: false,
      isHaveDraw: false,
      standardToolsValue: this.$t('imagingViewer.measureTools'),
      basicsTools: [
        {
          name: this.$t('imagingViewer.flip'),
          value: 'Flip',
          function: 'flip',
          icon: 'icon-jingxiang',
        },
        {
          name: this.$t('imagingViewer.leftRightFlip'),
          value: 'LeftRightFlip',
          function: 'leftRightFlip',
          icon: 'icon-a-zujian791',
        },
        {
          name: this.$t('imagingViewer.upsideDownFlip'),
          value: 'UpsideDownFlip',
          function: 'upsideDownFlip',
          icon: 'icon-a-zujian781',
        },
        {
          name: this.$t('imagingViewer.clockwiseRotate'),
          value: 'ClockwiseRotate',
          function: 'clockwiseRotate',
          icon: 'icon-a-zujian8211',
        },
        {
          name: this.$t('imagingViewer.antiClockwiseRotate'),
          value: 'AntiClockwiseRotate',
          function: 'antiClockwiseRotate',
          icon: 'icon-a-zujian8311',
        },
        {
          name: this.$t('imagingViewer.clickZoomEnlarge'),
          value: 'ClickZoomEnlarge',
          function: 'zoomEnlarge',
          icon: 'icon-a-zujian771',
        },
        {
          name: this.$t('imagingViewer.zoomNarrow'),
          value: 'ClickZoomNarrow',
          function: 'zoomNarrow',
          icon: 'icon-a-zujian761',
        },
        {
          name: this.$t('imagingViewer.saveToolsState'),
          value: 'save',
          function: 'saveToolsState',
          icon: 'icon-baocun',
        },
        {
          name: this.$t('imagingViewer.resetView'),
          value: 'Reset',
          function: 'resetView',
          icon: 'icon-a-zujian751',
        },
      ],
      standardTools: [
        {
          name: this.$t('imagingViewer.wwwc'),
          value: 'Wwwc',
          function: 'activeWwwcTool',
          icon: 'icon-liangdu',
        },
        {
          name: this.$t('imagingViewer.magnify'),
          value: 'Magnify',
          function: 'activeMagnifyTool',
          icon: 'icon-quanshenjing',
        },
        {
          name: this.$t('imagingViewer.pan'),
          value: 'Pan',
          function: 'activePanTool',
          icon: 'icon-move',
        },
        {
          name: this.$t('imagingViewer.zoom'),
          value: 'Zoom',
          function: 'activeZoomTool',
          icon: 'icon-suofang',
        },
        {
          name: this.$t('imagingViewer.arrowAnnotate'),
          value: 'ArrowAnnotate',
          function: 'arrowAnnotateTool',
          icon: 'icon-biaojidian',
        },
        {
          mode: [1],
          name: this.$t('imagingViewer.length'),
          value: 'Length',
          function: 'activeLengthTool',
          icon: 'icon-gudingchangduhuizhixian',
        },
        {
          name: this.$t('imagingViewer.bidirectional'),
          value: 'Bidirectional',
          function: 'activeBidirectionalTool',
          icon: 'icon-jurassic_data-cross',
        },
        {
          name: this.$t('imagingViewer.angle'),
          value: 'Angle',
          function: 'activeAngleTool',
          icon: 'icon-xuanzhuanjiaodu',
        },
        {
          name: this.$t('imagingViewer.cobbAngle'),
          value: 'CobbAngle',
          function: 'activeCobbAngleTool',
          icon: 'icon-jurassic_nishiz-angle',
        },
        {
          name: this.$t('imagingViewer.probe'),
          value: 'Probe',
          function: 'activeProbeTool',
          icon: 'icon-radiobuttonselect',
        },
        {
          name: this.$t('imagingViewer.ellipticalRoi'),
          value: 'EllipticalRoi',
          function: 'activeEllipticalRoiTool',
          icon: 'icon-xietuoyuan',
        },
        {
          name: this.$t('imagingViewer.rectangleRoi'),
          value: 'RectangleRoi',
          function: 'activeRectangleRoiTool',
          icon: 'icon-juxingxuanze',
        },
        {
          name: this.$t('imagingViewer.freehandRoi'),
          value: 'FreehandRoi',
          function: 'activeFreehandRoiTool',
          icon: 'icon-gangbi',
        },
        {
          mode: [2],
          name: this.$t('imagingViewer.mLength'),
          value: 'MLength',
          function: 'activeMLengthTool',
          icon: 'icon-gudingchangduhuizhixian',
        },
        {
          mode: [2, 3],
          name: this.$t('imagingViewer.time'),
          value: 'Time',
          function: 'activeTimeTool',
          icon: 'icon-shijian',
        },
        {
          mode: [3],
          name: this.$t('imagingViewer.vlocity'),
          value: 'Velocity',
          function: 'activeVelocityTool',
          icon: 'icon-sudu',
        },
        {
          mode: [2, 3],
          name: this.$t('imagingViewer.heartRate'),
          value: 'HeartRate',
          function: 'activeHeartRateTool',
          icon: 'icon-xinshuai',
        },
      ],
    };
  },
  watch: {
    imageUrl: {
      handler() {
        this.$nextTick(() => {
          this.drawImage();
        });
      },
    },
  },
  mounted() {
    this.imageViewer = new ImageingViewer();
    this.imageViewer.init(this.$refs.viewer_content);
    this.drawImage();
  },
  methods: {
    drawImage() {
      this.imageViewer.drawImage(this.imageUrl).then(() => {
        this.isHaveDraw = true;
        this.imageMode = this.imageViewer.getImageMode();
        this.imageViewer.renderToolsState();
      });
    },
    chooseToos(func) {
      if (func === 'arrowAnnotateTool') {
        this.imageViewer[func](() => {
          this.openAnnotateToolinputBox();
        });
        return;
      }

      if (func === 'zoomEnlarge' || func === 'zoomNarrow') {
        this.standardToolsValue = this.$t('imagingViewer.measureTools');
      }
      this.imageViewer[func]();
    },
    toolCommand(tool) {
      this.standardToolsValue = tool.name;
      this.chooseToos(tool.function);
    },
    canvelArrowReleasedText() {
      this.imageViewer.cancelArrowAnnotateTool();
    },
    saveArrowReleasedText(arrowReleasedText) {
      this.imageViewer.setArrowAnnotateText(arrowReleasedText);
    },
    openAnnotateToolinputBox() {
      this.$prompt('请输入备注', '提示', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '备注不能为空',
      }).then(({ value }) => {
        this.saveArrowReleasedText(value);
      }).catch(() => {
        this.canvelArrowReleasedText();
      });
    },
    visibleChange(visible) {
      this.dropMenu = visible;
    },
    isDisabledTool(mode) {
      if (!this.imageMode) {
        return true;
      }
      if (!mode) {
        return false;
      }
      const length = mode.length + this.imageMode.length;
      return length === Array.from(new Set([...mode, ...this.imageMode])).length;
    },
  },
};
</script>

<style scoped lang='scss'>
@import '../../assets/css/image_iconfont.css';
.viewer_box {
  width: 750px;
  height: 650px;
  box-sizing: border-box;
  .viewer_btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 750px;
    height: 50px;
    padding: 0 10px;
    background-color: #000;
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
      cursor: pointer;
      user-select: none;
      span {
        padding: 5px 0;
      }
    }
    :hover {
      color: #409eff;
    }
  }

  .el-dropdown-link {
    font-size: 16px;
  }
  .iconfont {
    padding-top: 5px;
  }
  .viewer_content {
    width: 750Px;
    height: 600Px;
  }
}
</style>

<style lang="scss">
  .el-dropdown-menu {
    max-height: 400px;
    overflow-y: auto;
    .iconfont {
      font-size: 16px;
    }
    .is-disabled {
      color: #d3d3d3 !important;
    }
  }
</style>
