const MeasureTools = {
  basicsTools: [
    // mode:工具支持的图像模式 [1: 2D, 2: M, 3: CW/PW], 工具没定义mode代表是DICOM图像通用工具
    {
      mode: [1],
      name: '距离',
      value: 'Length',
      function: 'activeLengthTool',
      icon: 'icon-gudingchangduhuizhixian',
    },
    {
      mode: [1],
      name: '面积',
      value: 'EllipticalRoi',
      function: 'activeEllipticalRoiTool',
      icon: 'icon-xietuoyuan',
    },
    {
      name: '角度',
      value: 'Angle',
      function: 'activeAngleTool',
      icon: 'icon-xuanzhuanjiaodu',
    },
    {
      name: 'Cobb角',
      value: 'CobbAngle',
      function: 'activeCobbAngleTool',
      icon: 'icon-jurassic_nishiz-angle',
    },
    {
      mode: [2, 3],
      name: '时间',
      value: 'Time',
      function: 'activeTimeTool',
      icon: 'icon-shijian',
    },
    {
      mode: [2],
      name: '距离(M)',
      value: 'MLength',
      function: 'activeMLengthTool',
      icon: 'icon-gudingchangduhuizhixian',
    },
    {
      mode: [3],
      name: '速度',
      value: 'Velocity',
      function: 'activeVelocityTool',
      icon: 'icon-sudu',
    },
    {
      mode: [2, 3],
      name: '心率',
      value: 'HeartRate',
      function: 'activeHeartRateTool',
      icon: 'icon-xinshuai',
    },
    {
      name: '箭头文字',
      value: 'ArrowAnnotate',
      function: 'arrowAnnotateTool',
      icon: 'icon-biaojidian',
    },
    {
      name: '勾画',
      value: 'Sketch',
      function: 'activeSketchTool',
      icon: 'icon-radiobuttonselect',
    },
    {
      mode: [1],
      name: '钢笔',
      value: 'FreehandRoi',
      function: 'activeFreehandRoiTool',
      icon: 'icon-gangbi',
    },
    {
      name: '缩放',
      value: 'Zoom',
      function: 'activeZoomTool',
      icon: 'icon-suofang',
    },
    {
      name: '旋转',
      value: 'Rotate',
      icon: 'icon-xuanzhuan',
      children: [
        {
          name: '左右翻转',
          value: 'LeftRightFlip',
          function: 'leftRightFlip',
          icon: 'icon-a-zujian791',
        },
        {
          name: '上下翻转',
          value: 'UpsideDownFlip',
          function: 'upsideDownFlip',
          icon: 'icon-a-zujian781',
        },
        {
          name: '正时针旋转',
          value: 'ClockwiseRotate',
          function: 'clockwiseRotate',
          icon: 'icon-a-zujian8211',
        },
        {
          name: '逆时针旋转',
          value: 'AntiClockwiseRotate',
          function: 'antiClockwiseRotate',
          icon: 'icon-a-zujian8311',
        },
      ],
    },
    {
      name: '拖动',
      value: 'Pan',
      function: 'activePanTool',
      icon: 'icon-move',
    },
    {
      name: '透镜',
      value: 'Magnify',
      function: 'activeMagnifyTool',
      icon: 'icon-quanshenjing',
    },
  ],
};

export default MeasureTools;
