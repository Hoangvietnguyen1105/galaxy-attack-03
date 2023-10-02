import { BulletBase } from "../bullets/bulletBase";
import { WeaponEvent } from "./weaponEvent";
export class WeaponBase extends PIXI.Container {
  /**
   * @param {BulletBase} bullet 
   */
  constructor(bullet) {
    super();
    this.bullet = bullet;
    this._tmpGlobalPos = new PIXI.Point();
  }

  shoot() {
    this.getGlobalPosition(this._tmpGlobalPos, false);
    this.bullet.spawn(this._tmpGlobalPos);
    this.emit(WeaponEvent.Shoot, this._tmpGlobalPos);
  }
}