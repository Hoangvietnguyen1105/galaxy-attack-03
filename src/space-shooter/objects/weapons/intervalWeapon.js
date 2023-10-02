import { Game } from "../../../game";
import { GameState, GameStateManager } from "../../../pureDynamic/systems/gameStateManager";
import { WeaponBase } from "./weaponBase";

export class IntervalWeapon extends WeaponBase {
  constructor(bullet) {
    super(bullet);
    this.enabled = true;
    this.interval = 1;
    this._currInterval = 0;
    this.shootCount = 1;
    this.shootInterval = 0.1;
    this._currShootInterval = 0;
    this._currShootCount = 0;
    Game.app.ticker.add(this.update, this);
  }

  reset() {
    this._currInterval = 0;
  }

  update() {
    if (!this.enabled || !GameStateManager.isState(GameState.Playing)) {
      return;
    }

    this.updateInterval(Game.app.ticker.deltaMS / 1000);
  }

  updateInterval(dt) {
    this._currInterval += dt;
    while(this._currInterval >= this.interval) {
      this._currInterval -= this.interval;
      this.onInterval();
    }

    if (this._currShootCount < this.shootCount) {
      this._currShootInterval += dt;
      while(this._currShootInterval >= this.shootInterval) {
        this._currShootInterval -= this.shootInterval;
        this.shoot();
      }
    }
  }

  shoot() {
    super.shoot();
    this._currShootCount++;
  }

  onInterval() {
    this._currShootCount = 0;
    this._currShootInterval = this.shootInterval;
  }

  destroy() {
    super.destroy();
    this.enabled = false;
    Game.app.ticker.remove(this.update, this);
  }
}
