import { Util } from "../../helpers/utils";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, PureTransformConfig } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { Tween } from "../../systems/tween/tween";

export class CoinUI extends PIXI.Container {
  constructor() {
    super();
    this._initIcon();
    this._initText();
    this._initHalo();
  }

  _initIcon() {
    this.icon = new PureSprite(PIXI.Texture.from("coin_icon"), new PureTransform({
      pivotX: 0.5,
      pivotY: 0.5,
      x: 50,
      y: 50
    }));
    this.addChild(this.icon.displayObject);
  }
  
  _initText() {
    let transform = new PureTransform({
      alignment: Alignment.TOP_LEFT,
      useOriginalSize: true,
      x: 94,
      y: 20
    });
    let style = new PIXI.TextStyle({
      align: "left",
      fontSize: 56,
      fontWeight: "bold",
      fill: 0xFFFFFF
    });
    this.text = new PureText("0", transform, style);
    this.addChild(this.text.displayObject);
  }

  _initHalo() {
    this.halo = new PIXI.Sprite(PIXI.Texture.from("halo"));
    this.halo.anchor.set(0.5);
    this.halo.x = this.icon.displayObject.x;
    this.halo.y = this.icon.displayObject.y;
    this.halo.tint = 0xf9ffbb;
    this.halo.blendMode = PIXI.BLEND_MODES.ADD;
    this.addChildAt(this.halo, this.getChildIndex(this.icon.displayObject));

    Tween.createTween(this.halo, { alpha: 0.5 }, {
      duration: 0.5,
      loop: true,
      yoyo: true,
      easing: Tween.Easing.Sinusoidal.InOut
    }).start();
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  setCoin(num) {
    this.text.displayObject.text = Util.getCashFormat(num);
  }
}