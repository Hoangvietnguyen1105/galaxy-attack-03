import { Game } from "../../../game";
import { ContainerSpawner } from "../../../systems/spawners/containerSpawner";
import { BulletEvent } from "./bulletEvent";

export class BulletBase extends PIXI.Container {
  constructor() {
    super();
    /** @type {Array<PIXI.Container>} */
    this.bullets = [];
    this.spawner = new ContainerSpawner();
    this._tmpGlobalPos = new PIXI.Point();
    this._tmpLocalPos = new PIXI.Point();
    Game.app.ticker.add(this.update, this);
  }

  init(poolSize) {
    this.spawner.init(this.create.bind(this), poolSize);
  }

  spawn(globalPos) {
    let bullet = this.spawner.spawn(this);
    this.getGlobalPosition(this._tmpGlobalPos);
    bullet.x = globalPos.x - this._tmpGlobalPos.x;
    bullet.y = globalPos.y - this._tmpGlobalPos.y;
    this.bullets.push(bullet);
    this.emit(BulletEvent.Spawn, this, bullet);
    return bullet;
  }

  despawn(bullet) {
    this.spawner.despawn(bullet);
    this.bullets.splice(this.bullets.indexOf(bullet), 1);
    this.emit(BulletEvent.Despawn, this, bullet);
  }

  create() {
    let bullet = new PIXI.Container();
    bullet.visible = false;
    return bullet;
  }

  update(dt) {
  }

  destroy() {
    super.destroy();
    Game.app.ticker.remove(this.update, this);
  }
}