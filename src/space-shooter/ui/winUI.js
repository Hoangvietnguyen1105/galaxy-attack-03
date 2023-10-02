import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Game } from "../../game";
import { Util } from "../../helpers/utils";
import { PureObject } from "../../pureDynamic/core/pureObject";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Tween } from "../../systems/tween/tween";
import { ObjectFactory } from "../objectFactory";
export class WinUI extends Container {
  constructor() {
    super();
    // this._initBackground();
    this._initBlurBackground();
    this._intiSkillIcon();
  }

  destroy() {
    super.destroy();
    GameResizer.removeOnResizeCallback(this.onResize, this);
  }

  _initBlurBackground() {
    this.blurBG = new Graphics();
    this.blurBG.beginFill(0x000000, 0.5);
    this.blurBG.drawRect(0, 0, 4000, 4000);
    this.addChild(this.blurBG);
    Util.registerOnPointerDown(this.blurBG, () => Game.onCTAClick("endcard_bg"));
  }

  _intiSkillIcon() {
    var count = 0;
    this.gunUpgrade = new Sprite(Texture.from("fx_gunupgrade"));
    this.gunUpgradeGlow = new Sprite(Texture.from("fx_gunupgrade"));
    this.gunUpgrade.y = this.gunUpgradeGlow.y = this.gunUpgrade.height - 40;
    var skillIconContainer = new Container();
    this.skillObject = new PureObject(skillIconContainer, new PureTransform({
      alignment       : Alignment.MIDDLE_LEFT,
      x               : this.gunUpgrade.width / 2,
      useOriginalSize : true,
    }), new PureTransform({
      alignment       : Alignment.MIDDLE_LEFT,
      x               : 100,
      useOriginalSize : true,
    }));

    this.hand = new Sprite(Texture.from("hand"));
    this.hand.anchor.set(0);
    this.hand.pivot.x = 22;
    this.hand.pivot.y = 3;
    this.hand.y = this.gunUpgrade.y;
    skillIconContainer.addChild(this.gunUpgradeGlow, this.gunUpgrade, this.hand);
    this.addChild(this.skillObject.displayObject);

    Util.registerOnPointerDown(this.gunUpgrade, () => Game.onCTAClick("end_card_skill_2"));

    Tween.createTween(this.hand, { y: "+100" }, {
      duration : 0.3,
      yoyo     : true,
      repeat   : Infinity,
      onRepeat : () => {
        count++;
        if (count % 2 === 0) {
          tween2.start();
        }
      },
    }).start();

    var tween2 = Tween.createTween(this.gunUpgradeGlow, {
      alpha : 0,
      scale : { x: 2, y: 2 },
    }, {
      duration   : 0.5,
      onComplete : () => {
        this.gunUpgradeGlow.scale.set(1);
        this.gunUpgradeGlow.alpha = 1;
      },
    });
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  _initBackground() {
    this.bg = ObjectFactory.createBackground("bg");
    this.addChild(this.bg.displayObject);
    Util.registerOnPointerDown(this.bg.displayObject, () => Game.onCTAClick());
  }

}
