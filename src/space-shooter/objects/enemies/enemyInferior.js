import { Container, Sprite, Texture } from "pixi.js";
import { Tween } from "../../../systems/tween/tween";

export class InferiorEnemy extends Container {
  constructor() {
    super("inferiorEnemy");
    this.scale.set(0.65);
    this._initBody();
    this._initWing();
  }

  _initBody() {
    this.bodyEnemy = new Sprite(Texture.from("enemy_inferior_body"));
    this.bodyEnemy.anchor.set(0.5);
    this.addChild(this.bodyEnemy);
  }


  _initWing() {
    this._addHorn("enemy_inferior_wing_r", -this.bodyEnemy.width / 2 + 40, 15, "left", -15);
    this._addHorn("enemy_inferior_wing_l", this.bodyEnemy.width / 2 - 40, 15, "right", 15);
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
      duration : 0.4,
      loop     : true,
      yoyo     : true,
    }).start();
    return horn;
  }
}
