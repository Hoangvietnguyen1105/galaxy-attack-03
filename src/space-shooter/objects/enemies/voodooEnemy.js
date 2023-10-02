

import { Container, Texture } from "pixi.js";
import { PureTransform } from "../../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../../systems/tween/tween";

export class VoodooEnemy extends Container {
  constructor(data = {}) {
    super("voodooShip");
    this.scale.set(0.7);
    this.angle = data.angle || 0;
    this.leftWings = [];
    this.rightWings = [];
    this.initBodyShip();
    this.initJaw();
    this.initWings();
    this.initGlows();
    this.initEyeGlow();
    this.initAnimation();
  }

  initBodyShip() {
    let bodyTexture = Texture.from("spr_voodooShip_body");
    let tranform = new PureTransform({
      alignment               : Alignment.CUSTOM,
      anchorX                 : 0,
      anchorY                 : 0,
      pivotX                  : 0.5,
      pivotY                  : 0.8,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let body = new PureSprite(bodyTexture, tranform);
    this.addChild(body.displayObject);
    return body;
  }

  initJaw() {
    let jawTexture = Texture.from("spr_voodooShip_jaw");
    let tranform = new PureTransform({
      alignment               : Alignment.CUSTOM,
      anchorX                 : 0,
      anchorY                 : 0,
      pivotX                  : 0.5,
      pivotY                  : 0.5,
      y                       : 20,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let jaw = new PureSprite(jawTexture, tranform);
    this.addChild(jaw.displayObject);
    return jaw;
  }

  initWings() {
    this.initWing("spr_voodooShip_wing_top", 0.5, 1, 35, -55, 45);
    this.initWing("spr_voodooShip_wing_rear", 0.5, 0.8, 40, -15, 70);
  }

  initWing(texture, pivotX, pivotY, x, y, angle) {
    let wingTexture = Texture.from(texture);
    let transform1 = new PureTransform({
      alignment               : Alignment.CUSTOM,
      anchorX                 : 0,
      anchorY                 : 0,
      pivotX,
      pivotY,
      x                       : -x,
      y,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let transform2 = new PureTransform({
      alignment               : Alignment.CUSTOM,
      anchorX                 : 0,
      anchorY                 : 0,
      pivotX,
      pivotY,
      x,
      y,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let leftWing = new PureSprite(wingTexture, transform1);
    let rightWing = new PureSprite(wingTexture, transform2);
    leftWing.displayObject.angle = -angle;
    leftWing.displayObject.angleOriginal = -angle;
    rightWing.displayObject.angle = angle;
    rightWing.displayObject.angleOriginal = angle;
    rightWing.displayObject.scale.x = -1;
    this.leftWings.push(leftWing);
    this.rightWings.push(rightWing);
    this.addChild(leftWing.displayObject);
    this.addChild(rightWing.displayObject);
  }

  initGlows() {
    let glowTexture = Texture.from("spr_voodooShip_line_grow");
    let transform1 = new PureTransform({
      alignment               : Alignment.CUSTOM,
      anchorX                 : 0,
      anchorY                 : 0,
      pivotX                  : 1,
      pivotY                  : 1,
      x                       : -2,
      y                       : -15,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let transform2 = new PureTransform({
      alignment               : Alignment.CUSTOM,
      anchorX                 : 0,
      anchorY                 : 0,
      pivotX                  : 1,
      pivotY                  : 1,
      x                       : 2,
      y                       : -15,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let leftGlow = new PureSprite(glowTexture, transform1);
    let rightGlow = new PureSprite(glowTexture, transform2);
    rightGlow.displayObject.scale.x = -1;
    this.addChild(leftGlow.displayObject);
    this.addChild(rightGlow.displayObject);
  }

  initEyeGlow() {
    let glowTexture = Texture.from("spr_voodooShip_eye_grow");
    let tranform = new PureTransform({
      alignment               : Alignment.CUSTOM,
      anchorX                 : 0,
      anchorY                 : 0,
      pivotX                  : 0.5,
      pivotY                  : 0.5,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let glow = new PureSprite(glowTexture, tranform);
    this.addChild(glow.displayObject);
    return glow;
  }

  initAnimation() {
    let flapTween = Tween.createTween({ angle: 0 }, { angle: 15 }, {
      duration : 0.5,
      yoyo     : true,
      loop     : true,
      onUpdate : (object) => {
        for (let i = 0; i < this.leftWings.length; i++) {
          this.leftWings[i].displayObject.angle = this.leftWings[i].displayObject.angleOriginal + object.angle;
          this.rightWings[i].displayObject.angle = this.rightWings[i].displayObject.angleOriginal - object.angle;
        }
      },
    });
    flapTween.start();
  }
}
