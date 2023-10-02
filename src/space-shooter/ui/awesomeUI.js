import { Easing } from "@tweenjs/tween.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";

export class AwesomeUI extends PIXI.Container {
  constructor() {
    super();
    this.playing = false;
    this._initAwesomeText();
    this._initAnimation();
  }

  playAnimation() {
    if (!this.playing) {
      this.playing = true;
      this.tweenFadeIn.start();
      this.tweenZoomIn.start();
    }
  }

  stopAnimation() {
    this.alpha = 0;
    this.playing = false;
  }

  _initAwesomeText() {
    this.txtAwesome = new PureSprite(PIXI.Texture.from("txt_awesome"), new PureTransform({
      alignment: Alignment.MIDDLE_CENTER,
      y: - 300
    }));
    this.addChild(this.txtAwesome.displayObject);
  }

  _initAnimation() {
    let txt = this.txtAwesome.displayObject;
    txt.scale.set(1.5);
    txt.alpha = 0;
    this.tweenFadeIn = Tween.createTween(txt, { alpha: 1 }, {
      duration: 0.25,
      easing: Tween.Easing.Sinusoidal.In
    });
    this.tweenFadeOut = Tween.createTween(txt, { alpha: 0 }, {
      delay: 0.5,
      duration: 0.5,
    });
    this.tweenComplete = Tween.createCountTween({
      duration: 0.5,
      onComplete: this._onAnimationComplete.bind(this)
    })
    this.tweenZoomIn = Tween.createTween(txt.scale, { x: 1, y: 1 }, {
      duration: 0.5,
      easing: Easing.Bounce.Out,
    });
    this.tweenZoomIn.chain(this.tweenFadeOut);
    this.tweenFadeOut.chain(this.tweenComplete);
  }

  _onAnimationComplete() {
    this.playing = false;
  }
}