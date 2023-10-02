import { BoosterType } from "./boosterType";
import { VelocityBooster } from "./velocityBooster";

export class LevelUpBooster extends VelocityBooster {
  constructor() {
    super(BoosterType.LevelUp);
    this.sprite = new PIXI.Sprite(PIXI.Texture.from("booster_levelup"));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.collider.collideData.levelup = 1;
    this.velocity.y = 100;
  }
}