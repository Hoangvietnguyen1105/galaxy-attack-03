import { Container, Texture } from "pixi.js";
import { Util } from "../../../helpers/utils";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { VelocityBullet } from "../bullets/velocityBullet";
import { CommonWave } from "./commonWave";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import wave7Data from "../../../../assets/jsons/wave7Data.json";
import { GameConstant } from "../../../gameConstant";
import { WeaponBase } from "../weapons/weaponBase";
import { GameState, GameStateManager } from "../../../pureDynamic/systems/gameStateManager";
import { Tween } from "../../../systems/tween/tween";
import { InferiorEnemy } from "../enemies/enemyInferior";
import { SaturationEnemy } from "../enemies/saturationEnemy";
import { GreenEnemy } from "../enemies/greenEnemy";
import { NaEnemy } from "../enemies/enemyNa";
import { DiverEnemy } from "../enemies/enemyDiver";
import { Time } from "../../../systems/time/time";

export class Wave7 extends CommonWave {
  constructor(boosterSpawner) {
    super();
    this.y = -GameResizer.height * 0.45;
    this.tweens = [];
    this.interval.max = 1;
    this.enemiesDie = 0;
    this.boosterSpawnedCount = 0;
    this._initBullet();
    this.boosterSpawner = boosterSpawner;
    this._initHitSpawner(this.waveContainer);
  }

  pause() {
    super.pause();
    this.tweens.forEach((tween) => {
      tween?.pause();
    });
  }

  resume() {
    super.resume();
    this.tweens.forEach((tween) => {
      tween?.isPaused && tween.resume();
    });
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
    this.enemiesDie++;
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

  _initEnemy() {
    this.waveContainer = new Container();
    this.addChild(this.waveContainer);
    wave7Data.turn1.forEach((data) => {
      this.addEnemy(data, 0);
    });

    wave7Data.turn2.forEach((data) => {
      this.addEnemy(data, 0.8);
    });

    wave7Data.turn3.forEach((data) => {
      this.addEnemy(data, 1.6);
    });

    wave7Data.turn4.forEach((data) => {
      this.addEnemy(data, 2.4);
    });

    wave7Data.turn5.forEach((data) => {
      this.addEnemy(data, 3.2);
    });
  }

  _initWaveMove() {
    // this.waveContainer.y = GameResizer.height / 2;
    this.tweenMove = Tween.createCountTween({
      duration : GameConstant.WAVE_7_MOVE_DURATION,
      easing   : Tween.Easing.Sinusoidal.Out,
      onUpdate : () => {
        this.waveContainer.y += GameConstant.WAVE_7_MOVE_SPEED * Time.dt;
      },
      onComplete: () => {
        this.complete();
      },
    }).start();
    this.tweens.push(this.tweenMove);
  }

  complete() {
    super.complete();
    this.tweenMove.stop();
  }

  start() {
    super.start();
    this._initEnemy();
    this._initWaveMove();
  }

  addEnemy(enemyData, delay) {
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
    enemy.scale.set(GameConstant.ENEMY_SIZE);
    enemy.x = enemyData.pos.x;
    enemy.y = enemyData.pos.y;
    enemy.body.setHP(GameConstant.WAVE_2_ENEMY_HP);
    enemy.collider.y = 20;
    enemy.collider.height = 50;
    enemy.collider.width = 50;

    let weapon = new WeaponBase(this.enemyBullet);
    enemy.addWeapon(weapon);
    this._createAnimationEnemy(enemy, enemyData, delay);
    this.waveContainer.addChild(enemy);
    return enemy;
  }

  _createAnimationEnemy(enemy, enemyData, delay) {
    let target = enemyData.target;
    let tweenMoveX = Tween.createTween(enemy, {
      x: target.x,
    }, {
      duration : 0.6,
      delay,
      easing   : Tween.Easing.Sinusoidal.Out,
    }).start();
    let tweenMoveY = Tween.createTween(enemy, {
      y: target.y,
    }, {
      duration   : 0.4,
      delay,
      easing     : Tween.Easing.Sinusoidal.Out,
      onComplete : () => {
      },
    }).start();
    this.tweens.push(tweenMoveX);
    this.tweens.push(tweenMoveY);
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
