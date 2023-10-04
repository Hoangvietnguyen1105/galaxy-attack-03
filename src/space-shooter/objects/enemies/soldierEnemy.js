import { Container, Sprite, Texture } from "pixi.js";
import { Tween } from "../../../systems/tween/tween";

export class SoldierEnemy extends Container {
  constructor() {
    super("soldierEnemy");
    this.name = 'galaga'

    this.scale.set(0.55);
    this._initBody();
    this._initHorn();
    this._initLeg();
  }

  _initBody() {
    this.bodyEnemy = new Sprite(Texture.from("Fly Robot 22"));
    this.bodyEnemy.anchor.set(0.5);
    this.addChild(this.bodyEnemy);
  }

  _initLeg() {
    this._addLeg("enemy_soldier_leg_l", -this.bodyEnemy.width / 2 + 20, 10, "left", -10);
    this._addLeg("enemy_soldier_leg_r", this.bodyEnemy.width / 2 - 20, 10, "right", 10);
    this._addLeg("enemy_soldier_leg_1_l", -this.bodyEnemy.width / 2 + 35, 20, "left", -10);
    this._addLeg("enemy_soldier_leg_1_r", this.bodyEnemy.width / 2 - 35, 20, "right", 10);
  }

  _initHorn() {
    this._addHorn("enemy_soldier_horn_l", -this.bodyEnemy.width / 2 + 15, 15, "left", 15);
    this._addHorn("enemy_soldier_horn_r", this.bodyEnemy.width / 2 - 15, 15, "right", -15);
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
      duration : 0.4,
      loop     : true,
      delay    : 0.1,
      yoyo     : true,
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
      duration : 0.4,
      loop     : true,
      yoyo     : true,
    }).start();
    return horn;
  }
}
