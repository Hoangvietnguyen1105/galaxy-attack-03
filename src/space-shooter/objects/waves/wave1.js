import { Container, Texture } from "pixi.js";
import { GameConstant } from "../../../gameConstant";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { Tween } from "../../../systems/tween/tween";
import { BoosterType } from "../boosters/boosterType";
import { VelocityBullet } from "../bullets/velocityBullet";
import { EnemyGalaga } from "../enemies/enemyGalaga";
import { WeaponBase } from "../weapons/weaponBase";
import { CommonWave } from "./commonWave";
export class Wave1 extends CommonWave {
  constructor(boosterSpawner) {
    super();
    this.boosterSpawnedCount = 0;
    this._initBullet();
    this.boosterSpawner = boosterSpawner;
    this.numEnemyKilled = 0;
    this._initEnemies();
    for (let i = 0; i < this.enemies.length - 1; i++) {
      this.enemies[i].id = i;
      if (i === this.enemies.length - 2) {
        this.initEnemyMoveAnimation(this.enemies[i], this.enemies[0]);
      }
      else {
        this.initEnemyMoveAnimation(this.enemies[i], this.enemies[i + 1]);
      }
    }
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


  start() {
    super.start();
  }

  _initEnemies() {
    this.groupLeft = new Container();
    this.groupRight = new Container();
    this.groupTop = new Container();
    this.groupBottom = new Container();
    this.groupCenter = new Container();
    this.addChild(this.groupTop);
    this.addChild(this.groupLeft);
    this.addChild(this.groupBottom);
    this.addChild(this.groupRight);
    this.addChild(this.groupCenter);
    this.addEnemyRow(this.groupTop, 5, 200, -500, -100);
    this.addEnemyCol(this.groupLeft, 2, -200, -400, 100);
    this.addEnemyRow(this.groupBottom, 5, -200, -200, 100);
    this.addEnemyCol(this.groupRight, 2, 200, -300, -100);
    this.enemyRed = this.addEnemyRed();
    this.enemyRed.x = 0;
    this.enemyRed.y = -350;
    this.enemyRed.scale.set(1.5);
    this.groupCenter.addChild(this.enemyRed);
  }

  onEnemyDie(enemy) {
    this.numEnemyKilled++;
    super.onEnemyDie(enemy);
    if (this.boosterSpawnedCount < 1) {
      this.boosterSpawnedCount++;
      this.boosterSpawner.spawnBooster(BoosterType.LevelUp, enemy.getGlobalPosition());
    }
    if (this.numEnemyKilled === 5) {
      this.boosterSpawner.spawnBooster(BoosterType.LevelUp, enemy.getGlobalPosition());
    }
    if (this.enemies.length === 0) {
      this.boosterSpawner.spawnBooster(BoosterType.GreenShip, enemy.getGlobalPosition());
    }
  }

  initEnemyMoveAnimation(enemy, target) {
    enemyMoveTween?.stop();
    let enemyMoveTween = Tween.createTween(enemy, {
      x: target.x, y: target.y,
    }, {
      duration: 0.3,

      onComplete: () => {
        this.initEnemyShakeAnimation(enemy, target);
      },
    }).start();
  }

  initEnemyShakeAnimation(enemy, target) {
    let duration = 0.15;
    if (enemy.id % 2 === 0) {
      enemyShakeTween?.stop();
      let enemyShakeTween = Tween.createTween(enemy, {
        y: "+15",
      }, {
        duration   : duration,
        yoyo       : true,
        easing     : Tween.Easing.Cubic.In,
        repeat     : 1,
        onComplete : () => {
          this.initEnemyMoveAnimation(enemy, target);
        },
      }).start();
    }
    else {
      enemyShakeTween?.stop();
      let enemyShakeTween = Tween.createTween(enemy, {
        y: "-15",
      }, {
        duration   : duration,
        yoyo       : true,
        easing     : Tween.Easing.Cubic.In,
        repeat     : 1,
        onComplete : () => {
          this.initEnemyMoveAnimation(enemy, target);
        },
      }).start();
    }

  }

  addEnemyRow(group, count, x, y, margin) {
    for (var i = 0; i < count; i++) {
      var enemy = this.addEnemy();
      group.addChild(enemy);
      enemy.x = x + margin * i;
      enemy.y = y;
    }
  }

  addEnemyCol(group, count, x, y, margin) {
    for (var i = 0; i < count; i++) {
      var enemy = this.addEnemy();
      group.addChild(enemy);
      enemy.x = x;
      enemy.y = y + margin * i;
    }
  }

  addEnemy() {
    let weapon = new WeaponBase(this.enemyBullet);
    weapon.shouldShoot = false;
    this.on("shoot", () => {
      weapon.shouldShoot = true;
    });
    let enemy = super.addEnemy("", weapon);
    enemy.body.hp = GameConstant.WAVE_1_ENEMY_HP;
    enemy.collider.y = 10;

    let ship = new EnemyGalaga("enemy_01");
    ship.anim.scale.set(0.5);
    enemy.addAnimator(ship);
    return enemy;
  }

  addEnemyRed() {
    let weapon = new WeaponBase(this.enemyBullet);
    weapon.shouldShoot = false;
    this.on("shoot", () => {
      weapon.shouldShoot = true;
    });
    let enemy = super.addEnemy("", weapon);
    enemy.body.hp = GameConstant.WAVE_2_ENEMY_HP;
    enemy.collider.y = 10;

    let ship = new EnemyGalaga("enemy_02");
    ship.anim.scale.set(0.5);
    enemy.addAnimator(ship);
    return enemy;
  }
}
