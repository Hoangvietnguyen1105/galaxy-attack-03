import { AssetManager } from "../../../assetManager";
import { GameConstant } from "../../../gameConstant";
import { SpineAnimator } from "../../../integrate/spineAnimator";
import { Tween } from "../../../systems/tween/tween";

export class Wings extends PIXI.Container {
  constructor() {
    super("wings");
    this.spine = new SpineAnimator(AssetManager.spines.wing);
    this.spine.visible = false;
    this.addChild(this.spine);

    this.playing = false;
  }

  play() {
    this.playing = true;
    this.spine.visible = true;
    this.spine.state.setAnimation(0, "Intro_Wings");
    this.spine.state.setAnimation(1, "Idle_Wings", true);

    this._countTween?.stop();
    this._countTween = Tween.createTween({ t: 0 }, { t: 1 }, {
      duration: GameConstant.SHIP_WINGS_DURATION,
      onComplete: () => {
        this.spine.visible = false;
      }
    }).start();
  }

  stop() {
    if (this.playing) {
      this.spine.visible = false;
    }
  }
}