import { Game } from "../../../game";
import { GameConstant } from "../../../gameConstant";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { GameState, GameStateManager } from "../../../pureDynamic/systems/gameStateManager";
import { BulletBase } from "./bulletBase";

export class LaserBullet extends BulletBase {
  constructor(texture) {
    super();
    this.texture = texture;

    this.dps = GameConstant.BULLET_LASER_DPS;
    this._target = null;
    this._tmpTargetGlobalPos = new PIXI.Point();
    this._tmpColliderGlobalPos = new PIXI.Point();
  }

  destroy() {
    super.destroy();
    this.bullets.forEach(bullet => {
      bullet.detectCollider.destroy();
      bullet.dpsCollider.destroy();
      bullet.destroy();
    });
    this.bullets = [];
  }

  update() {
    super.update();
    if (GameStateManager.isState(GameState.Paused)) {
      return;
    }

    this.dt = Game.app.ticker.deltaMS / 1000;
    this.getGlobalPosition(this._tmpGlobalPos, true);
    this.bullets.forEach(bullet => this._updateBullet(bullet));

    this._target = null;
  }

  _updateBullet(bullet) {
    bullet.dpsCollider.collideData.damage = this.dps * this.dt;
    bullet.detectCollider.height = this._tmpGlobalPos.y;
    if (this._target) {
      this._target.getGlobalPosition(this._tmpTargetGlobalPos, true);
      this.setBulletHeight(bullet, this._tmpGlobalPos.y - this._tmpTargetGlobalPos.y);
    }
    else {
      this.setBulletHeight(bullet, this._tmpGlobalPos.y);
    }
  }

  setBulletHeight(bullet, height) {
    bullet.sprite.height = height;
    bullet.sprite.y = -height;
    bullet.dpsCollider.height = height;
  }

  onDetectionCollide(collider) {
    if (!this._target) {
      this._target = collider;
      return;
    }

    collider.getGlobalPosition(this._tmpColliderGlobalPos, true);
    this._target.getGlobalPosition(this._tmpTargetGlobalPos, true);
    if (this._tmpTargetGlobalPos.y < this._tmpColliderGlobalPos.y) {
      this._target = collider;
    }
  }

  create() {
    let bullet = super.create();
    let sprite = new PIXI.NineSlicePlane(this.texture, 0, 5, 0, 1);
    sprite.width *= 1.2;
    bullet.sprite = sprite;
    bullet.sprite.x = -bullet.sprite.width / 2;
    bullet.addChild(sprite);

    let detectionCollider = new Collider(CollisionTag.ShipBullet);
    detectionCollider.width = 40;
    detectionCollider.anchor.set(0.5, 1);
    detectionCollider.on(CollisionEvent.OnCollide, this.onDetectionCollide, this);
    detectionCollider.visible = false;
    bullet.detectCollider = detectionCollider;
    bullet.addChild(bullet.detectCollider);

    let dpsCollider = new Collider(CollisionTag.ShipBullet);
    dpsCollider.width = 40;
    dpsCollider.height = 115;
    dpsCollider.anchor.set(0.5, 1);
    bullet.dpsCollider = dpsCollider;
    bullet.addChild(bullet.dpsCollider);
    return bullet;
  }
}