import { BoosterType } from "./boosterType";
import { VelocityBooster } from "./velocityBooster";

export class PowerBooster extends VelocityBooster {
  constructor() {
    super(BoosterType.Power);
    this.sprite = new PIXI.Sprite(PIXI.Texture.from("booster_power"));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.velocity.y = 100;
    this.collider.collideData.power = true;
  }
}