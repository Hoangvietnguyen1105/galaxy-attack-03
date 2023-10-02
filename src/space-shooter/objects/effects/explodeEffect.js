import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import explosion from "../../../../assets/particles/explosion.json";
import { AnimatedTilingSprite } from "../../../integrate/animatedTilingSprite";
export class ExplodeEffect extends PIXI.Container {
  constructor() {
    super();
    this._speed = 1;
    // this._initAnim();
    this._initParticle();
  }

  _initParticle() {
    let texGlow = PIXI.Texture.from("glow");
    let texSpark = PIXI.Texture.from("spark");
    this.particle = new Emitter(this, upgradeConfig(explosion, [texGlow, texSpark]));
    this.particle.autoUpdate = true;
    this.particle.emit = false;
  }

  play(onComplete) {
    this._onComplete = onComplete;
    // this.anim.visible = true;
    // this.anim.play(this._onParticleComplete.bind(this));
    this.particle.playOnce(this._onParticleComplete.bind(this));
  }

  _onParticleComplete() {
    // this.anim.visible = false;
    this._onComplete && this._onComplete();
  }

  _initAnim() {
    let texture = PIXI.Texture.from("anim_explosion");
    this.anim = new AnimatedTilingSprite(texture);
    this.anim.tile.set(8, 8);
    this.anim.anchor.set(0.5);
    this.anim.blendMode = PIXI.BLEND_MODES.ADD;
    this.anim.visible = false;
    this.addChild(this.anim);
  }

  get speed() {
    return this._speed;
  }

  set speed(value) {
    this._speed = value;
    // this.anim.duration = this.anim.duration / this.speed;
  }
}