import { Container } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helpers/utils";
import { Collider } from "../../physics/aabb/collider";
import { CollisionTag } from "../../physics/aabb/collisionTag";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { GameState, GameStateManager } from "../../pureDynamic/systems/gameStateManager";
import { InputEvent, InputManager } from "../../pureDynamic/systems/inputManager";
import { SoundManager } from "../../soundManager";
import { Tween } from "../../systems/tween/tween";
import { BoosterSpawner } from "../objects/boosters/boosterSpawner";
import { CoinEvent } from "../objects/coin/coinEvent";
import { CoinSpawner } from "../objects/coin/coinSpawner";
import { Player } from "../objects/player/player";
import { PlayerEvent } from "../objects/player/playerEvent";
import { GreenShip } from "../objects/ships/greenShip";
import { TilingBackground } from "../objects/tilingBackground";
import { Wave6 } from "../objects/waves/wave6";
import { Wave7 } from "../objects/waves/wave7";
import { WaveEndCard } from "../objects/waves/waveEndcard";
import { WaveEvent } from "../objects/waves/waveEvent";
import { WaveManager } from "../objects/waves/waveManager";
import { AwesomeUI } from "../ui/awesomeUI";
import { CoinUI } from "../ui/coinUI";
import { PauseUI } from "../ui/pauseUI";
import { TutorialUI } from "../ui/tutorialUI";
import { WarningUI } from "../ui/warningUI";
import { WinUI } from "../ui/winUI";
import { SceneManager } from "../../pureDynamic/PixiWrapper/scene/sceneManager";

