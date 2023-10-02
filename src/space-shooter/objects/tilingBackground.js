import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { PureTilingSprite } from "../../pureDynamic/PixiWrapper/pureTilingSprite";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";

export class TilingBackground extends PureTilingSprite {
  /**
   * @class TilingBackground 
   * @param {PIXI.Container} parent
   * @param {PIXI.Texture} texture 
   * @param {PureTransform} transformPortrait 
   * @param {PureTransform} transformLandscape 
   */
  constructor(parent, texture, transformPortrait = null, transformLandscape = null) {
    super(parent, texture, transformPortrait, transformLandscape);
    this.resize();
    this.speed = GameConstant.BACKGROUND_SPEED;
    GameResizer.registerOnResizeCallback(this.resize, this);
    Game.app.ticker.add(this.update, this);
  }

  stop() {
    this.displayObject.tilePosition.set(0, 0);
    this.speed = 0;
  }

  update() {
    this.displayObject.tilePosition.y += this.speed * Game.app.ticker.deltaMS / 1000;
  }

  resize() {
    this.displayObject.tileScale.set( GameResizer.width / this.displayObject.texture.width);
  }
}