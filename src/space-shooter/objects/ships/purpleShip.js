import { GameConstant } from "../../../gameConstant";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { SoundManager } from "../../../soundManager";
import { LaserBullet } from "../bullets/laserBullet";
import { VelocityBullet } from "../bullets/velocityBullet";
import { IntervalWeapon } from "../weapons/intervalWeapon";
import { WeaponBase } from "../weapons/weaponBase";
import { WeaponEvent } from "../weapons/weaponEvent";
import { ShipBase } from "./shipbase";

export class PurpleShip extends ShipBase {
  constructor(scene) {
    super(scene);
    this._initWeapons();
    this._initSmokes();
    this.initBaseSprite(PIXI.Texture.from("ship_phoenix_dark"));
    this.collider.y = 30;
  }

  setLevel(level) {
    super.setLevel(level);
    this.laserWeapon.shoot();
    this.enableWeapon(this.leftWeapon, -50, -50 , -300, -2000);
    this.enableWeapon(this.rightWeapon, 50, -50, 300, -2000);
  }

  enableWeapon(weapon, x, y, velX, velY) {
    weapon.enabled = true;
    weapon.x = x;
    weapon.y = y;
    weapon.bullet?.velocity.set(velX, velY);
    weapon.reset();
  }

  _initWeapons() {
    this.laserWeapon = this.addLaserWeapon();
    this.leftWeapon = this.addVelocityWeapon();
    this.rightWeapon = this.addVelocityWeapon();

    this.leftWeapon.on(WeaponEvent.Shoot, this.onWeaponShoot, this);
  }

  onWeaponShoot() {
    SoundManager.play("sfx_shoot", 0.25);
  }

  addLaserWeapon() {
    let bullet = new LaserBullet(PIXI.Texture.from("bullet_laser"));
    bullet.init(1);
    let weapon = new WeaponBase(bullet);
    weapon.addChild(bullet);
    this.addChild(weapon);
    weapon.y = -80;
    this.weapons.push(weapon);
    return weapon
  }

  addVelocityWeapon() {
    let bulletCollider = new Collider(CollisionTag.ShipBullet);
    bulletCollider.width = 20;
    bulletCollider.height = 50;
    bulletCollider.y = -60;

    let bulletTexture = PIXI.Texture.from("bullet_purple");
    let bullet = new VelocityBullet(bulletTexture, bulletCollider);
    bullet.damage = GameConstant.SHIP_PURPLE_BULLET_DAMAGE;
    bullet.anchor.set(0.5, 0.9);
    bullet.init(10);
    this.scene.addChild(bullet);

    let weapon = new IntervalWeapon(bullet);
    weapon.enabled = false;
    weapon.interval = 1;
    weapon.shootCount = 3;
    weapon.shootInterval = 0.1;
    this.addChild(weapon);
    this.weapons.push(weapon);
    return weapon;
  }

  _initSmokes() {
    let texture = PIXI.Texture.from("smoke_blue");
    this.smokeLeft = this.addSmoke(texture, -15, 50, 1, 0.9, 1);
    this.smokeRight = this.addSmoke(texture, 15, 50, 1, 0.9, 1);
  }
}