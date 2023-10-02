import { Container } from "pixi.js";
import { AssetManager } from "../../../assetManager";
import { Game } from "../../../game";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/utils";
import { SpineAnimator } from "../../../integrate/spineAnimator";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { GameState, GameStateManager } from "../../../pureDynamic/systems/gameStateManager";
import { InputManager } from "../../../pureDynamic/systems/inputManager";
import { Tween } from "../../../systems/tween/tween";
import { CircleEffect } from "../effects/circleEffect";
import { ExplodeEffect } from "../effects/explodeEffect";
import { ShipEvent } from "../ships/shipEvent";
import { Tutorial } from "../tutorial/tutorial";
import { PlayerEvent } from "./playerEvent";

export class Player extends Container {
  constructor() {
    super();
    this._startInputPos = InputManager.startPosition;
    this._inputPos = InputManager.position;
    this.inputEnabled = false;

    this._initCircleEffect();
    this._initExplodeEffect();
    // this._initWings();
    this._initBuffEffect();
    this._initShipContainer();
    this._initTutorial();
    Game.app.ticker.add(this.update, this);
  }

  start() {
    this.inputEnabled = true;
    this.fxCircle.stop();
    this.tutorial.visible = false;
    this.ship?.onStart();
  }

  update() {
    if (!this.ship
      || !GameStateManager.isState(GameState.Playing)
    ) {
      return;
    }

    this.dt = Game.app.ticker.deltaMS / 1000;
    if (this.inputEnabled) {
      this._calculateInput();
    }
  }

  _calculateInput() {
    let distanceX = this._inputPos.x - this._startInputPos.x;
    let distanceY = this._inputPos.y - this._startInputPos.y;

    let moveAmountX = distanceX * GameConstant.SWIPE_MULTIPLIER;
    let moveAmountY = distanceY * GameConstant.SWIPE_MULTIPLIER;

    this._startInputPos.x = Util.interpolate(this._startInputPos.x, this._inputPos.x, GameConstant.SHIP_SPEED * this.dt);
    this._startInputPos.y = Util.interpolate(this._startInputPos.y, this._inputPos.y, GameConstant.SHIP_SPEED * this.dt);

    this.x = Util.interpolate(this.x, this.x + moveAmountX, GameConstant.SHIP_SPEED * this.dt);
    this.y = Util.interpolate(this.y, this.y + moveAmountY, GameConstant.SHIP_SPEED * this.dt);

    if (this.x < -GameResizer.width / 2 || this.x > GameResizer.width / 2) {
      this.x = GameResizer.width / 2 * Util.sign(this.x);
    }

    if (this.y < -GameResizer.height / 2 || this.y > GameResizer.height / 2) {
      this.y = GameResizer.height / 2 * Util.sign(this.y);
    }
  }

  setTutorialVisible(isVisible) {
    this.tutorial.visible = isVisible;
    if (isVisible) {
      this.fxCircle.resume();
    }
    else {
      this.fxCircle.stop();
    }
  }

  onWin(onAnimationComplete) {
    this.inputEnabled = false;
    this.ship?.onWin();
    this._playWinAnimation(onAnimationComplete);
  }

  _playWinAnimation(onComplete) {
    let duration = 1;
    let tweenDown = Tween.createTween(this, { x: 0, y: 0.3 * GameResizer.height }, {
      duration,
      easing     : Tween.Easing.Sinusoidal.In,
      onComplete : () => {
        this.setTutorialVisible(true);
        onComplete();
      },
    });
    tweenDown.start();
  }

  /**
   * @param {ShipBase} ship
   */
  setShip(ship) {
    this.ship?.destroy();
    this.ship = ship;
    this.ship.on(ShipEvent.PowerUp, this._onPowerUp, this);
    this.ship.on(ShipEvent.CollectShip, this._onCollectShip, this);
    this.ship.on(ShipEvent.Die, this._onDie, this);
    this.ship.on(ShipEvent.CollectBooster, this._onCollectBooster, this);
    this.shipContainer.addChild(this.ship);
  }

  revive() {
    this.ship.revive();
    this.ship.playImmortalEffect(GameConstant.PLAYER_REVIVE_IMMORTAL_DURATION);
  }

  _onCollectBooster() {
    this.fxBuff.state.setAnimation(0, "ReceiveBuff");
  }

  _onCollectShip(ship) {
    this.setShip(ship);
    this.ship.onStart();
  }

  _onPowerUp() {
    // this.wings.play();
  }

  _onDie() {
    // this.wings.stop();
    this.ship.playImmortalEffect(GameConstant.PLAYER_REVIVE_IMMORTAL_DURATION);
    this.emit(PlayerEvent.Die);
  }

  _initShipContainer() {
    this.shipContainer = new PIXI.Container();
    this.addChild(this.shipContainer);
  }

  _initTutorial() {
    this.tutorial = new Tutorial("txt_tutorial");
    this.addChild(this.tutorial);
  }

  _initCircleEffect() {
    this.fxCircle = new CircleEffect();
    this.fxCircle.y = 10;
    this.addChild(this.fxCircle);
  }

  _initExplodeEffect() {
    this.fxExplode = new ExplodeEffect();
    this.fxExplode.scale.set(2);
    this.addChild(this.fxExplode);
  }

  _initWings() {
    this.wings = new Wings();
    this.wings.scale.set(1.3);
    this.addChild(this.wings);
  }

  _initBuffEffect() {
    this.fxBuff = new SpineAnimator(AssetManager.spines.buffEffect);
    this.addChild(this.fxBuff);
  }
}

