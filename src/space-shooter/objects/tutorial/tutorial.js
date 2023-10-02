import { Texture } from "pixi.js";
import { Tween } from "../../../systems/tween/tween";

export class Tutorial extends PIXI.Container {
  constructor(textTextureName) {
    super("tutorial");
    this.tweens = [];
    this._initHand();
    this._initText(textTextureName);
  }

  destroy() {
    super.destroy();
    this.tweens.forEach(tween => tween.stop());
    this.tweens = [];
  }

  _initHand() {
    let texture = Texture.from("hand");
    this.hand = new PIXI.Sprite(texture);
    this.addChild(this.hand);
    this.hand.anchor.set(0.5, 0);
    this.hand.x = 80;
    this.hand.y = 62;

    let moveTween = Tween.createTween(this.hand, { x: -80 }, {
      duration: 0.65,
      loop: true,
      yoyo: true,
      easing: Tween.Easing.Sinusoidal.InOut
    }).start();
    this.tweens.push(moveTween);
  }

  _initText(textureName) {
    let texture = Texture.from(textureName);
    this.text = new PIXI.Sprite(texture);
    this.text.anchor.set(0.5);
    this.text.y = 180;
    this.addChild(this.text);
  }
}