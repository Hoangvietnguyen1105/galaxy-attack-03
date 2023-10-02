import { Container, Texture } from "pixi.js";
import { Util } from "../../../helpers/utils";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { BoosterType } from "../boosters/boosterType";
import { VelocityBullet } from "../bullets/velocityBullet";
import { CommonWave } from "./commonWave";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import wave1Data from "../../../../assets/jsons/wave1Data.json";
import { EnemyGalaga } from "../enemies/enemyGalaga";
import TWEEN from "@tweenjs/tween.js";
import { Time } from "../../../systems/time/time";
import { GameConstant } from "../../../gameConstant";
import { WeaponBase } from "../weapons/weaponBase";
import { GameState, GameStateManager } from "../../../pureDynamic/systems/gameStateManager";
import { SoldierEnemy } from "../enemies/soldierEnemy";
import { Tween } from "../../../systems/tween/tween";

export class Wave6 extends CommonWave {
  constructor(target,boosterSpawner) {
    super();
    this.y = -GameResizer.height * 0.45;
    this.interval.max = 2;
    this.enemiesDie = 0;
    this.boosterSpawnedCount = 0;
    this.countEnemy = 0;
    this._initBullet();
    this.boosterSpawner = boosterSpawner;

    this._initEnemy();
    console.log(target)
    this.target = target; 
    this.tweens = [];
    this.attackOffset = 50;
    this._targetGlobal = new PIXI.Point();
    this._targetLocal = new PIXI.Point();
    this._distance = new PIXI.Point();
    this._initHitSpawner(this.foreWave);
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
    playAttackAnimation(enemy) {
    enemy.attacking = true;
    this.target.getGlobalPosition(this._targetGlobal, true);
    enemy.parent.toLocal(this._targetGlobal, null, this._targetLocal, true);
    this._targetLocal.x += this.attackOffset * Util.sign(enemy.x - this._targetLocal.x);

    let tweenX = Tween.createTween(enemy, {
      x: this._targetLocal.x}, {
      duration: 2,
      easing: Tween.Easing.Sinusoidal.In,
      onComplete: () => this.onTweenComplete(tweenX),
    }).start();

    let tweenDown = Tween.createTween(enemy, { y: this._targetLocal.y}, {
      easing: Tween.Easing.Back.In,
      duration: 2,
      onComplete: () => this.onTweenComplete(tweenDown),
    }).start();

    let enemyY = enemy.y;
    let enemyX = enemy.x;
    enemy.x = this._targetLocal.x
    enemy.y = this._targetLocal.y;
    let tweenUp = Tween.createTween(enemy, { x: enemyX, y: enemyY }, {
      duration: 2,
      easing: Tween.Easing.Sinusoidal.InOut,
      onComplete: () => {
        enemy.attacking = false;
        this.onTweenComplete(tweenUp);
      },
    });

    enemy.x = enemyX;
    enemy.y = enemyY;
    tweenDown.chain(tweenUp);
    tweenDown.start();
    tweenX.start();
    enemy.tweens = [tweenX, tweenDown, tweenUp];
  }
 onTweenComplete(tween) {
    this.tweens.splice(this.tweens.indexOf(tween), 1);
  }


  onInterval() {
    super.onInterval();
    // if (GameStateManager.isState(GameState.Playing)) {
    //   let enemy = Util.randomFromList(this.enemies);
    //   enemy?.shoot();
    //if (GameStateManager.isState(GameState.Playing)) {
   // onInterval();
   if (GameStateManager.isState(GameState.Playing)) {
     
    let enemy = Util.randomFromList(this.enemies.filter(enemy => !enemy.attacking && enemy.ship.name === 'galaga'));
    enemy && this.playAttackAnimation(enemy);
    let enemy2 = Util.randomFromList(this.enemies.filter(enemy2 =>enemy2.ship.name !== 'galaga'));
    enemy2?.shoot();
   }
  }
  

  onEnemyDie(enemy) {
    super.onEnemyDie(enemy);
    this.enemiesDie++;
    if (this.enemiesDie === 1) {
      this.boosterSpawner.spawnBooster(BoosterType.LevelUp, enemy.getGlobalPosition());
    }
    else if (this.enemiesDie === 5) {
      this.boosterSpawner.spawnBooster(BoosterType.LevelUp, enemy.getGlobalPosition());
    }
    else if (this.enemiesDie === 15) {
      this.boosterSpawner.spawnBooster(BoosterType.LevelUp, enemy.getGlobalPosition());
    }
    // this._spawnHitFx(enemy, this.foreWave);
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
    this.foreWave = new Container();
    this.addChild(this.foreWave);

    let length = wave1Data.length;
    let delay = 0;

    // wave left
    for (let row = 0; row <= length - 1; row++) {
      let l = wave1Data[row].length;
      for (let col = 0; col < l; col++) {
        // eslint-disable-next-line max-depth
        if (wave1Data[row][col] === 1) {
          this.addEnemy(row, l - col, this.foreWave, true, delay, "red");
          this.addEnemy(row, l - col, this.foreWave, false, delay, "red");
          delay += 0.1;
        }
        else if (wave1Data[row][col] === 2) {
          this.addEnemy(row, l - col, this.foreWave, true, delay, "blue");
          this.addEnemy(row, l - col, this.foreWave, false, delay, "blue");
          delay += 0.1;
        }
        else if (wave1Data[row][col] === 11) {
          this.addEnemy(row, l - col, this.foreWave, true, delay, "red");
          delay += 0.1;
        }
        else if (wave1Data[row][col] === 12) {
          this.addEnemy(row, l - col, this.foreWave, false, delay, "red");
          delay += 0.1;
        }
      }
    }
  }

  start() {
    super.start();
  }

  addEnemy(row, col, waveContainer, isLeft = true, delay = 0, type = "blue") {
    let enemy = super.addEnemy();
    if (type === "blue") {
      enemy.ship = this._createNormalEnemy(enemy);
    }
    else {
      enemy.ship = this._createRedEnemy(enemy);
    }
    enemy.row = row;
    enemy.col = col;
    let direction = isLeft ? -1 : 1;
    enemy.x = (GameResizer.width / 2 + 100) * direction;
    enemy.y = GameResizer.height - 300;
    enemy.body.setHP(GameConstant.WAVE_1_ENEMY_HP);
    enemy.collider.y = 20;
    enemy.collider.height = 50;
    enemy.collider.width = 50;
    enemy.collider.enabled = false;
    enemy.scale.set(GameConstant.ENEMY_SIZE);
    let weapon = new WeaponBase(this.enemyBullet);
    enemy.addWeapon(weapon);
    this._createFormationAnimation(enemy, isLeft, delay);
    waveContainer.addChild(enemy);
    return enemy;
  }

  _createFormationAnimation(enemy, isLeft = true, delay = 0) {
    let direction = isLeft ? -1 : 1;
    let xTarget = enemy.col * 20 * direction - direction * 20;
    let yTarget = enemy.row * 40;

    let x0 = enemy.x;
    let y0 = enemy.y;

    let xA = [-GameResizer.width * direction ,xTarget];
    let yA = [GameResizer.height / 2, yTarget];

    let obj = { x: x0, y: y0, old: { x: x0, y: x0 } };
    new TWEEN.Tween(obj).to({ x: xA, y: yA }, 500)
      .onUpdate((object) => {
        enemy.x = object.x;
        enemy.y = object.y;
      })
      .interpolation(TWEEN.Interpolation.Bezier)
      .easing(TWEEN.Easing.Linear.None)
      .delay(delay * 1000)
      .onComplete(() => {
        this.countEnemy++;
        if (this.countEnemy >= this.enemies.length) {
          this.enemies.forEach((ene) => {
            ene.collider.enabled = true;
          });
        }
      })
      .start(Time.currentMS);
  }

  _createRedEnemy(enemy) {
    let ship = new SoldierEnemy();
    enemy.addAnimator(ship);
    return ship;
  }

  _createNormalEnemy(enemy) {
    let ship = new EnemyGalaga("anim_enemy_1");
    enemy.addAnimator(ship);
    return ship;
  }

}
