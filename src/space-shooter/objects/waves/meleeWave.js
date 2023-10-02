import { Util } from "../../../helpers/utils";
import { Tween } from "../../../systems/tween/tween";
import { Collider } from "../../../physics/aabb/collider";
import { EnemyEvent } from "../enemies/enemyEvent";
import { CommonWave } from "./commonWave";

export class MeleeWave extends CommonWave {
  /**
   * @param {Collider} target 
   */
  constructor(target) {
    super();
    this.target = target;
    this.tweens = [];
    this.attackOffset = 50;
    this._targetGlobal = new PIXI.Point();
    this._targetLocal = new PIXI.Point();
    this._distance = new PIXI.Point();
  }

  onInterval() {
    super.onInterval();
    let enemy = Util.randomFromList(this.enemies.filter(enemy => !enemy.attacking));
    enemy && this.playAttackAnimation(enemy);
  }

  pause() {
    super.pause();
    this.enemies.filter(enemy => {
      enemy.tweens.forEach(tween => tween.pause());
    });
  }

  resume() {
    super.resume();
    this.enemies.filter(enemy => {
      enemy.tweens.forEach(tween => tween.resume());
    });
  }

  playAttackAnimation(enemy) {
    enemy.attacking = true;
    this.target.getGlobalPosition(this._targetGlobal, true);
    enemy.parent.toLocal(this._targetGlobal, null, this._targetLocal, true);
    this._targetLocal.x += this.attackOffset * Util.sign(enemy.x - this._targetLocal.x);

    let tweenX = Tween.createTween(enemy, {
      x: this._targetLocal.x}, {
      duration: 1.5,
      easing: Tween.Easing.Sinusoidal.In,
      onComplete: this.onTweenComplete(tweenX),
    }).start();

    let tweenDown = Tween.createTween(enemy, { y: this._targetLocal.y }, {
      easing: Tween.Easing.Back.In,
      duration: 1.5,
      onComplete: () => this.onTweenComplete(tweenDown),
    }).start();

    let enemyY = enemy.y;
    let enemyX = enemy.x;
    enemy.x = this._targetLocal.x
    enemy.y = this._targetLocal.y;
    let tweenUp = Tween.createTween(enemy, { x: enemyX, y: enemyY }, {
      duration: 1.2,
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

  onEnemyDie(enemy) {
    super.onEnemyDie(enemy);
    enemy.tweens.forEach(tween => tween.stop());
  }

  addEnemy() {
    let enemy = super.addEnemy();
    enemy.tweens = [];
    return enemy;
  }
}