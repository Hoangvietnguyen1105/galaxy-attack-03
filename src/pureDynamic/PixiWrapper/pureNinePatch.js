import { PureObject } from "../core/pureObject";

export class PureNinePatch extends PureObject {
  /**
   * @class PureNinePatch
   * @param {PIXI.Container} parent
   * @param {PIXI.Texture} texture
   * @param {number} left
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @param {PureTransform} transformPortrait
   * @param {PureTransform} transformLandscape
   */
  constructor(parent, texture, left, top, right, bottom, transformPortrait = null, transformLandscape = null) {
    super(new PIXI.NineSlicePlane(texture, left, top, right, bottom), transformPortrait, transformLandscape);
    parent.addChild(this.displayObject);
  }
}
