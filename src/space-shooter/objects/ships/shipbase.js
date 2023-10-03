import { AssetManager } from "../../../assetManager";
import { GameConstant } from "../../../gameConstant";
import { Tween } from "../../../systems/tween/tween";
import { SpineAnimator } from "../../../integrate/spineAnimator";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { Body } from "../base/body";
import { BodyEvent } from "../base/bodyEvent";
import { WeaponEvent } from "../weapons/weaponEvent";
import { ShipEvent } from "./shipEvent";
import { HealthBar } from "../healthbar/healthBar";
import { CurvedHealthBar } from "../healthbar/curveBar";

export class ShipBase extends PIXI.Container {
  constructor(scene) {
    super();
    this.scene = scene;
    this.level = 0;
    this.weapons = [];
    this.smokes = [];

    this.body = new Body();
    this.body.on(BodyEvent.Die, this.die, this);
    this._initCollider();
    this._initHealthBar()
  }

  onStart() {
    this.collider.enabled = true;
    this.setLevel(0);
  }

  initBaseSprite(texture) {
    this.baseSprite = new PIXI.Sprite(texture);
    this.baseSprite.anchor.set(0.5);
    this.addChild(this.baseSprite);
  }

  initBaseAnimator(spineData) {
    this.baseAnimator = new SpineAnimator(spineData);
    this.addChild(this.baseAnimator);
  }
   _initHealthBar() {
    this.healthBar = new CurvedHealthBar(140, 6);
    this.healthBar.x = 0;
    this.healthBar.y = 50;
    this.addChild(this.healthBar);
    this.healthBar.visible = true;
    
  }
   update(dt) {
    console.log(this.body.hp)
    this.healthBar.update(this.body.hp, this.body.maxHP);
  }

  onCollide(collider) {
    let damage = collider.collideData.damage;
    if (damage) {
      if(this.body.hp <= -50)
        damage = 0
      this.body.takeDamage(damage);
      if(!this.body.immortal)
        this.playImmortalEffect(0.5)
    }

    let levelup = collider.collideData.levelup;
    if (levelup) {
      this.setLevel(this.level + levelup);
      this.emit(ShipEvent.CollectBooster);
    }

    if (collider.collideData.power) {
      this.onPower();
    }

    if (collider.collideData.ship) {
      this.collectShip(collider.collideData.ship);
    }
  }

  collectShip(ship) {
    this.emit(ShipEvent.CollectBooster);
    this.emit(ShipEvent.CollectShip, ship);
  }

  onPower() {
    this.emit(ShipEvent.PowerUp);
    this.emit(ShipEvent.CollectBooster);
  }

  setLevel(level) {
    this.level = level;
  }

  die() {
    // this.visible = false;
    // this.collider.enabled = false;
    this.emit(ShipEvent.Die);
  }

  revive() {
    this.visible = true;
    this.body.hp = 1;
    this.collider.enabled = true;
    this.setLevel(this.level);
  }

  playImmortalEffect(duration) {
    this.body.immortal = true;
    let target = this.baseSprite || { alpha };
    let repeat = duration / GameConstant.SHIP_FX_IMMORTAL_DURATION;
    this.immortalTween = Tween.createTween(target, { alpha: 0 }, {
      duration: GameConstant.SHIP_FX_IMMORTAL_DURATION,
      repeat,
      yoyo: true,
      easing: Tween.Easing.Sinusoidal.InOut,
      onComplete: () => {
        target.alpha = 1;
        this.body.immortal = false;
      }
    }).start();
    
    this.smokes.forEach(smoke => this._playSmokeImmortalEffect(smoke, duration));
  }

  _playSmokeImmortalEffect(smoke, duration) {
    let repeat = duration / GameConstant.SHIP_FX_IMMORTAL_DURATION;
    this.immortalTween = Tween.createTween(smoke, { alpha: 0 }, {
      duration: GameConstant.SHIP_FX_IMMORTAL_DURATION,
      repeat,
      yoyo: true,
      easing: Tween.Easing.Sinusoidal.InOut,
      onComplete: () => { smoke.alpha = 1 }
    }).start();
  }

  onWin() {
    this.collider.enabled = false;
    this.disableWeapons();
  }

  disableWeapons() {
    this.weapons.forEach(weapon => {
      weapon.enabled = false;
      weapon.off(WeaponEvent.Shoot, this.onWeaponShoot, this);
    });
  }

  destroy() {
    super.destroy();
    this.collider.enabled = false;
    this.weapons.forEach(weapon => {
      weapon.destroy();
      weapon.bullet.destroy();
    });
  }

  addSmoke(texture, x, y, scaleX = 1, scaleY = 1, alpha = 1) {
    let smoke = new PIXI.Sprite(texture);
    smoke.blendMode = PIXI.BLEND_MODES.ADD;
    smoke.anchor.set(0.5, 0);
    smoke.scale.set(scaleX, scaleY);
    smoke.alpha = alpha;
    smoke.x = x;
    smoke.y = y;
    this.addChild(smoke);
    this.smokes.push(smoke);

    smoke.tween = Tween.createTween(smoke.scale, { y: scaleY / 2 }, {
      duration: 0.03,
      loop: true,
      yoyo: true,
    }).start();
    return smoke;
  }

  _initCollider() {
    this.collider = new Collider(CollisionTag.Ship);
    this.collider.enabled = false;
    this.collider.on(CollisionEvent.OnCollide, this.onCollide, this);
    this.addChild(this.collider);
  }
}
