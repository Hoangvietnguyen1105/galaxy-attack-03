import { GameConstant } from "../../../gameConstant";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { SoundManager } from "../../../soundManager";
import { FrostBullet } from "../bullets/frostBullet";
import { VelocityBullet } from "../bullets/velocityBullet";
import { IntervalWeapon } from "../weapons/intervalWeapon";
import { WeaponEvent } from "../weapons/weaponEvent";
import { ShipBase } from "./shipbase";

export class BlueShip extends ShipBase {
  constructor(scene) {
    super(scene);
    this._initSmokes();
    this._initWeapons();
    this.initBaseSprite(PIXI.Texture.from("ship_blue_base"));
    this.collider.height = 120;
    this.collider.y = 30;
  }

  setLevel(level) {
    super.setLevel(level);
    this.weapons.forEach(weapon => weapon.enabled = true);
  }

  _initWeapons() {
    this.mainWeapon = this._addVelocityWeapon();
    this.rightWeapon = this._addFrostWeapon(1);
    this.leftWeapon = this._addFrostWeapon(-1);

    this.rightWeapon.on(WeaponEvent.Shoot, this.onWeaponShoot, this);
  }

  onWeaponShoot() {
    SoundManager.play("sfx_shoot", 0.25);
  }

  _addVelocityWeapon() {
    let bulletCollider = new Collider(CollisionTag.ShipBullet);
    bulletCollider.width = 20;
    bulletCollider.y = -80;

    let bulletTexture = PIXI.Texture.from("bullet_blue");
    let bullet = new VelocityBullet(bulletTexture, bulletCollider);
    bullet.damage = GameConstant.SHIP_GREEN_BULLET_DAMAGE;
    bullet.velocity.set(0, -1500);
    bullet.velocityExtends.set(120, 0);
    bullet.anchor.set(0.5, 0.9);
    bullet.init(20);
    this.scene.addChild(bullet);

    let weapon = new IntervalWeapon(bullet);
    this.addChild(weapon);
    weapon.interval = 0.03;
    weapon.enabled = false;
    weapon.y = -100;
    this.weapons.push(weapon);
    return weapon;
  }

  _addFrostWeapon(axis) {
    let bullet = new FrostBullet();
    bullet.axis = axis;
    bullet.init(1);
    this.scene.addChild(bullet);
    let weapon = new IntervalWeapon(bullet);
    weapon.enabled = false;
    this.addChild(weapon);
    weapon.x = 50 * axis;
    weapon.y = - 100;
    this.weapons.push(weapon);
    return weapon;
  }

  _initSmokes() {
    let texture = PIXI.Texture.from("smoke_blue");
    this.smokeLeft = this.addSmoke(texture, -50, 70, 0.8, 0.7, 1);
    this.smokeRight = this.addSmoke(texture, 50, 70, 0.8, 0.7, 1);
  }
}