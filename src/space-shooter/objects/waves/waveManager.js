import { Container } from "pixi.js";
import { Game } from "../../../game";
import { Time } from "../../../systems/time/time";
import { WaveEvent } from "./waveEvent";

export class WaveManager extends Container {
  constructor() {
    super();
    /** @type {Array<Wave>} */
    this.waves = [];
    Game.app.ticker.add(this.update, this);
  }

  start() {
    this._checkNextWave();
  }

  _checkNextWave() {
    this.currentWave = this.waves[this.currentWaveIndex];
    if (this.currentWave && this.currentWave.autoStart) {
      this.startWave(this.currentWave);
    }
  }

  startNextWave() {
    this.currentWave = this.waves[this.currentWaveIndex];
    if (this.currentWave) {
      this.startWave(this.currentWave);
    }
  }

  startWave(wave) {
    wave.visible = true;
    wave.on(WaveEvent.Complete, this._onWaveComplete, this);
    wave.start();
  }

  _onWaveComplete() {
    Game.onOneLevelPassed();
    if (this.currentWaveIndex + 1 === this.waves.length / 2) {
      Game.onMidwayProgress();
    }

    if (this.currentWaveIndex >= this.waves.length - 1) {
      this.emit(WaveEvent.Complete);
    }
    else {
      this.currentWaveIndex++;
      this._checkNextWave();
    }
  }

  update() {
    this.currentWave?.update(Time.dt);
  }

  pause() {
    this.currentWave?.pause();
  }

  resume() {
    this.currentWave?.resume();
  }

  addWave(wave) {
    wave.visible = false;
    this.addChild(wave);
    this.waves.push(wave);
  }

  get currentWaveIndex() {
    return this._currentWaveIndex || 0;
  }

  set currentWaveIndex(value) {
    this._currentWaveIndex = value;
  }
}
