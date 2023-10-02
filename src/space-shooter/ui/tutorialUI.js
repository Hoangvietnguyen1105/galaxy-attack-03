import { Util } from "../../helpers/utils";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
import { ObjectFactory } from "../objectFactory";

export class TutorialUI extends PIXI.Container {
  constructor() {
    super();
    this._initBackground();
    // this._initTextDestroyEnemy();
    // this._initButtonStart();
  }

  _onTapBackground() {
    this.emit("tutorial:complete");
  }

  _initBackground() {
    this.bg = ObjectFactory.createColorBackground(0);
    this.addChild(this.bg.displayObject);
    Util.registerOnPointerDown(this.bg.displayObject, this._onTapBackground, this);
  }

  
  _initTextDestroyEnemy() {
    this.txtDestroyEnemy = new PureSprite(PIXI.Texture.from("txt_destroyenemy"), new PureTransform({
      alignment: Alignment.BOTTOM_CENTER,
      y: -350
    }));
    this.addChild(this.txtDestroyEnemy.displayObject);
  }

  _initButtonStart() {
    this.btnStart = new PureSprite(PIXI.Texture.from("btn_start"), new PureTransform({
      pivotX: 0.5,
      pivotY: 0.5,
      anchorX: 0.5,
      anchorY: 1,
      y: -200
    }));
    this.addChild(this.btnStart.displayObject);

    Tween.createTween(this.btnStart.displayObject.scale, {x: 1.12, y: 1.12}, {
      duration: 0.35,
      loop: true,
      yoyo: true,
      easing: Tween.Easing.Sinusoidal.InOut
    }).start();
  }

  registerOnTutorialCompleteCallback(fn, context) {
    this.on("tutorial:complete", fn, context);
  }
}
