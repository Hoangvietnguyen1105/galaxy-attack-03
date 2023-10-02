import { BoosterType } from "./boosterType";
import { VelocityBooster } from "./velocityBooster";

export class PurpleShipBooster extends VelocityBooster {
  constructor() {
    super(BoosterType.PurpleShip);
    this.sprite = new PIXI.Sprite(PIXI.Texture.from("ship_purple_base"));
    this.sprite.scale.set(0.5);
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.velocity.y = 400;
    this.fx.scale.set(1.5);
  }
}