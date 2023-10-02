import { PureObject } from "../core/pureObject";

export class PureTilingSprite extends PureObject {
  /**
   * @class PureSprite 
   * @param {PIXI.Container} parent
   * @param {PIXI.Texture} texture 
   * @param {PureTransform} transformPortrait 
   * @param {PureTransform} transformLandscape 
   */
  constructor(parent, texture, transformPortrait = null, transformLandscape = null) {
    super(new PIXI.TilingSprite(texture, texture.width, texture.height), transformPortrait, transformLandscape);
    if (parent) {
      parent.addChild(this.displayObject);
    }
  }
}
