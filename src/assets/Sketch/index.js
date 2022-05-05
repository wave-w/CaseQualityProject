import cornerstoneTools from 'cornerstone-tools';
import drawline from './init';

const BaseTool = cornerstoneTools.importInternal(
  'base/BaseTool',
);
export default class SketchTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'Sketch',
      supportedInteractionTypes: ['Mouse', 'Touch'],
    };

    super(props, defaultProps);
    this.start = {};
    this.touchDragCallback = this.dragCallback.bind(this);
    this.mouseDragCallback = this.dragCallback.bind(this);
    this.mouseUpCallback = () => {
      this.start = {};
    };
  }

  dragCallback(evt) {
    const eventData = evt.detail;
    const context = eventData.element.firstChild.getContext('2d');
    drawline(context, this.start, eventData.currentPoints.image, 'greenyellow');
    this.start = eventData.currentPoints.image;
  }
}
