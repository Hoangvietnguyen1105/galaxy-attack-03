import { Container, Sprite, Texture } from "pixi.js";
import { Tween } from "../../../systems/tween/tween";

export class NaEnemy extends Container {
  constructor() {
    super("naEnemy");
    this.scale.set(0.45);
    this._initWing();
    this._initBody();
  }

  _initBody() {
    this.bodyEnemy = new Sprite(Texture.from("Fly Robot 8"));
    this.bodyEnemy.anchor.set(0.5);
    this.addChild(this.bodyEnemy);
  }

  _initWing() {
    this._addHorn("enemy_na_wing_l", -10, 35, "left", -10);
    this._addHorn("enemy_na_wing_r", 10, 35, "right", 10);
  }

  _addHorn(texture, x, y, type, angle) {
    let horn = new Sprite(Texture.from(texture));
    if (type === "left") {
      horn.anchor.set(1, 1);
    }
    else {
      horn.anchor.set(0, 1);
    }
    horn.x = x;
    horn.y = y;
    this.addChild(horn);
    Tween.createTween(horn, {
      angle: angle,
    }, {
      duration: 0.4,
      loop: true,
      yoyo: true,
    }).start();
    return horn;
  }
}
