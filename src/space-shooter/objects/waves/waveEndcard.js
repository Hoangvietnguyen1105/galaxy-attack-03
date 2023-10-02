import { Container, Texture } from "pixi.js";
import { Util } from "../../../helpers/utils";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { VelocityBullet } from "../bullets/velocityBullet";
import { CommonWave } from "./commonWave";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import waveEndCardData from "../../../../assets/jsons/waveEndcardData.json";
import { GameConstant } from "../../../gameConstant";
import { WeaponBase } from "../weapons/weaponBase";
import { GameState, GameStateManager } from "../../../pureDynamic/systems/gameStateManager";
import { Tween } from "../../../systems/tween/tween";
import { InferiorEnemy } from "../enemies/enemyInferior";
import { SaturationEnemy } from "../enemies/saturationEnemy";
import { GreenEnemy } from "../enemies/greenEnemy";
import { NaEnemy } from "../enemies/enemyNa";
import { DiverEnemy } from "../enemies/enemyDiver";

export class WaveEndCard extends CommonWave {
  constructor() {
    super();
    this.interval.max = 5;
    this._initBullet();
    this._initHitSpawner(this.waveContainer);
  }

  pause() {
    super.pause();
  }

  resume() {
    super.resume();
  }

  update(dt) {
    super.update(dt);
    this.enemies.forEach((enemy) => {
      enemy.update(dt);
    });
  }

  onInterval() {
    super.onInterval();
    if (GameStateManager.isState(GameState.Playing)) {
      let enemy = Util.randomFromList(this.enemies);
      enemy?.shoot();
    }
  }

  onEnemyDie(enemy) {
    super.onEnemyDie(enemy);
    this._spawnHitFx(enemy, this.waveContainer);
  }

  _initBullet() {
    let bulletCollider = new Collider(CollisionTag.EnemyBullet);
    bulletCollider.width = 30;
    bulletCollider.height = 30;
    bulletCollider.y = -70;

    let bulletTexture = Texture.from("bullet_enemy");
    this.enemyBullet = new VelocityBullet(bulletTexture, bulletCollider);
    this.enemyBullet.velocity.set(0, 350);
    this.enemyBullet.anchor.set(0.5, 0);
    this.enemyBullet.bulletScale.set(1, -1);
    this.enemyBullet.init(10);
    this.addChild(this.enemyBullet);
  }

  _initEnemies() {
    this.waveContainer = new Container();
    this.addChild(this.waveContainer);
    this.waveContainer.y = -GameResizer.height / 2 - 100;
    waveEndCardData.turn1.forEach((data) => {
      this._addEnemy(data, 0.2);
    });

    waveEndCardData.turn2.forEach((data) => {
      this._addEnemy(data, 0.7);
    });

    waveEndCardData.turn3.forEach((data) => {
      this._addEnemy(data, 0.9);
    });
  }

  start() {
    super.start();
    this._initEnemies();
    Tween.createCountTween({
      duration   : 1.2,
      onComplete : () => {
        this.complete();
      },
    }).start();
  }

  _addEnemy(enemyData, delay) {
    let enemy = super.addEnemy();
    if (enemyData.type === "inferior") {
      enemy.ship = this._createInferiorEnemy(enemy);
    }
    else if (enemyData.type === "saturation") {
      enemy.ship = this._createSaturationEnemy(enemy);
    }
    else if (enemyData.type === "green") {
      enemy.ship = this._createGreenEnemy(enemy);
    }
    else if (enemyData.type === "na") {
      enemy.ship = this._createNaEnemy(enemy);
    }
    else if (enemyData.type === "diver") {
      enemy.ship = this._createDiverEnemy(enemy);
    }
    enemy.body.setHP(GameConstant.WAVE_2_ENEMY_HP);

    let weapon = new WeaponBase(this.enemyBullet);
    enemy.addWeapon(weapon);
    enemy.body.setHP(GameConstant.WAVE_3_ENEMY_HP);
    enemy.scale.set(GameConstant.ENEMY_SIZE * 0.9);
    this._createAnimationEnemy(enemy, enemyData, delay);
    this.waveContainer.addChild(enemy);
    return enemy;
  }

  _createAnimationEnemy(enemy, enemyData, delay) {
    let target = enemyData.pos;
    Tween.createTween(enemy, {
      x: target.x,
    }, {
      duration : 0.8,
      delay,
      easing   : Tween.Easing.Sinusoidal.Out,
    }).start();
    Tween.createTween(enemy, {
      y: target.y,
    }, {
      duration   : 0.8,
      delay,
      easing     : Tween.Easing.Sinusoidal.Out,
      onComplete : () => {
      },
    }).start();
  }

  _createDiverEnemy(enemy) {
    let ship = new DiverEnemy();
    enemy.addAnimator(ship);
    return ship;
  }

  _createNaEnemy(enemy) {
    let ship = new NaEnemy();
    enemy.addAnimator(ship);
    return ship;
  }

  _createGreenEnemy(enemy) {
    let ship = new GreenEnemy();
    enemy.addAnimator(ship);
    return ship;
  }

  _createSaturationEnemy(enemy) {
    let ship = new SaturationEnemy();
    enemy.addAnimator(ship);
    return ship;
  }

  _createInferiorEnemy(enemy) {
    let ship = new InferiorEnemy();
    enemy.addAnimator(ship);
    return ship;
  }

}
