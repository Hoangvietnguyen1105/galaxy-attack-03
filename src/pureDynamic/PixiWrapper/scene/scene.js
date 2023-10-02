import { PureRect } from "../pureRect";
import { PureTransform } from "../../core/pureTransform";
import { Alignment } from "../../core/pureTransformConfig";
import { Debug } from "../../../helpers/debug";
import { GameConstant } from "../../../gameConstant";
import { PureSprite } from "../pureSprite";

export class Scene extends PIXI.Container {
  /**
   * @class Scene
   * @param {number} key Scene key, should be unique
   */
  constructor(key) {
    super();
    this.key = key;
    this._addRoot();
  }

  create() {
    Debug.log(this.key, "Create");
  }

  /**
   * @param {number} dt delta time
   */
  update(dt) { }

  onPause() {
    Debug.log(this.key, "OnPause");
  }

  onResume() {
    Debug.log(this.key, "OnResume");
  }

  resize() { }

  destroy() {
    this.removeChildren();
  }

  _addRoot() {
    let transform = new PureTransform({ alignment: Alignment.FULL });
    this.root = new PureRect(transform, transform);
  }

  initGameTag() {
    if (!GameConstant.SHOW_GAME_TAG) {
      return;
    }

    this.gameTag = new PureSprite(PIXI.Texture.from("game_tag"), new PureTransform({
      container: this.root,
      alignment: Alignment.BOTTOM_RIGHT,
      x: -10,
      y: -10
    }));
    this.addChild(this.gameTag.displayObject);
  }
}