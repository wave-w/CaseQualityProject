import i18n from '@/assets/lang/index';

const MeasureTools = {
  basicsTools: [
    // mode:工具支持的图像模式 [1: 2D, 2: M, 3: CW/PW], 工具没定义mode代表是DICOM图像通用工具
    {
      name: i18n.t('imagingViewer.distance'),
      value: 'Length',
      function: 'activeLengthTool',
      icon: 'icon_distance'
    },
    {
      name: i18n.t('imagingViewer.area'),
      value: 'EllipticalRoi',
      function: 'activeEllipticalRoiTool',
      icon: 'icon_area'
    },
    {
      name: i18n.t('imagingViewer.angle'),
      value: 'Angle',
      function: 'activeAngleTool',
      icon: 'icon_angle'
    },
    {
      name: i18n.t('imagingViewer.cobbAngle'),
      value: 'CobbAngle',
      function: 'activeCobbAngleTool',
      icon: 'icon_cobbAngle'
    },
    {
      mode: [2, 3],
      name: i18n.t('imagingViewer.time'),
      value: 'Time',
      function: 'activeTimeTool',
      icon: 'icon_time'
    },
    {
      mode: [2],
      name: i18n.t('imagingViewer.mDistance'),
      value: 'MLength',
      function: 'activeMLengthTool',
      icon: 'icon_distance'
    },
    {
      mode: [3],
      name: i18n.t('imagingViewer.vlocity'),
      value: 'Velocity',
      function: 'activeVelocityTool',
      icon: 'icon_vlocity'
    },
    {
      mode: [2, 3],
      name: i18n.t('imagingViewer.heartRate'),
      value: 'HeartRate',
      function: 'activeHeartRateTool',
      icon: 'icon_heartRate'
    },
    {
      name: i18n.t('imagingViewer.arrowAnnotate'),
      value: 'ArrowAnnotate',
      function: 'arrowAnnotateTool',
      icon: 'icon_arrowAnnotate'
    },
    {
      name: i18n.t('imagingViewer.sketch'),
      value: 'Sketch',
      function: 'activeSketchTool',
      icon: 'icon_sketch'
    },
    {
      mode: [1],
      name: i18n.t('imagingViewer.freehand'),
      value: 'FreehandRoi',
      function: 'activeFreehandRoiTool',
      icon: 'icon_freehand'
    },
    {
      name: i18n.t('imagingViewer.zoom'),
      value: 'Zoom',
      function: 'activeZoomTool',
      icon: 'icon_zoom'
    },
    {
      name: i18n.t('imagingViewer.rotate'),
      value: 'Rotate',
      icon: 'icon_rotate',
      children: [
        {
          name: i18n.t('imagingViewer.flipHorizontal'),
          value: 'LeftRightFlip',
          function: 'leftRightFlip',
          icon: 'icon_flipHorizontal'
        },
        {
          name: i18n.t('imagingViewer.flipVertically'),
          value: 'UpsideDownFlip',
          function: 'upsideDownFlip',
          icon: 'icon_flipVertically'
        },
        {
          name: i18n.t('imagingViewer.clockwiseRotate'),
          value: 'ClockwiseRotate',
          function: 'clockwiseRotate',
          icon: 'icon_clockwiseRotate'
        },
        {
          name: i18n.t('imagingViewer.antiClockwiseRotate'),
          value: 'AntiClockwiseRotate',
          function: 'antiClockwiseRotate',
          icon: 'icon_antiClockwiseRotate'
        }
      ]
    },
    {
      name: i18n.t('imagingViewer.pan'),
      value: 'Pan',
      function: 'activePanTool',
      icon: 'icon_pan'
    },
    {
      name: i18n.t('imagingViewer.magnify'),
      value: 'Magnify',
      function: 'activeMagnifyTool',
      icon: 'icon_magnify'
    }
  ]
};

export default MeasureTools;
