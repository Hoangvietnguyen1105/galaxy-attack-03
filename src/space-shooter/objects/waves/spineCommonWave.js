import { SpineAnimator } from "../../../integrate/spineAnimator";
import { EnemyEvent } from "../enemies/enemyEvent";
import { CommonWave } from "./commonWave";

export class SpineCommonWave extends CommonWave {
  constructor(data) {
    super();
    this.spine = new SpineAnimator(data);
    this.addChild(this.spine);
  }

  update(dt) {
    super.update(dt);
    this.enemies.forEach(enemy => this.updateEnemy(enemy));
  }

  onEnemyDie(enemy) {
    super.onEnemyDie(enemy);
    this.spine.disableBone(enemy.bone);
  }

  updateEnemy(enemy) {
    enemy.x = enemy.bone.worldX;
    enemy.y = enemy.bone.worldY;
  }

  addEnemy(bone) {
    let enemy = super.addEnemy();
    enemy.bone = bone;
    return enemy;
  }

  pause() {
    super.pause();
    this.spine.pause();
  }

  resume() {
    super.resume();
    this.spine.resume();
  }
}