import { sound } from "@pixi/sound";
import { GameConstant } from "./gameConstant";

export class SoundManager {
  static play(id, volume = 1, loop = false, onEnd = () => { }) {
    sound.play(id, {
      loop: loop,
      speed: 1,
      volume: volume,
      complete: onEnd,
    });
  }

  static seek(id) {
    // sound.s
  }

  static pause(id) {
    // sound.pause(id);
  }

  static resume(id) {
    // sound.resume(id);
  }

  static stop(id) {
    sound.stop(id);
  }

  static mute(isMute, id) {
    sound.find(id).muted = isMute;
  }

  static muteAll() {
    sound.muteAll();
  }

  static unMuteAll() {
    sound.unmuteAll();
  }

  static on(event, callback, id) {
    this.enabled && this.audio.on(event, callback, id);
  }

  static getDuration(id) {
    let fx = sound.find(id);
    if (fx && this.enabled) {
      return fx.duration;
    }
    else {
      return 0;
    }
  }

  static get enabled() {
    return GameConstant.SOUND_ENABLED;
  }
}
