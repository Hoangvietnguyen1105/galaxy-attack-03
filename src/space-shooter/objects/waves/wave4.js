import { Container, Texture } from "pixi.js";
import { AssetManager } from "../../../assetManager";
import { GameConstant } from "../../../gameConstant";
import { RandomNumber } from "../../../helpers/randomNumber";
import { Util } from "../../../helpers/utils";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { GameState, GameStateManager } from "../../../pureDynamic/systems/gameStateManager";
import { Tween } from "../../../systems/tween/tween";
import { BoosterType } from "../boosters/boosterType";
import { VelocityBullet } from "../bullets/velocityBullet";
import { EnemyGalaga } from "../enemies/enemyGalaga";
import { VoodooEnemy } from "../enemies/voodooEnemy";
import { WeaponBase } from "../weapons/weaponBase";
import { CommonWave } from "./commonWave";

export class Wave4 extends CommonWave {
  /**
   *
   * @param {BoosterSpawner} boosterSpawner
   */
  constructor(boosterSpawner) {
    super();
    this.boosterSpawner = boosterSpawner;
    this.boosterSpawnedCount = 0;
    this.enemyContainer = new Container();
    this.enemyContainer.y = -GameResizer.height + 200;
    this.addChild(this.enemyContainer);
    this._initBullet();
    this.interval = new RandomNumber(2, 3);

    this._initWaveMove();
  }

  _initWaveMove() {
    this.tweenMove = Tween.createTween(this.enemyContainer, { y: -300 }, {
      duration: 4,
    });
  }

  pause() {
    super.pause();
    this.tweenMove.pause();
  }

  resume() {
    super.resume();
    this.tweenMove.isPaused && this.tweenMove.resume();
  }

  update(dt) {
    super.update(dt);
    this.enemies.forEach((enemy) => this.moveEnemy(enemy, dt));
  }

  start() {
    this.boss = this.addBoss();
    this._initEnemies();
    this.tweenMove.start();
  }

  onInterval() {
    super.onInterval();
    if (GameStateManager.isState(GameState.Playing)) {
      let enemy = Util.randomFromList(this.enemies);
      enemy?.shoot();
    }
  }

  moveEnemy(enemy, dt) {
    enemy.movement.angle += enemy.movement.speed * dt;
    this.updateEnemyPosition(enemy);
  }

  updateEnemyPosition(enemy) {
    let y;
    if (enemy.type === "boss") {
      y = 50;
    }
    else {
      y = enemy.movement.radius * Math.sin(Util.toRadian(enemy.movement.angle));
    }
    enemy.x = enemy.movement.radius * Math.cos(Util.toRadian(enemy.movement.angle));
    enemy.y = y;
  }

  onEnemyDie(enemy) {
    super.onEnemyDie(enemy);
    if (this.boosterSpawnedCount < 1) {
      this.boosterSpawnedCount++;
      this.boosterSpawner.spawnBooster(BoosterType.LevelUp, enemy.getGlobalPosition());
    }

    this.increaseEnemiesSpeed();
  }

  increaseEnemiesSpeed() {
    this.enemies.forEach((enemy) => {
      enemy.movement.speed += GameConstant.WAVE_4_ENEMY_SPEED_INCREAMENT * Util.sign(enemy.movement.speed);
    });
  }

  _initEnemies() {
    let greenTexture = "anim_enemy_1";
    let purpleTexture = "anim_enemy_2";
    this.addEnemyGroup(greenTexture, 5, 0, 150, 44);
    this.addEnemyGroup(purpleTexture, 5, 36, 150, 44);
    this.addEnemyGroup(greenTexture, 10, 36, 230, -30);
    this.addEnemyGroup(purpleTexture, 10, 18, 300, -30);
  }

  addEnemyGroup(texture, count, startAngle, radius, speed) {
    let margin = 360 / count;
    for (var i = 0; i < count; i++) {
      this.addEnemy(texture, { radius, speed, angle: startAngle + margin * i }, "enemy");
    }
  }

  addBoss() {
    let boss = this.addEnemy(AssetManager.spines.enemyPurple, { radius: 0, speed: 10, angle: 10 }, "boss");
    boss.collider.height = 150;
    boss.collider.width = 100;
    boss.collider.y = 0;
    boss.body.setHP(GameConstant.WAVE_4_BOSS_HP);
    return boss;
  }

  addEnemy(texture, movement, type) {
    let enemy = super.addEnemy();
    enemy.movement = movement;
    enemy.body.setHP(GameConstant.WAVE_4_ENEMY_HP);
    this.updateEnemyPosition(enemy);

    let animator;
    if (type === "enemy") {
      animator = new EnemyGalaga(texture);
      animator.anim.animationSpeed = 0.3;
    }
    else if (type === "boss") {
      animator = new VoodooEnemy();
    }

    enemy.addAnimator(animator);
    enemy.type = type;
    let weapon = new WeaponBase(this.enemyBullet);
    enemy.addWeapon(weapon);

    this.enemyContainer.addChild(enemy);
    return enemy;
  }

  _initBullet() {
    let bulletCollider = new Collider(CollisionTag.EnemyBullet);
    bulletCollider.width = 30;
    bulletCollider.height = 50;
    bulletCollider.y = -30;

    let bulletTexture = Texture.from("bullet_enemy");
    this.enemyBullet = new VelocityBullet(bulletTexture, bulletCollider);
    this.enemyBullet.velocity.set(0, 350);
    this.enemyBullet.anchor.set(0.5, 0);
    this.enemyBullet.bulletScale.set(1, -1);
    this.enemyBullet.init(10);
    this.addChild(this.enemyBullet);
  }
}
