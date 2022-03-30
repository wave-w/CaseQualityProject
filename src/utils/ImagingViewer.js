import _ from 'lodash';
import Hammer from 'hammerjs';
import dicomParser from 'dicom-parser';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneWEBImageLoader from 'cornerstone-web-image-loader';
import cornerstoneBase64ImageLoader from 'cornerstone-base64-image-loader';

// 添加超声测量相关工具
import TimeTool from '../TimeMeasurement';
import VelocityTool from '../VelocityMeasurement';
import HeartRateTool from '../HeartRateMeasurement';

// 直线距离
import LengthTool from '../LengthMeasurement';

// 直线距离(M模式下)
import MLengthTool from '../MLengthMeasurement';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWEBImageLoader.external.cornerstone = cornerstone;
cornerstoneBase64ImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

function metaDataProvider(type, imageId) {
  const parsedImageId = cornerstoneWADOImageLoader.wadouri.parseImageId(imageId);
  if (parsedImageId.scheme !== 'wadouri') {
    return {};
  }

  const dataSet = cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.get(
    parsedImageId.url,
  );
  if (type === 'imagePlaneModule') {
    const imageOrientationPatient = cornerstoneWADOImageLoader.wadouri.metaData.getNumberValues(
      dataSet,
      'x00200037',
      6,
    );
    const imagePositionPatient = cornerstoneWADOImageLoader.wadouri.metaData.getNumberValues(
      dataSet,
      'x00200032',
      3,
    );
    const imagePixelSpacing = cornerstoneWADOImageLoader.wadouri.metaData.getNumberValues(
      dataSet,
      'x00280030',
      2,
    );
    let pixelSpacing = [];
    let rowPixelSpacing = null;
    let columnPixelSpacing = null;
    let ultrasonicX = null;
    let ultrasonicY = null;
    let ultrasonicStartX = null;
    let ultrasonicStartY = null;
    let ultrasonicEndX = null;
    let ultrasonicEndY = null;
    let uSRegionCalibrationStartX = null;
    let uSRegionCalibrationStartY = null;
    let uSRegionCalibrationEndX = null;
    let uSRegionCalibrationEndY = null;
    if (dataSet.elements.x00186011) {
      const uSRegionCalibrationModule = dataSet.elements.x00186011.items[0].dataSet;
      // 将图像中标准量*10的原因为cornerstone中测量出来的单位是mm在超声图像中默认单位为cm所以需要*10来进行单位转换即mm -> cm
      rowPixelSpacing = uSRegionCalibrationModule.double('x0018602c') * 10;
      columnPixelSpacing = uSRegionCalibrationModule.double('x0018602e') * 10;

      uSRegionCalibrationStartX = uSRegionCalibrationModule.uint16('x00186018');
      uSRegionCalibrationStartY = uSRegionCalibrationModule.uint16('x0018601a');
      uSRegionCalibrationEndX = uSRegionCalibrationModule.uint16('x0018601c');
      uSRegionCalibrationEndY = uSRegionCalibrationModule.uint16('x0018601e');
      const ultrasonicModule = dataSet.elements.x00186011.items[1].dataSet;
      if (ultrasonicModule) {
        ultrasonicX = ultrasonicModule.double('x0018602c');
        ultrasonicY = ultrasonicModule.double('x0018602e');
        ultrasonicStartX = ultrasonicModule.uint16('x00186018');
        ultrasonicStartY = ultrasonicModule.uint16('x0018601a');
        ultrasonicEndX = ultrasonicModule.uint16('x0018601c');
        ultrasonicEndY = ultrasonicModule.uint16('x0018601e');
      }
    } else if (imagePixelSpacing) {
      rowPixelSpacing = imagePixelSpacing[0];
      columnPixelSpacing = imagePixelSpacing[1];
    }

    let rowCosines = null;
    let columnCosines = null;
    if (imageOrientationPatient) {
      rowCosines = [
        parseFloat(imageOrientationPatient[0]),
        parseFloat(imageOrientationPatient[1]),
        parseFloat(imageOrientationPatient[2]),
      ];
      columnCosines = [
        parseFloat(imageOrientationPatient[3]),
        parseFloat(imageOrientationPatient[4]),
        parseFloat(imageOrientationPatient[5]),
      ];
    }
    pixelSpacing = [rowPixelSpacing, columnPixelSpacing];
    return {
      frameOfReferenceUID: dataSet.string('x00200052'),
      rows: dataSet.uint16('x00280010'),
      columns: dataSet.uint16('x00280011'),
      imageOrientationPatient,
      rowCosines,
      columnCosines,
      imagePositionPatient,
      sliceThickness: dataSet.floatString('x00180050'),
      sliceLocation: dataSet.floatString('x00201041'),
      pixelSpacing,
      rowPixelSpacing,
      columnPixelSpacing,
      ultrasonicX,
      ultrasonicY,
      ultrasonicStartX,
      ultrasonicStartY,
      ultrasonicEndX,
      ultrasonicEndY,
      uSRegionCalibrationStartX,
      uSRegionCalibrationStartY,
      uSRegionCalibrationEndX,
      uSRegionCalibrationEndY,
    };
  }
  return undefined;
}

