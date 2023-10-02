import { AnimatedSprite, Container } from "pixi.js";
import { Util } from "../../../helpers/utils";

export class EnemyGalaga extends Container {
  constructor(texture) {
    super("galaga");
    let textures = Util.getTexturesContain(texture);
    this.anim = new AnimatedSprite(textures);
    this.anim.animationSpeed = 0.4;
    this.anim.play();
    this.anim.anchor.set(0.5);
    this.addChild(this.anim);
  }

  destroy() {
    this.anim.destroy();
    super.destroy();
  }
}
