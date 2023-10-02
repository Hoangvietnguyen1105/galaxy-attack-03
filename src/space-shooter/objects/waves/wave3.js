import { AssetManager } from "../../../assetManager";
import { GameConstant } from "../../../gameConstant";
import { BoosterType } from "../boosters/boosterType";
import { SpineCommonWave } from "./spineCommonWave";

export class Wave3 extends SpineCommonWave {
  constructor(boosterSpawner) {
    super(AssetManager.spines.wave3);
    this.boosterSpawner = boosterSpawner;
    this.deadEnemyCount = 0;
  }

  start() {
    let bones = this.spine.findBones("Enemy");
    bones.forEach(bone => {
      this.addEnemy(bone);
    });

    this.spine.state.setAnimation(0, "Wave03");
    this.spine.state.setAnimation(1, "Red_Idle", true);
    this.spine.state.setAnimation(2, "Yellow_Idle", true);
  }

  onEnemyDie(enemy) {
    super.onEnemyDie(enemy);
    this.deadEnemyCount++;
    if (this.enemies.length === 10) {
      this.boosterSpawner.spawnBooster(BoosterType.BlueShip, enemy.getGlobalPosition());
    }
  }

  addEnemy(bone) {
    let enemy = super.addEnemy(bone);
    enemy.body.hp = GameConstant.WAVE_3_ENEMY_HP;
    enemy.collider.y = -10;
    this.addChild(enemy);
    return enemy;
  }
}