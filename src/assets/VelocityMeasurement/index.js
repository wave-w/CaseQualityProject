import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import drawline from './init';

const BaseAnnotationTool = cornerstoneTools.importInternal(
  'base/BaseAnnotationTool',
);
export default class VelocityTool extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'Velocity',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        drawHandles: true,
        drawHandlesOnHover: false,
        hideHandlesIfMoving: false,
        renderDashed: false,
      },
    };
    super(props, defaultProps);
  }

  getPixelSpacing = (image) => {
    const imagePlane = cornerstone.metaData.get(
      'imagePlaneModule',
      image.imageId,
    );
    if (imagePlane) {
      return {
        rowPixelSpacing:
          imagePlane.rowPixelSpacing || imagePlane.rowImagePixelSpacing,
        colPixelSpacing:
          imagePlane.columnPixelSpacing || imagePlane.colImagePixelSpacing,
        ultrasonicX: imagePlane.ultrasonicX,
        ultrasonicY: imagePlane.ultrasonicY,
        ultrasonicStartX: imagePlane.ultrasonicStartX,
        ultrasonicStartY: imagePlane.ultrasonicStartY,
        ultrasonicEndX: imagePlane.ultrasonicEndX,
        ultrasonicEndY: imagePlane.ultrasonicEndY,
      };
    }

    return {
      rowPixelSpacing: image.rowPixelSpacing,
      colPixelSpacing: image.columnPixelSpacing,
    };
  };

  // 创建新测量
  createNewMeasurement = (eventData) => {
    const goodEventData = eventData && eventData.currentPoints && eventData.currentPoints.image;

    if (!goodEventData) {
      throw new Error(
        `required eventData not supplied to tool ${this.name}'s createNewMeasurement`,
      );
    }
    const { x, y } = eventData.currentPoints.image;
    return {
      visible: true,
      active: true,
      color: undefined,
      invalidated: true,
      handles: {
        start: {
          x,
          y,
          highlight: true,
          active: false,
        },
        end: {
          x,
          y,
          highlight: true,
          active: true,
        },
        textBox: {
          active: false,
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true,
        },
      },
    };
  };

  renderToolData = (evt) => {
    const eventData = evt.detail;
    const context = eventData.canvasContext;
    const { image, element } = eventData;
    const toolData = cornerstoneTools.getToolState(evt.currentTarget, this.name);
    if (toolData) {
      for (let i = 0; i < toolData.data.length; i += 1) {
        const data = toolData.data[i];
        this.updateCachedStats(image, element, data);
        const {
          ultrasonicStartX, ultrasonicStartY, ultrasonicEndX, ultrasonicEndY,
        } = this.getPixelSpacing(image);

        data.color = 'white';
        toolData.data[toolData.data.length - 1].color = 'greenyellow';
        data.handles.start.x = data.handles.start.x > ultrasonicStartX ? data.handles.start.x : ultrasonicStartX;
        data.handles.start.y = data.handles.start.y > ultrasonicStartY ? data.handles.start.y : ultrasonicStartY;
        data.handles.start.x = data.handles.start.x < ultrasonicEndX ? data.handles.start.x : ultrasonicEndX;
        data.handles.start.y = data.handles.start.y < ultrasonicEndY ? data.handles.start.y : ultrasonicEndY;
        data.handles.end.x = data.handles.end.x < ultrasonicEndX ? data.handles.end.x : ultrasonicEndX;
        data.handles.end.y = data.handles.end.y < ultrasonicEndY ? data.handles.end.y : ultrasonicEndY;
        data.handles.end.x = data.handles.end.x > ultrasonicStartX ? data.handles.end.x : ultrasonicStartX;
        data.handles.end.y = data.handles.end.y > ultrasonicStartY ? data.handles.end.y : ultrasonicStartY;
        data.ultrasonicData = {
          ultrasonicStartX,
          ultrasonicStartY,
          ultrasonicEndX,
          ultrasonicEndY,
        };

        drawline(
          context,
          data.ultrasonicData,
          data.handles.end,
          data.length,
          data.unit,
          data.color,
        );
      }
    }
  };

  updateCachedStats = (image, element, data) => {
    const {
      ultrasonicX, ultrasonicY, ultrasonicEndY, ultrasonicStartY,
    } = this.getPixelSpacing(image);
    let unit = 'pixels';
    if (ultrasonicY && ultrasonicX) {
      unit = 'cm/s';
    }

    const velocity = (data.handles.end.y - (ultrasonicEndY + ultrasonicStartY) / 2) * (ultrasonicY || 1);
    const length = velocity.toFixed(3);

    const newData = {
      length,
      unit,
      invalidated: false,
    };

    Object.assign(data, newData);
  };

  pointNearTool = (element, data, coords) => {
    const hasStartAndEndHandles = data && data.handles && data.handles.start && data.handles.end;
    if (!hasStartAndEndHandles) {
      throw new Error(
        `invalid parameters supplied to tool ${this.name}'s pointNearTool`,
      );
    }
    if (data.visible === false) {
      return false;
    }
    const lineSegment = {
      start: cornerstone.pixelToCanvas(element, data.handles.start),
      end: cornerstone.pixelToCanvas(element, data.handles.end),
    };
    return (
      cornerstoneMath.lineSegment.distanceToPoint(lineSegment, coords) < 25
    );
  };
}
