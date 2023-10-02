import { AssetManager } from "../../../assetManager";
import { GameConstant } from "../../../gameConstant";
import { SpineAnimator } from "../../../integrate/spineAnimator";
import { Tween } from "../../../systems/tween/tween";
import { BoosterType } from "../boosters/boosterType";
import { MeleeWave } from "./meleeWave";

export class Wave2 extends MeleeWave {
  constructor(boosterSpawner, target) {
    super(target);
    this.intervalEnabled = false;
    this.tweens = [];
    this.boosterSpawnedCount = 0;
    this.boosterSpawner = boosterSpawner;
    this._initEnemies();
  }

  _initEnemies() {
    this.groupLeft = new PIXI.Container();
    this.groupRight = new PIXI.Container();
    this.addChild(this.groupLeft);
    this.addChild(this.groupRight);

    for (var i = 0; i < 5; i++) {
      var y = - 100 * i - 100;
      this.addEnemyRow(this.groupLeft, 4, 0, y, -100);
    }

    for (var i = 0; i < 5; i++) {
      var y = - 100 * i - 100;
      this.addEnemyRow(this.groupRight, 3, 100, y, 100);
    }

    this.groupLeft.x = -1000;
    this.groupLeft.y = -1000;
    this.groupRight.x = 1000;
    this.groupRight.y = -1000;
  }

  start() {
    let groupLeftTween = Tween.createTween(
      this.groupLeft,
      {
        x: 0,
        y: 0
      }, {
      duration: 1,
      onComplete: () => {
        this.onTweenComplete(groupLeftTween);
        this.onIntroComplete();
      }
    });

    let groupRightTween = Tween.createTween(this.groupRight,
      {
        x: 0,
        y: 0
      }, {
      duration: 1,
      onComplete: () => this.onTweenComplete(groupRightTween),
    });

    groupLeftTween.start();
    groupRightTween.start();
    this.tweens.push(groupLeftTween, groupRightTween);
  }

  onIntroComplete() {
    this.intervalEnabled = true;
    this.enemies.forEach(enemy => enemy.collider.enabled = true);
  }

  onEnemyDie(enemy) {
    super.onEnemyDie(enemy);
    if (this.boosterSpawnedCount < 1) {
      this.boosterSpawnedCount++;
      this.boosterSpawner.spawnBooster(BoosterType.Power, enemy.getGlobalPosition());
    }

    if (this.enemies.length === 0) {
      this.boosterSpawner.spawnBooster(BoosterType.PurpleShip, enemy.getGlobalPosition());
    }
  }

  pause() {
    super.pause();
    this.tweens.forEach(tween => tween.pause());
    this.enemies.forEach(enemy => enemy.animator.pause());
  }

  resume() {
    super.resume();
    this.tweens.forEach(tween => tween.resume());
    this.enemies.forEach(enemy => enemy.animator.resume());
  }

  addEnemyRow(group, count, x, y, margin) {
    for (var i = 0; i < count; i++) {
      var enemy = this.addEnemy();
      group.addChild(enemy);
      enemy.x = x + margin * i;
      enemy.y = y;
    }
  }

  addEnemy() {
    let enemy = super.addEnemy();
    enemy.body.hp = GameConstant.WAVE_2_ENEMY_HP;
    enemy.collider.y = 10;
    enemy.collider.enabled = false;

    let animator = new SpineAnimator(AssetManager.spines.enemyYellow);
    animator.state.setAnimation(0, "Yellow_Idle", true);
    enemy.addAnimator(animator);
    return enemy;
  }
}