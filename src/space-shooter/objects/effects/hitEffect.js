import { BLEND_MODES, Container, Texture } from "pixi.js";
import { AnimatedTilingSprite } from "../../../integrate/animatedTilingSprite";

export class HitEffect extends Container {
  constructor() {
    super();
    this._speed = 1;
    this._initAnim();
  }

  play(onComplete) {
    this._onComplete = onComplete;
    this.anim.visible = true;
    this.anim.play(this._onAnimComplete.bind(this));
  }

  _onAnimComplete() {
    this.anim.visible = false;
    this._onComplete && this._onComplete();
  }

  _initAnim() {
    let texture = Texture.from("anim_hit");
    this.anim = new AnimatedTilingSprite(texture);
    this.anim.tile.set(4, 4);
    this.anim.anchor.set(0.5);
    this.anim.blendMode = BLEND_MODES.ADD;
    this.anim.visible = false;
    this.addChild(this.anim);
  }

  get speed() {
    return this._speed;
  }

  set speed(value) {
    this._speed = value;
    this.anim.duration /= this.speed;
  }
}
