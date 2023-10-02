import { Container, Sprite, Texture } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { Game } from "../../game"
import { Util } from "../../helpers/utils";
import { PureObject } from "../../pureDynamic/core/pureObject";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { SoundManager } from "../../soundManager";
import { ObjectFactory } from "../objectFactory";
import { Tween } from "../../systems/tween/tween";
import { SpineAnimator } from "../../integrate/spineAnimator";
import { AssetManager } from "../../assetManager";

export class EndCard extends Scene {
  constructor() {
    super(GameConstant.SCENE_END_CARD);
  }

  create() {
    super.create();
    this._initBackground();
    this._initTopMidContainer();
    this._intiBoss();
    this._initShip();
    this._initWarning();
    this._initBlurBackground();
    this._intiSkillIcon();
  }

  _initBackground() {
    this.bg = ObjectFactory.createBackground("bg");
    this.addChild(this.bg.displayObject);
  }

  _initBlurBackground() {
    this.blurBG = new PIXI.Graphics();
    this.blurBG.beginFill(0x000000, 0.5);
    this.blurBG.drawRect(0, 0, 4000, 4000);
    this.addChild(this.blurBG);
    Util.registerOnPointerDown(this.blurBG, () => Game.onCTAClick("endcard_bg"));
    this.blurBG.visible = false;
  }

  _initTopMidContainer() {
    this.topMid = new Container();
    this.addChild(this.topMid);
    this.resize();
  }

  _initWarning() {
    var countSoundLoop = 0;
    var countEffectLoop = 0;
    this.warning = new PureSprite(Texture.from("txt_warning"), new PureTransform({
      alignment: Alignment.MIDDLE_CENTER,
      useOriginalSize: true,
    }));
    this.warning.displayObject.scale.set(2.5);
    this.warning.displayObject.alpha = 0;
    this.addChild(this.warning.displayObject);
    var warningSoundPlayFunc = () => {
      SoundManager.play("sfx_warning", 0.5, false, () => {
        countSoundLoop++;
        if (countSoundLoop < 3) {
          warningSoundPlayFunc();
        }
      });
    };
    warningSoundPlayFunc();

    var tween = Tween.createTween(this.warning.displayObject, { alpha: 1 }, {
      duration: 0.4,
      easing: Tween.Easing.Quintic.Out,
      onComplete: () => {
        tween2.start();
      },
    }).start();
    var tween2 = Tween.createTween(this.warning.displayObject, { alpha: 0 }, {
      duration: 0.7,
      onComplete: () => {
        countEffectLoop++;
        if (countEffectLoop < 3) {
          tween.start();
        }
        else {
          this.skillObject.displayObject.visible = true;
          this.blurBG.visible = true;
        }
      },
    });
  }

  _initShip() {
    this.ship = new PureSprite(Texture.from("ship_phoenix_dark"), new PureTransform({
      pivotX: 0.5,
      pivotY: 0.5,
      anchorX: 0.5,
      anchorY: 0.8
    }));
    this.addChild(this.ship.displayObject);
  }

  _intiSkillIcon() {
    var count = 0;
    this.wingMan = new Sprite(Texture.from("fx_wingman"));
    this.wingMan.anchor.set(0.5);
    this.gunUpgrade = new Sprite(Texture.from("fx_gunupgrade"));
    this.gunUpgrade.anchor.set(0.5);
    this.gunUpgradeGlow = new Sprite(Texture.from("fx_gunupgrade"));
    this.gunUpgradeGlow.anchor.set(0.5);
    this.gunUpgrade.y = this.gunUpgradeGlow.y = this.gunUpgrade.height - 40;
    var skillIconContainer = new Container();
    this.skillObject = new PureObject(skillIconContainer, new PureTransform({
      alignment: Alignment.MIDDLE_LEFT,
      x: this.gunUpgrade.width / 2,
      useOriginalSize: true,
    }), new PureTransform({
      alignment: Alignment.MIDDLE_CENTER,
      x: -450,
      useOriginalSize: true,
    }));

    this.hand = new Sprite(Texture.from("hand"));
    this.hand.anchor.set(0);
    this.hand.pivot.x = 22;
    this.hand.pivot.y = 3;
    this.hand.y = this.gunUpgrade.y;
    skillIconContainer.addChild(this.gunUpgradeGlow, this.wingMan, this.gunUpgrade, this.hand);
    this.skillObject.displayObject.visible = false;
    this.addChild(this.skillObject.displayObject);

    Util.registerOnPointerDown(this.wingMan, () => Game.onCTAClick("end_card_skill_1"));
    Util.registerOnPointerDown(this.gunUpgrade, () => Game.onCTAClick("end_card_skill_2"));

    var tween = Tween.createTween(this.hand, { y: "+100" }, {
      duration: 0.3,
      yoyo: true,
      repeat: Infinity,
      onRepeat: () => {
        count++;
        if (count % 2 == 0) {
          tween2.start();
        }
      }
    }).start();

    var tween2 = Tween.createTween(this.gunUpgradeGlow, {
      alpha: 0,
      scale: { x: 2, y: 2 },
    }, {
      duration: 0.5,
      onComplete: () => {
        this.gunUpgradeGlow.scale.set(1);
        this.gunUpgradeGlow.alpha = 1;
      }
    });
  }

  _intiBoss() {
    this.boss = new SpineAnimator(AssetManager.spines.boss);
    this.boss.state.setAnimation(0, "Idle", true);
    this.boss.y -= this.boss.height / 2;
    this.topMid.addChild(this.boss);

    var tween = Tween.createTween(this.boss, { y: 250 }, {
      duration: 0.8,
      onComplete: () => {
        tween2.start();
      },
    }).start();
    var tween2 = Tween.createTween(this.boss, { y: "+100" }, {
      duration: 1.2,
      yoyo: true,
      loop: Infinity,
    });
  }

  resize() {
    super.resize();
    if (!!this.topMid) this.topMid.x = GameResizer.width / 2;
  }
}
