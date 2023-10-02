import { PureTransform } from "../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../pureDynamic/PixiWrapper/pureSprite";

export class ObjectFactory {
  static createColorBackground(alpha = 1, tint = 0x000000) {
    let texture = PIXI.Texture.from("spr_blank");
    let bg = new PureSprite(texture, new PureTransform({
      alignment: Alignment.FULL
    }));
    bg.displayObject.alpha = alpha;
    bg.displayObject.tint = tint;
    return bg;
  }

  static createBackground(textureName) {
    let texture = PIXI.Texture.from(textureName);
    let bg = new PureSprite(texture, new PureTransform({
      alignment: Alignment.FULL,
      maintainAspectRatioType: MaintainAspectRatioType.MAX,
      top: -1,
      right: -1,
      bottom: -1,
      left: -1,
    }));
    return bg;
  }
}