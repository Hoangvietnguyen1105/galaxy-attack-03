import { Scene } from "./scene";
import { Debug } from "../../../helpers/debug";
import { GameResizer } from "../../systems/gameResizer";
import { GameState, GameStateManager } from "../../systems/gameStateManager";

export class SceneManager {
  /**
   * @class SceneManager
   * @param {PIXI.Container} stage PIXI application stage
   * @param {Array<Scene>} scenes 
   */
  static init(stage, scenes) {
    this.stage = stage;
    this.scenes = scenes;
    GameResizer.registerOnResizeCallback(this.onResize, this);
    GameStateManager.registerOnStateChangedCallback(this._onGameStateChange, this);
  }

  static _onGameStateChange(state, prevState) {
    if (state === GameState.Paused) {
      this.pause();
    }

    if (state !== GameState.Paused && prevState === GameState.Paused) {
      this.resume();
    }
  }

  /**
   * @param {number} dt delta time
   */
  static update(dt) {
    this.currentScene.update(dt);
  }

  /**
   * @param {Scene} scene 
   */
  static load(scene) {
    console.log("Load scene " + scene.key);
    this.stage.removeChildren();
    this.currentScene && this.currentScene.destroy();
    this.currentScene = scene;
    this.currentScene.create();
    this.stage.addChild(scene);
  }

  static pause() {
    this.currentScene?.onPause();
  }

  static resume() {
    this.currentScene?.onResume();
  }

  static onResize() {
    this.currentScene?.resize();
  }

  static getScene(key) {
    return this.scenes.find(s => s.key === key);
  }
}
