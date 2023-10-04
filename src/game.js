import { GameConstant } from "./gameConstant";
import { Debug } from "./helpers/debug";
import { AssetManager } from "./assetManager";
import { Tween } from "./systems/tween/tween";
import { Physics } from "./physics/physics";
import { Application } from "@pixi/app";
import { Time } from "./systems/time/time";
import { SoundManager } from "./soundManager";
import { ScriptSystem } from "./systems/script/scriptSystem";
import { PlayScene } from "./space-shooter/scenes/playScene";
import { GameResizer } from "./pureDynamic/systems/gameResizer";
import { InputManager } from "./pureDynamic/systems/inputManager";
import { GameState, GameStateManager } from "./pureDynamic/systems/gameStateManager";
import { SceneManager } from "./pureDynamic/PixiWrapper/scene/sceneManager";
import Adapter from "./adsAdapter/adapter";
import { EndCard } from "./space-shooter/scenes/endCard";

export class Game {
  static init() {
    this.life = GameConstant.GAME_LIFE;
    this.started = true;

    this.kAds = new Adapter();
    this.kAds.registerEvents(this);
  }

  static load() {
    Debug.log("Creative", "Load");

    this.app = new Application({
      width  : GameConstant.GAME_WIDTH,
      height : GameConstant.GAME_HEIGHT,
    });

    document.body.appendChild(this.app.view);
    const viewStyle = this.app.view.style;
    viewStyle.position = "absolute";
    viewStyle.display = "block";
    viewStyle.padding = "0px 0px 0px 0px";

    Time.init(this.app);
    Tween.init(this.app);
    ScriptSystem.init(this.app);
    GameResizer.init(this.app);
    InputManager.init(this.app.view);
    AssetManager.load(this._onAssetLoaded.bind(this));
  }

  static _create() {
    this.gameCreated = true;
    let screenSize = this.kAds.getScreenSize();
    Debug.log("Creative", "Create", screenSize);

    this.resize(screenSize);

    Physics.init(this.app);
    SceneManager.init(this.app.stage, [
      new PlayScene(),
      new EndCard(),
    ]);
    SceneManager.load(SceneManager.getScene(GameConstant.SCENE_END_CARD));
    this.app.ticker.add(this._update.bind(this));
  }

  static _update() {
    this.dt = this.app.ticker.deltaMS / 1000;
    SceneManager.update(this.dt);
    this.kAds.adapter.update();
  }

  static resize(screenSize) {
    if (this.gameCreated) {
      GameResizer.resize(screenSize.width, screenSize.height);
    }
    else {
      Debug.warn("Creative", "Game resize called before game loading");
    }
  }

  static _onAssetLoaded() {
    this.kAds.adapter.onAssetLoaded();
    if (this.started) {
      this._create();
    }
  }

  static onVisible() {
    Debug.log("Creative", "Visible");
  }

  static start() {
    this.started = true;
    if (AssetManager.loaded) {
      this._create();
    }
  }

  static onStart() {
    this.kAds.adapter.onStart();
  }

  static onWin() {
    this.kAds.adapter.onWin();
  }

  static onLose() {
    this.kAds.adapter.onLose();
  }

  static onRevive() {
    this.life--;
    this.kAds.adapter.onReplay();
  }

  static setPause(isPause) {
    if (!this.gameCreated) {
      return;
    }

    if (isPause && GameStateManager.state !== GameState.Paused) {
      SoundManager.muteAll();
      GameStateManager.state = GameState.Paused;
    }
    else if (!isPause && GameStateManager.state === GameState.Paused) {
      SoundManager.unMuteAll();
      GameStateManager.state = GameStateManager.prevState;
    }
  }

  static onOneLevelPassed() {
    this.kAds.adapter.onOneLevelPassed();
  }

  static onMidwayProgress() {
    this.kAds.adapter.onMidwayProgress();
  }

  static sendEvent(type, name) {
    this.kAds.adapter.onSendEvent(type, name);
  }

  static onCTAClick(elementName) {
    this.sendEvent("end_choice", elementName);
    this.kAds.onCTAClick();
  }

  static get revivable() {
    return this.life > 1;
  }
}
window.addEventListener("contextmenu", (e) => e.preventDefault());
// eslint-disable-next-line no-undef
window.addEventListener(ADEVENT_LOAD, () => {
  Game.init();
  Game.kAds.load();
});
