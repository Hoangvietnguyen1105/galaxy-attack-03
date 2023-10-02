import { PureObject } from "../core/pureObject";
import { PureTransform } from "../core/pureTransform";
import { GameResizer, Orientation } from "../systems/gameResizer";
import { Util } from "../../helpers/utils";

export class PureText extends PureObject {
  /**
   * @class PureText
   * @param {PIXI.Container} parent 
   * @param {string} text 
   * @param {PureTransform} transformPortrait 
   * @param {PIXI.TextStyle} stylePortrait 
   * @param {PureTransform} transformLandscape 
   * @param {PIXI.TextStyle} styleLandscape use style portrait if null 
   */
  constructor(text, transformPortrait = null, stylePortrait = null, transformLandscape = null, styleLandscape = null) {
    stylePortrait = stylePortrait || new PIXI.TextStyle;
    styleLandscape = styleLandscape || stylePortrait;

    super(new PIXI.Text(text, GameResizer.isPortrait() ? stylePortrait : styleLandscape), transformPortrait, transformLandscape);
    this.stylePortrait = stylePortrait;
    this.styleLandscape = styleLandscape;
    this.registerOnUpdateTransformCallback(this.onResize.bind(this));
    this.onResize();
  }

  onResize() {
    let style = GameResizer.orientation === Orientation.Portrait ? this.stylePortrait : this.styleLandscape;
    Util.copyObject(style, this.displayObject.style);
  }
}