function getImageUrl(imageId) {
  if (
    imageId
    && imageId.substr(imageId.length - 3) === 'dcm'
  ) {
    return `wadouri:${imageId}`;
  }

  if (imageId.indexOf('data:image') > -1) {
    return `base64://${imageId.substr(imageId.indexOf(',') + 1)}`;
  }
  return imageId;
}

function getViewportOption(option) {
  return option || {
    invert: false,
    pixelReplication: false,
    scale: 1,
    translation: {
      x: 0,
      y: 0,
    },
    hflip: false,
    vflip: false,
    rotation: 0,
    labelmap: false,
  };
}

cornerstone.metaData.addProvider(metaDataProvider, 99);

export default class ImagingViewer {
  constructor() {
    this.viewportDefault = {};
    this.isToolsInitialized = false;
    this.isModify = false;
    this.lastToolName = '';
    this.htmlElement = null;
    this.imageId = '';
    ImagingViewer.prototype.onArrowReleased = () => {};
    ImagingViewer.prototype.onArrowAnnotateTextChanged = () => {};
  }

  init = (element) => {
    this.initTools();
    this.enableElement(element);
  };

  enableElement = (element) => {
    cornerstone.enable(element, {
      renderer: 'webgl',
    });

    this.htmlElement = element;
  };

  drawImage = (imageId, viewportOption) => new Promise((resolve) => {
    this.imageId = getImageUrl(imageId);
    cornerstone.loadImage(getImageUrl(imageId)).then((image) => {
      const viewport = getViewportOption(viewportOption);
      cornerstone.setDefaultViewport(viewport);

      const enabledElement = cornerstone.getEnabledElement(this.htmlElement);
      if (enabledElement.viewport) {
        delete enabledElement.viewport;
      }

      cornerstone.displayImage(this.htmlElement, image);

      this.viewportDefault = _.cloneDeep(enabledElement.viewport);
      resolve();
    });
  });

  initTools = () => {
    cornerstoneTools.init({
      globalToolSyncEnabled: true,
    });

    const { WwwcTool } = cornerstoneTools;
    const { PanTool } = cornerstoneTools;
    const { ZoomTool } = cornerstoneTools;
    // const { LengthTool } = cornerstoneTools;
    const { AngleTool } = cornerstoneTools;
    const { ArrowAnnotateTool } = cornerstoneTools;
    const { MagnifyTool } = cornerstoneTools;
    const { CircleScissorsTool } = cornerstoneTools;
    const { FreehandRoiTool } = cornerstoneTools;
    const { ProbeTool } = cornerstoneTools;
    const { RectangleRoiTool } = cornerstoneTools;
    const { CobbAngleTool } = cornerstoneTools;
    const { BidirectionalTool } = cornerstoneTools;
    const { EllipticalRoiTool } = cornerstoneTools;
    const { BrushTool } = cornerstoneTools;

    // Add them
    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.addTool(ZoomTool);
    cornerstoneTools.addTool(WwwcTool);
    cornerstoneTools.addTool(LengthTool);
    cornerstoneTools.addTool(AngleTool);
    cornerstoneTools.addTool(ArrowAnnotateTool, {
      configuration: {
        getTextCallback: this.handleArrowReleased,
        changeTextCallback: this.modifyArrowAnnotateText,
      },
    });
    cornerstoneTools.addTool(MagnifyTool);
    cornerstoneTools.addTool(CircleScissorsTool);
    cornerstoneTools.addTool(ProbeTool);
    cornerstoneTools.addTool(FreehandRoiTool);
    cornerstoneTools.addTool(RectangleRoiTool);
    cornerstoneTools.addTool(CobbAngleTool);
    cornerstoneTools.addTool(BidirectionalTool);
    cornerstoneTools.addTool(EllipticalRoiTool);
    cornerstoneTools.addTool(BrushTool);

    // Add ultrasonic
    cornerstoneTools.addTool(TimeTool);
    cornerstoneTools.addTool(VelocityTool);
    cornerstoneTools.addTool(HeartRateTool);

    cornerstoneTools.addTool(MLengthTool);

    this.isToolsInitialized = true;
  };

