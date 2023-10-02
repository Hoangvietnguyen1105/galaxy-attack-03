import { AssetManager } from "../../../assetManager";
import { GameConstant } from "../../../gameConstant";
import { RandomNumber } from "../../../helpers/randomNumber";
import { Util } from "../../../helpers/utils";
import { SpineAnimator } from "../../../integrate/spineAnimator";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { Tween } from "../../../systems/tween/tween";
import { WeaponBase } from "../weapons/weaponBase";
import { CommonWave } from "./commonWave";

export class Wave5 extends CommonWave {
  constructor() {
    super();
    this.spawnTween = Tween.createCountTween({
      duration: 1,
      repeat: 5,
      onStart:() => this.addEnemyWave(),
      onRepeat: () => this.addEnemyWave()
    });
  }

  start() {
    this.spawnTween.start();
  }

  addEnemyWave() {
    let startX = -GameConstant.GAME_WIDTH / 2 + 50;
    let startY = -GameResizer.height / 2 - 300;
    let marginX = 90;
    let marginY = 200;
    let numEnemy = Math.floor(Math.abs(GameConstant.GAME_WIDTH / marginX));
    for (var i = 0; i < numEnemy; i++) {
      var spineData = Util.randomFromList([
        AssetManager.spines.enemyGreen,
        AssetManager.spines.enemyPurple
      ]);
      var enemy = this.addEnemy(spineData);
      enemy.x = startX + i * marginX;
      enemy.y = startY + Util.random(-marginY, marginY);
      this.moveEnemy(enemy);
    }
  }

  moveEnemy(enemy) {
    let targetPos = this.getTargetPosition(enemy);
    let distance = new PIXI.Point(targetPos.x - enemy.x, targetPos.y - enemy.y);
    let distanceLength = Util.lengthOfVector(distance);
    let duration = distanceLength / GameConstant.WAVE_5_ENEMY_SPEED;
    enemy.moveTween = Tween.createTween(enemy, { x: targetPos.x, y: targetPos.y }, {
      duration: duration,
      onComplete: () => this.moveEnemy(enemy)
    }).start();
  }

  pause() {
    this.spawnTween.pause();
    this.enemies.forEach(enemy => enemy.moveTween.pause());
  }

  resume() {
    this.spawnTween.resume();
    this.enemies.forEach(enemy => enemy.moveTween.resume());
  }

  addEnemy(spineData) {
    let enemy = super.addEnemy();
    enemy.body.setHP(GameConstant.WAVE_5_ENEMY_HP);

    let animator = new SpineAnimator(spineData);
    animator.state.setAnimation(0, "Idle", true);
    animator.skeleton.setSkinByName("Idle");
    enemy.addAnimator(animator);

    let weapon = new WeaponBase(this.enemyBullet);
    enemy.addWeapon(weapon);

    this.addChild(enemy);
    return enemy;
  }

  getTargetPosition(enemy) {
    let width = GameConstant.GAME_WIDTH / 2;
    let height = GameResizer.height / 2;
    let left = new PIXI.Point(-width, Util.random(-height, 0));
    let right = new PIXI.Point(width, Util.random(-height, 0));
    let top = new PIXI.Point(Util.random(-width, width), -height);
    let bottom = new PIXI.Point(Util.random(-width + 150, width - 150), height / 2);

    if (enemy.y > 0) { // bottom
      return Util.randomFromList([left, right, bottom]);
    }
    else if (enemy.y <= -height) { // top
      if (enemy.x < 0) {
        return Util.randomFromList([left, bottom]);
      }
      else {
        return Util.randomFromList([right, bottom]);
      }
    }
    else if (enemy.x <= -width) { // left
      return bottom;
    }
    else if (enemy.x >= width) { // right
      return bottom;
    }
    else {
      return Util.randomFromList([left, right, top, bottom]);
    }
  }
}