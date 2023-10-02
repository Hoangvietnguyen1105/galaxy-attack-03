import { WaveEvent } from "./waveEvent";

export class Wave extends PIXI.Container {
  constructor() {
    super();
    this.autoStart = true;
  }

  update(dt) {
  }

  start() {
    this.emit(WaveEvent.Start);
  }

  complete() {
    this.emit(WaveEvent.Complete);
  }

  pause() {
  }

  resume() {
  }
}