  cancelArrowAnnotateTool = () => {
    if (this.isModify) {
      return;
    }

    const toolData = cornerstoneTools.getToolState(this.htmlElement, 'ArrowAnnotate');
    toolData.data.pop();

    const viewport = cornerstone.getViewport(this.htmlElement);
    cornerstone.setViewport(this.htmlElement, viewport);
  };

  handleArrowReleased = (doneChangingTextCallback) => {
    this.isModify = false;
    // 注入文字编辑写入事件
    this.onArrowAnnotateTextChanged = doneChangingTextCallback;
    this.onArrowReleased();
  };

  setArrowAnnotateText(value) {
    this.onArrowAnnotateTextChanged(value);
  }

  modifyArrowAnnotateText = (data, eventData, doneChangingTextCallback) => {
    this.isModify = true;
    this.onArrowAnnotateTextChanged = doneChangingTextCallback;
    this.onArrowReleased();
  };

  // 箭头文字
  arrowAnnotateTool = (callback) => {
    this.setToolActive('ArrowAnnotate');
    // 注入鼠标释放回调事件
    this.onArrowReleased = callback;
  };

  // 上下翻转
  upsideDownFlip = () => {
    const viewport = cornerstone.getViewport(this.htmlElement);
    viewport.scale = _.cloneDeep(this.viewportDefault.scale);

    if (viewport.rotation === 90 || viewport.rotation === 270) {
      viewport.hflip = !viewport.hflip;
      cornerstone.setViewport(this.htmlElement, viewport);
      return;
    }

    viewport.vflip = !viewport.vflip;
    cornerstone.setViewport(this.htmlElement, viewport);
  };

  // 左右翻转
  leftRightFlip() {
    const viewport = cornerstone.getViewport(this.htmlElement);
    viewport.scale = _.cloneDeep(this.viewportDefault.scale);

    if (viewport.rotation === 90 || viewport.rotation === 270) {
      viewport.vflip = !viewport.vflip;
      cornerstone.setViewport(this.htmlElement, viewport);
      return;
    }

    viewport.hflip = !viewport.hflip;
    cornerstone.setViewport(this.htmlElement, viewport);
  }

  // 翻转
  flip = () => {
    const viewport = cornerstone.getViewport(this.htmlElement);
    viewport.invert = !viewport.invert;
    cornerstone.setViewport(this.htmlElement, viewport);
  };

  // 正时针旋转
  clockwiseRotate = () => {
    const viewport = cornerstone.getViewport(this.htmlElement);
    viewport.rotation += 90;
    cornerstone.setViewport(this.htmlElement, viewport);
  };

  // 逆时针旋转
  antiClockwiseRotate = () => {
    const viewport = cornerstone.getViewport(this.htmlElement);
    viewport.rotation -= 90;
    cornerstone.setViewport(this.htmlElement, viewport);
  };

  // 点击放大
  zoomEnlarge = () => {
    const viewport = cornerstone.getViewport(this.htmlElement);
    this.activePanTool();
    if (viewport.scale >= 5) {
      return;
    }
    viewport.scale += 0.1;
    cornerstone.setViewport(this.htmlElement, viewport);
  };

  // 点击缩小
  zoomNarrow = () => {
    const viewport = cornerstone.getViewport(this.htmlElement);
    this.activePanTool();
    if (viewport.scale <= 0.1) {
      return;
    }
    viewport.scale -= 0.1;
    cornerstone.setViewport(this.htmlElement, viewport);
  };

  // 调窗
  activeWwwcTool = () => {
    this.setToolActive('Wwwc');
  };

  disableWwwcTool = () => {
    this.setToolDisabled('Wwwc');
  };

  // 移动
  disablePanTool = () => {
    this.setToolDisabled('Pan');
  };

  activePanTool = () => {
    this.setToolActive('Pan');
  };

  // 缩放
  activeZoomTool = () => {
    this.setToolActive('Zoom');
  };

  disableZoomTool = () => {
    this.setToolDisabled('Zoom');
  };

  // 透镜
  activeMagnifyTool = () => {
    this.setToolActive('Magnify');
  };

  disableMagnifyTool = () => {
    this.setToolDisabled('Magnify');
  };

