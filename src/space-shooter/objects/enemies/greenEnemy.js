import { Container, Sprite, Texture } from "pixi.js";
import { Tween } from "../../../systems/tween/tween";

export class GreenEnemy extends Container {
  constructor() {
    super("greenEnemy");
    this.scale.set(0.4);
    this._initLeg();
    this._initBody();
    this._initWing();
  }

  _initBody() {
    this.bodyEnemy = new Sprite(Texture.from("enemy_green_body"));
    this.bodyEnemy.anchor.set(0.5);
    this.addChild(this.bodyEnemy);
  }

  _initLeg() {
    this._addLeg("enemy_green_leg_l", -30, 35, "left", 10);
    this._addLeg("enemy_green_leg_r", 30, 35, "right", -10);
  }

  _initWing() {
    this._addLeg("enemy_green_wing_l", -30, 75, "left", 10);
    this._addLeg("enemy_green_wing_r", 30, 75, "right", -10);
  }

  _addLeg(texture, x, y, type, angle) {
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
