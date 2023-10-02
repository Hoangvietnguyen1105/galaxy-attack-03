import { PureTransform } from "../core/pureTransform";
import { GameResizer, Orientation } from "../systems/gameResizer";
import { PureObject } from "../core/pureObject";

export class PureRect extends PureObject {
  /**
   * @class PureRect 
   * @param {PureTransform} transformPortrait 
   * @param {PureTransform} transformLandscape 
   * @param {number} naturalWidth 
   * @param {number} naturalHeight 
   */
  constructor(transformPortrait = null, transformLandscape = null, naturalWidth = 0, naturalHeight = 0) {
    super(new PIXI.Rectangle(0, 0, naturalWidth, naturalHeight), transformPortrait, transformLandscape);
    this.registerOnUpdateTransformCallback(this._onResize.bind(this));
  }

  /**
   * @summary Draw rect according to container transform
   * @param {PIXI.Container} parent 
   * @param {number} color 
   * @param {number} alpha 
   */
  fill(parent, color = 0x000000, alpha = 1) {
    this.color = color;
    this.alpha = alpha;
    
    this.graphics = new PIXI.Graphics();
    parent.addChild(this.graphics);
    this._draw();
  }

  _draw() {
    this.graphics.clear();
    this.graphics.beginFill(this.color, this.alpha);
    this.graphics.drawRect(this.x, this.y, this.width, this.height);
  }

  _onResize() {
    // update graphics
    if (this.graphics) {
      this._draw();
    }
  }

  get visible() {
    return this.graphics.visible;
  }

  set visible(value) {
    this.graphics.visible = value;
  }
}