  // 直线距离
  activeLengthTool = () => {
    this.setToolActive('Length');
  };

  disableLengthTool = () => {
    this.setToolDisabled('Length');
  };

  // 十字线
  activeBidirectionalTool = () => {
    this.setToolActive('Bidirectional');
  };

  disableBidirectionalTool = () => {
    this.setToolDisabled('Bidirectional');
  };

  // 角度测量
  activeAngleTool = () => {
    this.setToolActive('Angle');
  };

  disableAngleTool = () => {
    this.setToolDisabled('Angle');
  };

  // Cobb角
  activeCobbAngleTool = () => {
    this.setToolActive('CobbAngle');
  };

  disableCobbAngleTool = () => {
    this.setToolDisabled('CobbAngle');
  };

  // CT值测量
  activeProbeTool = () => {
    this.setToolActive('Probe');
  };

  disableProbeTool = () => {
    this.setToolDisabled('Probe');
  };

  // 椭圆
  activeEllipticalRoiTool = () => {
    this.setToolActive('EllipticalRoi');
  };

  disableEllipticalRoiTool = () => {
    this.setToolDisabled('EllipticalRoi');
  };

  // 矩形
  activeRectangleRoiTool = () => {
    this.setToolActive('RectangleRoi');
  };

  disableRectangleRoiTool = () => {
    this.setToolDisabled('RectangleRoi');
  };

  // 钢笔
  activeFreehandRoiTool = () => {
    this.setToolActive('FreehandRoi');
  };

  disableFreehandRoiTool = () => {
    this.setToolDisabled('FreehandRoi');
  };

  // 超声时间测量
  activeTimeTool = () => {
    this.setToolActive('Time');
  };

  disableTimeTool = () => {
    this.setToolDisabled('Time');
  };

  // 超声速度测量
  activeVelocityTool = () => {
    this.setToolActive('Velocity');
  };

  disableVelocityTool = () => {
    this.setToolDisabled('Velocity');
  };

  // 超声心率测量
  activeHeartRateTool = () => {
    this.setToolActive('HeartRate');
  };

  disableHeartRateTool = () => {
    this.setToolDisabled('HeartRate');
  };

  // M模式下直线距离测量
  activeMLengthTool = () => {
    this.setToolActive('MLength');
  };

  disableMLengthTool = () => {
    this.setToolDisabled('MLength');
  };

  setToolDisabled = (toolName) => {
    cornerstoneTools.setToolDisabled(toolName);
  };

  setToolActive = (toolName) => {
    if (this.lastToolName) {
      cornerstoneTools.setToolEnabled(this.lastToolName);
    }

    cornerstoneTools.setToolActive(toolName, {
      mouseButtonMask: 1,
    });

    if (this.lastToolName !== toolName) {
      this.lastToolName = toolName;
    }
  };

  resetView = () => {
    // 重置图片操作
    cornerstone.reset(this.htmlElement);

    this.disablePanTool();
    // 清除测量数据
    const toolState = cornerstoneTools.getElementToolStateManager(this.htmlElement);
    toolState.clear(this.htmlElement);
  };

  saveToolsState = () => {
    const toolStateManager = cornerstoneTools.getElementToolStateManager(this.htmlElement);
    let toolState = {};
    if (toolStateManager.toolState[this.imageId]) {
      toolState = JSON.parse(JSON.stringify(toolStateManager.toolState[this.imageId]));
    }
    localStorage.setItem('toolState', JSON.stringify(toolState));
  };

  renderToolsState = () => {
    this.resetView();
    const toolState = JSON.parse(localStorage.getItem('toolState'));
    if (!toolState) {
      return;
    }
    Object.keys(toolState).forEach((state) => {
      cornerstoneTools.setToolPassive(state);
      toolState[state].data.forEach((item) => {
        cornerstoneTools.addToolState(this.htmlElement, state, item);
      });
      const viewport = cornerstone.getViewport(this.htmlElement);
      cornerstone.setViewport(this.htmlElement, viewport);
    });
  };

  getImageMode = () => {
    const parsedImageId = cornerstoneWADOImageLoader.wadouri.parseImageId(this.imageId);
    if (parsedImageId.scheme !== 'wadouri') {
      return null;
    }

    const Mode = [];
    const dataSet = cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.get(
      parsedImageId.url,
    );
    if (dataSet.elements.x00186011) {
      dataSet.elements.x00186011.items.forEach((item) => {
        Mode.push(item.dataSet.int16('x00186012'));
      });
    }

    return Mode;
  };
}
