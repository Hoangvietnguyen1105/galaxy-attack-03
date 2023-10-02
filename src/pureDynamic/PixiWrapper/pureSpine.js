import { Spine } from "@pixi-spine/loader-uni";
import { GameConstant } from "../../gameConstant";
import { Debug } from "../../helpers/debug";
import { PureObject } from "../core/pureObject";

export class PureSpine extends PureObject {
  constructor(parent, spineData, pTransform, lTransform) {
    super(new Spine(spineData), pTransform, lTransform);
    parent.addChild(this.displayObject);
    /** @type {PIXI.spine.Spine} */
    this.displayObject;
    this.animations = this.displayObject.state.data.skeletonData.animations.map(anim => anim.name);
  }

  play(config) {
    this._assertAnim(config.name);
    this._listener = {
      start: config.onStart,
      interrupt: config.onInterrupt,
      complete: config.onComplete,
      end: config.onEnd,
      dispose: config.onDispose
    };
    this.displayObject.state.addListener(this._listener);
    this.displayObject.state.setAnimation(0, config.name, config.loop, config.delay);
  }

  playAnimations(config) {
    let anims = config.animations;
    this._listener = {
      start: config.onStart,
      interrupt: config.onInterrupt,
      complete: config.onComplete,
      end: config.onEnd,
      dispose: config.onDispose
    };

    this.displayObject.state.addListener(this._listener);

    this._assertAnim(anims[0].name);
    this.displayObject.state.setAnimation(0, anims[0].name, anims[0].loop, anims[0].delay || 0);
    for (var i = 1; i < anims.length; i++) {
      this._assertAnim(anims[i].name);
      this.displayObject.state.addAnimation(0, anims[i].name, anims[i].loop, anims[i].delay || 0);
    }
  }

  removeListener() {
    this.displayObject.state.removeListener(this._listener);
  }

  pause() {
    this._lastTimeScale = this.displayObject.state.timeScale;
    this.displayObject.state.timeScale = 0;
  }

  resume() {
    !this._lastTimeScale && (this._lastTimeScale = 1);
    this.displayObject.state.timeScale = this._lastTimeScale;
  }

  /**
   * @returns {PIXI.spine.SpineSprite}
   */
  getSprite(name) {
    return this.displayObject.children.find(child => child.children[0] && child.children[0].attachment.name === name)?.children[0];
  }

  getAllSpriteName() {
    return this.displayObject.children.map(child => child.children[0]?.attachment.name);
  }

  hasAnimation(name) {
    return !!this.animations.find(anim => anim === name);
  }

  _assertAnim(name) {
    Debug.assert(this.hasAnimation(name), `Spine ${this.displayObject.name} animation ${name} not found!`);
  }
}