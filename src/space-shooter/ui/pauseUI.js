import { Util } from "../../helpers/utils";
import { GameState, GameStateManager } from "../../pureDynamic/systems/gameStateManager";
import { ObjectFactory } from "../objectFactory";

export class PauseUI extends PIXI.Container {
  constructor() {
    super();
    this._initBackground();
  }

  _initBackground() {
    this.bg = ObjectFactory.createColorBackground(0);
    this.addChild(this.bg.displayObject);
    Util.registerOnPointerDown(this.bg.displayObject, this.onTouchBackground, this);
  }

  onTouchBackground() {
    GameStateManager.state = GameState.Playing;
  }
}