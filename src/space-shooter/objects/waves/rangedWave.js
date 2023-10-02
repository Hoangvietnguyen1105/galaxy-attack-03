import { Util } from "../../../helpers/utils";
import { SpineCommonWave } from "./spineCommonWave";

export class RangedSpineWave extends SpineCommonWave {
  constructor(data) {
    super(data);
  }

  onInterval() {
    super.onInterval();
    let enemy = Util.randomFromList(this.enemies);
    enemy?.shoot();
  }

  addEnemy(bone, weapon) {
    let enemey = super.addEnemy(bone);
    enemey.addWeapon(weapon);
    return enemey;
  }
}