import { Emitter } from "pixi-particles";
import { BulletBase } from "./bulletBase";
import frostBullet from "../../../../assets/particles/frostBullet.json";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { Tween } from "../../../systems/tween/tween";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";

export class FrostBullet extends BulletBase {
  constructor() {
    super();
    this.damage = GameConstant.BULLET_FROST_DAMAGE;
    this.axis = 1;
    this.rangeX = 100;
    this.durationX = 0.2;
    this.targetY = -2000;
    this.durationY = 1;
    this.tweens = [];
  }

  spawn(globalPos) {
    let bullet = super.spawn(globalPos);
    bullet.collider.collideData.damage = this.damage;
    bullet.collider.enabled = true;

    let particle = bullet.particle;
    particle.updateOwnerPos(bullet.x, bullet.y);
    particle.resetPositionTracking();
    particle.emit = true;

    this.playBulletMotion(bullet);
    return bullet;
  }

  despawn(bullet) {
    super.despawn(bullet);
    bullet.collider.enabled = false;
    bullet.particle.emit = false;
    bullet.tweens.forEach(t => t.stop());
  }

  playBulletMotion(bullet) {
    let particle = bullet.particle;
    let tweenX = Tween.createTween(bullet, {
      x: bullet.x + this.rangeX * this.axis
    }, {
      duration: this.durationX,
      easing: Tween.Easing.Cubic.Out,
      onUpdate: () => particle.updateOwnerPos(bullet.x, bullet.y),
    });

    let tweenY = Tween.createTween(bullet, {
      y: this.targetY
    }, {
      duration: this.durationY,
      onUpdate: () => particle.updateOwnerPos(bullet.x, bullet.y),
      easing: Tween.Easing.Sinusoidal.In,
      onComplete: () => this.despawn(bullet)
    });

    tweenX.start();
    tweenY.start();
    bullet.tweens = [tweenX, tweenY];
  }

  create() {
    let bullet = super.create();
    let snowflakeTexture = PIXI.Texture.from("snowflake");
    let blueGlowTexture = PIXI.Texture.from("glow_blue");
    let particle = new Emitter(this, [snowflakeTexture, blueGlowTexture], frostBullet);
    particle.autoUpdate = true;
    particle.emit = false;
    bullet.particle = particle;

    let collider = new Collider(CollisionTag.ShipBullet);
    collider.enabled = false;
    collider.width = 50;
    collider.height = 50;
    collider.on(CollisionEvent.OnCollide, () => this.despawn(bullet));
    bullet.collider = collider;
    bullet.addChild(collider);
    return bullet;
  }
}