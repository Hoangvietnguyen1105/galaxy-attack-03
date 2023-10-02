import { Game } from "../../game";
import { Util } from "../../helpers/utils";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";

export class ReviveUI extends PIXI.Container {
  constructor() {
    super();
    this._initPanel();
    this._initButtonYes();
    this._initButtonNo();
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  onTapButtonYes() {
    this.emit("yes");
  }

  onTapButtonNo() {
    Game.onCTAClick("revive_no");
    this.emit("no");
  }

  _initPanel() {
    this.panel = new PureSprite(PIXI.Texture.from("revive_panel"), new PureTransform({
      alignment: Alignment.MIDDLE_CENTER,
    }));
    this.addChild(this.panel.displayObject);
  }

  _initButtonYes() {
    this.btnYes = new PureSprite(PIXI.Texture.from("btn_yes"), new PureTransform({
      container: this.panel,
      alignment: Alignment.BOTTOM_CENTER,
      y: -170
    }));
    Util.registerOnPointerDown(this.btnYes.displayObject, this.onTapButtonYes, this);
    this.addChild(this.btnYes.displayObject);
  }

  _initButtonNo() {
    this.btnNo = new PureSprite(PIXI.Texture.from("btn_no"), new PureTransform({
      container: this.panel,
      alignment: Alignment.BOTTOM_CENTER,
      y: -50
    }));
    Util.registerOnPointerDown(this.btnNo.displayObject, this.onTapButtonNo, this);
    this.addChild(this.btnNo.displayObject);
  }
}