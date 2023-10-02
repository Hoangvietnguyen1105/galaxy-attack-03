import { AssetManager } from "../../../assetManager";
import { GameConstant } from "../../../gameConstant";
import { Tween } from "../../../systems/tween/tween";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { SoundManager } from "../../../soundManager";
import { BulletEvent } from "../bullets/bulletEvent";
import { VelocityBullet } from "../bullets/velocityBullet";
import { IntervalWeapon } from "../weapons/intervalWeapon";
import { WeaponEvent } from "../weapons/weaponEvent";
import { ShipBase } from "./shipbase";
import { Texture } from "pixi.js";

export class GreenShip extends ShipBase {
  constructor(scene) {
    super(scene);
    this.addSmoke(Texture.from("smoke_blue"), 0, 90, 0.7, 1, 1);
    this.initBaseSprite(Texture.from("ship_phoenix_dark"));
    this.collider.y = 30;
    this.body.setHP(GameConstant.SHIP_HP);

    for (var i = 0; i < 11; i++) {
      this.addWeapon();
    }
  }

  die() {
    super.die();
    // this.weapons.forEach((weapon) => weapon.enabled = false);
  }


  setLevel(level) {
    super.setLevel(level);
    this._updateWeapons(this.level);
  }

  _updateWeapons(level) {
    this.disableWeapons();
    if (level === 0) {
      this.enableWeapon(this.weapons[0], 0, -90);
    }
    else if (level === 1) {
      this.enableWeapon(this.weapons[0], -15, -90);
      this.enableWeapon(this.weapons[1], 15, -90);
    }
    else if (level === 2) {
      this.enableWeapon(this.weapons[0], 0, -90);
      this.enableWeapon(this.weapons[1], -50, -40, 0);
      this.enableWeapon(this.weapons[2], 50, -40, 0);
      this._setIntervalWeapon(0.1);
    }
    else if (level === 3) {
      this.enableWeapon(this.weapons[0], 0, -90, 0);
      this.enableWeapon(this.weapons[1], 0, -90, 60);
      this.enableWeapon(this.weapons[2], 0, -90, -30);
      this.enableWeapon(this.weapons[3], 0, -90, 30);
      this.enableWeapon(this.weapons[4], 0, -90, -60);
      this._setIntervalWeapon(0.08);
    }
    this.weapons[0].on(WeaponEvent.Shoot, this.onWeaponShoot, this);
  }

  _setIntervalWeapon(interval) {
    this.weapons.forEach((weapon) => {
      weapon.interval = interval;
    });
  }

  onPower() {
    super.onPower();
    this.disableWeapons();
    this.setLevel(10);
  }

  enableWeapon(weapon, x, y, tweenX = 0, velX = 0, velY = -1500) {
    weapon.enabled = true;
    weapon.x = x;
    weapon.y = y;
    if (weapon.bullet) {
      weapon.bullet.velocity.set(velX, velY);
      weapon.bullet.tweenX = tweenX; // TODO: refactor bullet tween
    }
    weapon.reset();
  }

  addWeapon() {
    let bulletCollider = new Collider(CollisionTag.ShipBullet);
    bulletCollider.width = 20;
    bulletCollider.height = 100;
    bulletCollider.y = -60;

    let bullet = new VelocityBullet(PIXI.Texture.from("bullet_phoenix"), bulletCollider);
    bullet.anchor.set(0.5, 0.9);
    bullet.init(10);
    bullet.on(BulletEvent.Spawn, this.onSpawnBullet.bind(this));
    bullet.on(BulletEvent.Despawn, this.onDespawnBullet.bind(this));
    this.scene.addChild(bullet);

    let weapon = new IntervalWeapon(bullet);
    weapon.interval = 0.1;
    weapon.enabled = false;
    this.addChild(weapon);
    this.weapons.push(weapon);
  }

  onSpawnBullet(bulletSpawner, bullet) {
    // TODO: refactor bullet tween
    bullet.tweenMove?.stop();
    bullet.scale.set(GameConstant.REDUCE_SIZE_SHIP);
    bullet.tweenMove = Tween.createTween(bullet, { x: bullet.x + bulletSpawner.tweenX }, {
      duration: 0.2,
    }).start();
  }

  onDespawnBullet(bulletSpawner, bullet) {
    // TODO: refactor bullet tween
    bullet.tweenMove?.stop();
  }

  onWeaponShoot() {
    SoundManager.play("sfx_shoot", 0.25);
  }

  onWin() {
    super.onWin();
    this.disableWeapons();
  }
}
