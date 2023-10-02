import { RandomNumber } from "../../../helpers/randomNumber";
import { SoundManager } from "../../../soundManager";
import { ContainerSpawner } from "../../../systems/spawners/containerSpawner";
import { HitEffect } from "../effects/hitEffect";
import { CommonEnemy } from "../enemies/commonEnemy";
import { EnemyEvent } from "../enemies/enemyEvent";
import { Wave } from "./wave";
import { WaveEvent } from "./waveEvent";

export class CommonWave extends Wave {
  constructor() {
    super();
    /** @type {Array<CommonEnemy>} */
    this.enemies = [];

    this.intervalEnabled = true;
    this.interval = new RandomNumber(0, 1);
    this._currInterval = this.interval.random();
    this._currTime = 0;
  }

  update(dt) {
    super.update(dt);
    if (!this.intervalEnabled) {
      return;
    }

    this._currTime += dt;
    while (this._currTime >= this._currInterval) {
      this._currTime -= this._currInterval;
      this._currInterval = this.interval.random();
      this.onInterval();
    }
  }

  _initHitSpawner(container) {
    this.fxHitSpawner = new ContainerSpawner();
    this.fxHitSpawner.init(this._createHitEffect.bind(container), 2);
  }

  _spawnHitFx(enemy, container) {
    let fx = this.fxHitSpawner.spawn(container);
    fx.x = enemy.x;
    fx.y = enemy.y + 25;
    fx.play();
  }

  _createHitEffect() {
    let fxHit = new HitEffect();
    fxHit.scale.set(2);
    fxHit.speed = 2;
    return fxHit;
  }


  pause() {
    super.pause();
    this.intervalEnabled = false;
  }

  resume() {
    super.resume();
    this.intervalEnabled = true;
  }

  onInterval() {
  }

  onEnemyDie(enemy) {
    SoundManager.play("sfx_enemy_explode", 0.25);
    this.enemies.splice(this.enemies.indexOf(enemy), 1);
    this.emit(WaveEvent.OnEnemyDie, enemy);
    if (this.enemies.length <= 0) {
      this.complete();
    }
  }

  addEnemy() {
    let enemy = new CommonEnemy();
    enemy.collider.width = 50;
    enemy.collider.height = 50;
    enemy.on(EnemyEvent.Die, this.onEnemyDie, this);
    this.enemies.push(enemy);
    return enemy;
  }
}
