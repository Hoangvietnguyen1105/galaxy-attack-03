import { Container, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";

export class WarningUI extends Container {
  constructor() {
    super();
    this._initBg();
    this._initAnimation();
    this.visible = false;
  }

  playAnimation(onComplete) {
    this.visible = true;
    this.tweenAlpha.start();
    this.tweenAlpha.onComplete(() => {
      this.visible = false;
      onComplete && onComplete();
    });
  }

  pause() {
    if (this.tweenAlpha.isPlaying()) {
      this.tweenAlpha.pause();
    }
  }

  resume() {
    if (this.tweenAlpha.isPaused()) {
      this.tweenAlpha.resume();
    }
  }

  _initBg() {
    this.bg = new PureSprite(Texture.from("spr_glow_warning"), new PureTransform({
      alignment           : Alignment.FULL,
      maintainAspectRatio : MaintainAspectRatioType.MAX,
    }));
    this.addChild(this.bg.displayObject);
  }

  _initAnimation() {
    this.tweenAlpha = Tween.createTween(this, { alpha: 0 }, {
      duration : 0.4,
      repeat   : 2,
      yoyo     : true,
      easing   : Tween.Easing.Sinusoidal.InOut,
    });
  }
}
