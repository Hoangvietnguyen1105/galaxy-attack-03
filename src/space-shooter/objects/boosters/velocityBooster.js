import { BoosterBase } from "./boosterBase";

export class VelocityBooster extends BoosterBase {
  constructor(type) {
    super(type);
    this.velocity = new PIXI.Point();
  }

  update(dt) {
    super.update(dt);
    if (!this.collector) {
      this.x += this.velocity.x * dt;
      this.y += this.velocity.y * dt;;
    }
  }
}