import { Game } from "../../../game";
import { Util } from "../../../helpers/utils";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { BulletBase } from "./bulletBase";

export class VelocityBullet extends BulletBase {
  constructor(texture, collider) {
    super();
    this.damage = 10;
    this.anchor = new PIXI.Point();
    this.velocity = new PIXI.Point();
    this.velocityExtends = new PIXI.Point();
    this.bulletScale = new PIXI.Point(1, 1);
    this.texture = texture;
    this.collider = collider;
    this.collider.enabled = false;
  }

  update() {
    super.update();
    this.dt = Game.app.ticker.deltaMS / 1000;
    this.bullets.forEach(bullet => {
      if (bullet.worldVisible) {
        bullet.x += bullet.velX * this.dt;
        bullet.y += bullet.velY * this.dt;
      }
    });
  }

  onCollide(bullet, collider) {
    this.despawn(bullet);
  }

  spawn(pos) {
    let bullet = super.spawn(pos);
    let extendX = Util.random(-this.velocityExtends.x, this.velocityExtends.x);
    let extendY = Util.random(-this.velocityExtends.y, this.velocityExtends.y);
    bullet.velX = this.velocity.x + extendX;
    bullet.velY = this.velocity.y + extendY;
    bullet.collider.enabled = true;
    bullet.angle = this._getAngle(bullet.velX, bullet.velY);
  }

  _getAngle(velX, velY) {
    if (velY === 0) {
      return 90;
    }

    let angle = Math.atan(-velX / velY);
    angle = Util.toDegree(angle);

    if (velY > 0) {
      angle += 180;
    }
    return angle;
  }

  despawn(bullet) {
    super.despawn(bullet);
    bullet.collider.enabled = false;
  }

  destroy() {
    super.destroy();
    this.bullets.forEach(bullet => {
      bullet.collider.destroy = false;
      bullet.destroy();
    });
    this.bullets = [];
  }

  create() {
    let bullet = super.create();
    let sprite = new PIXI.Sprite(this.texture);
    sprite.anchor.copyFrom(this.anchor);
    sprite.scale.copyFrom(this.bulletScale);
    bullet.addChild(sprite);

    // TODO: Improve spawn collider logic
    let collider = this.collider.clone();
    collider.collideData = {
      damage: this.damage
    };
    collider.on(CollisionEvent.OnCollide, collider2 => this.onCollide(bullet, collider2));
    bullet.collider = collider;
    bullet.addChild(collider);
    return bullet;
  }
}
