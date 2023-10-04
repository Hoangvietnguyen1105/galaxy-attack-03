import { Container, Sprite, Texture } from "pixi.js";
import { Tween } from "../../../systems/tween/tween";

export class DiverEnemy extends Container {
  constructor() {
    super("diverEnemy");
    this.scale.set(0.55);
    this._initBody();
    this._initWing();
    this._initLeg();
  }

  _initBody() {
    this.bodyEnemy = new Sprite(Texture.from("Fly Robot 7"));
    this.bodyEnemy.anchor.set(0.5);
    this.addChild(this.bodyEnemy);
  }

  _initLeg() {
    this._addLeg("enemy_diver_leg_l", -10, 45, "left", -10);
    this._addLeg("enemy_diver_leg_r", 10, 45, "right", 10);
  }

  _initWing() {
    this._addHorn("enemy_diver_wing_l", -30, 55, "left", -15);
    this._addHorn("enemy_diver_wing_r", 30, 55, "right", 15);
  }

  _addLeg(texture, x, y, type, angle) {
    let horn = new Sprite(Texture.from(texture));
    if (type === "left") {
      horn.anchor.set(1, 0);
    }
    else {
      horn.anchor.set(0, 0);
    }
    horn.x = x;
    horn.y = y;
    this.addChild(horn);
    Tween.createTween(horn, {
      angle: angle,
    }, {
      duration: 0.4,
      loop: true,
      delay: 0.1,
      yoyo: true,
    }).start();
    return horn;
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
