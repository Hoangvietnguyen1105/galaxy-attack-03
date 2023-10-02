import { PureSprite } from "./pureSprite";
import { PureTransform } from "../core/pureTransform";

export class PureButton extends PureSprite {
  /**
   * @class PureButton
   * @param {PIXI.Container} parent 
   * @param {PIXI.Texture} texture 
   * @param {Function} onClick 
   * @param {PureTransform} transformPortrait 
   * @param {PureTransform} transformLandscape 
   */
  constructor(parent, texture, onClick, transformPortrait = null, transformLandscape = null) {
    super(parent, texture, transformPortrait, transformLandscape);
    this.displayObject.eventMode = "static";
    this.displayObject.buttonMode = true;
    this.displayObject.on("pointertap", onClick);
  }
}