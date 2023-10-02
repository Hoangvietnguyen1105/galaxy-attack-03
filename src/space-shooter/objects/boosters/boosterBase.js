import { AssetManager } from "../../../assetManager";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/utils";
import { SpineAnimator } from "../../../integrate/spineAnimator";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { SoundManager } from "../../../soundManager";
import { BoosterEvent } from "./boosterEvent";

export class BoosterBase extends PIXI.Container {
  constructor(type) {
    super();
    this.type = type;
    this.initEffect();

    this.collider = new Collider(CollisionTag.Booster);
    this.collider.enabled = false;
    this.collider.on(CollisionEvent.OnCollide, this.onCollide, this);
    this.addChild(this.collider);

    this.magnet = new Collider(CollisionTag.Booster);
    this.magnet.enabled = false;
    this.magnet.on(CollisionEvent.OnCollide, this.onMagnetCollided, this);
    this.magnet.width = this.magnet.height = GameConstant.BOOSTER_MAGNET_SIZE;
    this.addChild(this.magnet);

    this._tmpPos = new PIXI.Point();
    this._distance = new PIXI.Point();
    this.on("spawn", this.onSpawn, this);
  }

  onSpawn() {
    this.magnet.enabled = true;
    this.collider.enabled = true;
  }

  onCollide() {
    this.collider.enabled = false;
    this.magnet.enabled = false;
    this.emit(BoosterEvent.Collected);
    SoundManager.play("sfx_booster_collected", 0.25);
  }

  onMagnetCollided(collider) {
    /** @type {Collider} */
    this.collector = collider;
  }

  update(dt) {
    if (this.collector) {
      this.collector.getGlobalPosition(this._tmpPos, true);
      this._distance.set(this._tmpPos.x - this.x, this._tmpPos.y - this.y);
      Util.pointOnVector(this._distance, GameConstant.BOOSTER_MAGNET_SPEED * dt, this._tmpPos);
      this.x += this._tmpPos.x;
      this.y += this._tmpPos.y;
    }
  }

  initEffect() {
    this.fx = new SpineAnimator(AssetManager.spines.boosterEffect);
    this.fx.state.setAnimation(0, "Fall", true);
    this.addChild(this.fx);
  }
}
