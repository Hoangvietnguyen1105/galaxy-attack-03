import { SpineAnimator } from "../../../integrate/spineAnimator";
import { Tween } from "../../../systems/tween/tween";
import { ExplodeEffect } from "../effects/explodeEffect";
import { HealthBar } from "../healthbar/healthBar";
import { EnemyBase } from "./enemyBase";
import { EnemyEvent } from "./enemyEvent";

export class CommonEnemy extends EnemyBase {
  constructor() {
    super();
    this.weapon = null;
    this.sprite = null;
    /** @type {SpineAnimator} */
    this.animator = null;
    this.collider.collideData.damage = Infinity;
    this._initExplodeEffect();
    this._initHealthBar();
  }

  _initHealthBar() {
    this.healthBar = new HealthBar(60, 6);
    this.healthBar.x = -30;
    this.healthBar.y = 50;
    this.healthBar.visible = false;
    this.addAnimator(this.healthBar);
  }

  update(dt) {
    this.healthBar.update(this.body.hp, this.body.maxHP);
  }

  _initExplodeEffect() {
    this.fxExplode = new ExplodeEffect();
    this.fxExplode.scale.set(1.5);
    this.fxExplode.y = -25;
    this.addChild(this.fxExplode);
  }

  die() {
    super.die();
    if (this.sprite) {
      this.sprite.visible = false;
    }

    if (this.animator) {
      this.animator.visible = false;
    }

    this.fxExplode.play();
  }

  addWeapon(weapon) {
    this.weapon = weapon;
    this.addChild(this.weapon);
  }

  addSprite(sprite) {
    this.sprite = sprite;
    this.addChild(sprite);
  }

  addAnimator(animator) {
    this.animator = animator;
    this.addChild(this.animator);
    if (this.animator.skeleton) {
      this.animator.state.addListener({ complete: this.onAnimationComplete.bind(this) });
      this.on(EnemyEvent.Hitted, this.playHittedAnimation, this);
    }
    else if (this.animator.anim || this.animator) {
      this.on(EnemyEvent.Hitted, this.playHitAnimation, this);
    }
  }

  playHitAnimation() {
    this.healthBar.visible = true;
    let tweenhitAnimation = Tween.createTween(this.animator, {
      tint: 0xbc5d5d,
    }, {
      duration : 0.1,
      repeat   : 1,
      yoyo     : true,
    }).start();
    let tweenDelayDisable = Tween.createCountTween({
      duration   : 0.3,
      onComplete : () => {
        this.healthBar.visible = false;
      },
    });
    tweenhitAnimation.chain(tweenDelayDisable);
    tweenhitAnimation.start();
  }

  playHittedAnimation() {
    this.healthBar.visible = true;
    this.animator.state.setEmptyAnimation(1, 0);
    this.animator.state.addAnimation(1, "Hitted", false, 0);
  }

  onAnimationComplete(track) {
    this.healthBar.visible = false;
    if (track.animation.name === "Hitted") {
      this.updateSkin();
    }
  }

  updateSkin() {
    if (this.body.remainPercent > 50) {
      this.animator.skeleton.setSkinByName("Idle");
    }
    else if (this.body.remainPercent > 20) {
      this.animator.skeleton.setSkinByName("50HP");
    }
    else {
      this.animator.skeleton.setSkinByName("0HP");
    }
  }

  shoot() {
    this.weapon?.shoot();
  }
}