export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
    this.coin = 0;
  }

  create() {
    super.create();

    this._initBackground();
        this._initPlayer();

    this._initGameplay();
    this._initUI();
    this._initAwesomeUI();
    this._initWarningUI();

    InputManager.emitter.on(InputEvent.MouseDown, this.onMouseDown, this);
    InputManager.emitter.on(InputEvent.MouseUp, this.onMouseUp, this);

    this.resize();
    GameStateManager.state = GameState.Tutorial;
  }

  destroy() {
    super.destroy();
    InputManager.emitter.off(InputEvent.MouseDown, this.onMouseDown, this);
    InputManager.emitter.off(InputEvent.MouseUp, this.onMouseUp, this);
  }

  onStart() {
    GameStateManager.state = GameState.Playing;
    Game.onStart();
    this.playerContainer.visible = true;
    this.player.start();
    this.tutorialUI.visible = false;
    this.pauseUI.visible = false;
    this._playBackgroundMusic("music_bg");
  }

  onMouseDown() {
    // this.tweenAutoCTA?.stop();
  }

  onMouseUp() {
    GameStateManager.state = GameState.Paused;
    // this.tweenAutoCTA?.stop();
    // this.tweenAutoCTA = Tween.createCountTween({
    //   duration   : GameConstant.AUTO_CTA_DELAY,
    //   onComplete : () => Game.onCTAClick("auto"),
    // }).start();
  }

  onPause() {
    super.onPause();
    if (GameStateManager.isState(GameState.Revive)) {
      return;
    }

    this.waveManager.pause();
    this.warningUI.pause();
    if (GameStateManager.prevState === GameState.Playing) {
      this.setPauseSceneVisible(true);
    }
  }

  onResume() {
    super.onResume();
    if (GameStateManager.isState(GameState.Revive)) {
      return;
    }

    this.waveManager.resume();
    this.warningUI.resume();

    if (GameStateManager.isState(GameState.Playing)) {
      this.setPauseSceneVisible(false);
    }
  }

  setPauseSceneVisible(isVisible) {
    this.pauseUI.visible = isVisible;
    this.player.setTutorialVisible(isVisible);
  }
  update(dt){
    if(this.player)
      this.player.ship.update(dt)
  }

  resize() {
    super.resize();
    this.gameplay.x = GameResizer.width / 2;
    this.gameplay.y = GameResizer.height / 2;
    this.playerContainer.x = GameResizer.width / 2;
    this.playerContainer.y = GameResizer.height / 2;
    this.boundTop.y = -GameResizer.height / 2 - this.boundTop.height / 2 - GameConstant.BULLET_BOUND_OFFSET;
    this.boundBottom.y = GameResizer.height / 2 + this.boundTop.height / 2 + GameConstant.BULLET_BOUND_OFFSET;
  }

  onDie() {
    if (Game.revivable) {
      GameStateManager.state = GameState.Revive;
      // this.reviveUI.show();
      this.waveManager.pause();
    }
    else {
      this.lose();
    }
  }

  revive() {
    Game.onRevive();
    GameStateManager.state = GameState.Playing;
    this.player.revive();
    // this.reviveUI.hide();
    this.waveManager.resume();
    this._playBackgroundMusic();
  }

  onCancelRevive() {
    this.lose();
  }

  lose() {
    GameStateManager.state = GameState.Lose;
    Game.onLose();
    this.setPauseSceneVisible(false);
    // this.reviveUI.hide();
    this.coinUI.hide();
    this.winUI.show();
  }

  win() {
    Game.onWin();
    SceneManager.load(SceneManager.getScene(GameConstant.SCENE_END_CARD));
  }

  _initUI() {
    // TODO: Add UI Manager
    this.tutorialUI = new TutorialUI();
    this.tutorialUI.registerOnTutorialCompleteCallback(this.onStart, this);
    this.addChild(this.tutorialUI);

    this.winUI = new WinUI();
    this.winUI.hide();
    this.addChild(this.winUI);

    /*
     * this.reviveUI = new ReviveUI();
     * this.addChild(this.reviveUI);
     * this.reviveUI.on("yes", this.revive, this);
     * this.reviveUI.on("no", this.onCancelRevive, this);
     * this.reviveUI.hide();
     */

    this.coinUI = new CoinUI();
    this.coinUI.hide();
    this.addChild(this.coinUI);

    this.pauseUI = new PauseUI();
    this.pauseUI.visible = false;
    this.addChild(this.pauseUI);

    this.initGameTag();
  }

  _initWarningUI() {
    this.warningUI = new WarningUI();
    this.addChild(this.warningUI);
  }

  _initAwesomeUI() {
    this.awesomeUI = new AwesomeUI();
    this.addChild(this.awesomeUI);
  }

  _initGameplay() {
    this.gameplay = new Container();
    this.addChild(this.gameplay);

    this._initBulletBounds();
    this._initWaves();
  }

  _initPlayer() {
    this.playerContainer = new PIXI.Container();
    // this.playerContainer.visible = false;
    this.addChild(this.playerContainer);

    let greenShip = new GreenShip(this);
    greenShip.body.immortal = GameConstant.SHIP_IMMORTAL;
    this.player = new Player();
    this.player.scale.set(GameConstant.REDUCE_SIZE_SHIP);
    this.player.y = GameResizer.height * 0.3;
    this.player.setShip(greenShip);
    this.player.on(PlayerEvent.Die, this._onPlayerDie, this);
    this.playerContainer.addChild(this.player);
  }

  _onPlayerDie() {
    this.warningUI.playAnimation();
    // InputManager.enabled = false;
    // this._stopBackgroundMusic();
    // GameStateManager.state = GameState.GameOver;
    // SoundManager.play("sfx_explosion", 0.25);
    // this.player.fxExplode.play(() => this.onDie());
  }

  _initWaves() {
    this.coinSpawner = new CoinSpawner();
    this.coinSpawner.collectPosition.set(50, 50);
    this.coinSpawner.on(CoinEvent.Collect, this._onCollectCoin, this);
    this.addChild(this.coinSpawner);

    let boosterSpawner = new BoosterSpawner(this);
    this.waveManager = new WaveManager();
    this.waveManager.on(WaveEvent.Complete, this._onWavesCompleted, this);
    this.gameplay.addChild(this.waveManager);

    let wave1 = new Wave6(this.player,boosterSpawner);
    wave1.on(WaveEvent.OnEnemyDie, this._onEnemyDie, this);
    wave1.on(WaveEvent.Complete, this._onWave1Complete, this);

    let wave4 = new Wave7(boosterSpawner);
    wave4.on(WaveEvent.OnEnemyDie, this._onEnemyDie, this);
    wave4.on(WaveEvent.Complete, this._onWave4Complete, this);

    this.waveManager.addWave(wave1);
    this.waveManager.addWave(wave4);
    this.waveManager.start();
  }

  _onWave1Complete() {
    this.waveManager.startNextWave();
  }

  _onWave4Complete() {
    this.awesomeUI.stopAnimation();
    // let sfxWarning = SoundManager.play("sfx_warning", 0.3, true);
    // SoundManager.stop(sfxWarning);
    // this._playBackgroundMusic("music_bg_2");
  }

  _onEnemyDie(enemy) {
    // this.coinSpawner.spawnTo(enemy);
    // this.awesomeUI.playAnimation();
    // this.playShakeMotion();
  }

  _onCollectCoin() {
    this.coin += 100;
    this.coinUI.setCoin(this.coin);
    if (GameStateManager.isState(GameState.Playing)) {
      this.sfxCoin = SoundManager.play("sfx_coin", 0.015);
    }
  }

  playShakeMotion() {
    let count = 0;
    let shakeTime = 5;
    let onComplete = () => {
      count++;
      if (count <= shakeTime) {
        this._playShakeTween(onComplete);
      }
    };
    this._playShakeTween(onComplete);
  }

  _playShakeTween(onComplete) {
    let strength = new PIXI.Point(4, 4);
    let duration = 0.02;
    let x = Util.random(-strength.x, strength.x);
    let y = Util.random(-strength.y, strength.y);

    this.shakeTween?.stop();
    this.x = 0;
    this.y = 0;
    this.shakeTween = Tween.createTween(this, { x, y }, {
      duration,
      repeat : 1,
      yoyo   : true,
      onComplete,
    }).start();
  }

  _onWavesCompleted() {
    InputManager.enabled = false;
    // this.sfxWin = SoundManager.play("sfx_win", 0.5);
    GameStateManager.state = GameState.Win;
    this.setPauseSceneVisible(false);
    this.player.onWin(() => this.win());
  }

  _playBackgroundMusic(id) {
    this.bgMusic && SoundManager.stop(this.bgMusic);
    this.bgMusic = SoundManager.play(id, 1, true);
  }

  _stopBackgroundMusic() {
    SoundManager.stop(this.bgMusic);
    this.bgMusic = null;
  }

  _initBulletBounds() {
    this.boundTop = this.addBulletBound();
    this.boundBottom = this.addBulletBound();
  }

  addBulletBound(x = 0, y = 0) {
    let bound = new Collider(CollisionTag.Bounding);
    bound.width = 10000;
    bound.height = 500;
    bound.x = x;
    bound.y = y;
    this.gameplay.addChild(bound);
    return bound;
  }

  _initBackground() {
    let texture = PIXI.Texture.from("bg");
    let transform = new PureTransform({
      container : this.root,
      alignment : Alignment.FULL,
      top       : -10,
      right     : -10,
      bottom    : -10,
      left      : -10,
    });
    this.bg = new TilingBackground(this, texture, transform);
  }
}
