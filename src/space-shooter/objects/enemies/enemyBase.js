import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { Body } from "../base/body";
import { BodyEvent } from "../base/bodyEvent";
import { EnemyEvent } from "./enemyEvent";

export class EnemyBase extends PIXI.Container {
  constructor() {
    super();
    this.body = new Body();
    this.body.on(BodyEvent.Die, this.die, this);

    this.collider = new Collider(CollisionTag.Enemy);
    this.collider.on(CollisionEvent.OnCollide, this.onCollide, this);
    this.addChild(this.collider);
  }

  onCollide(collider) {
    let damage = collider.collideData.damage;
    if (collider.collideData.damage) {
      this.body.takeDamage(damage);
      this.emit(EnemyEvent.Hitted, this);
    }
  }

  die() {
    this.collider.enabled = false;
    this.emit(EnemyEvent.Die, this);
  }
}