import { BodyEvent } from "./bodyEvent";

export class Body extends PIXI.utils.EventEmitter {
  constructor() {
    super();
    this.hp = 1;
    this.maxHP = 1;
    this.immortal = false;
  }

  setHP(hp = 1) {
    this.hp = hp;
    this.maxHP = hp;
  }

  takeDamage(damage) {
    this.emit(BodyEvent.Hitted);

    if (this.immortal) {
      return;
    }

    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.emit(BodyEvent.Die);
  }

  get remainPercent() {
    return this.hp / this.maxHP * 100;
  }

  get isAlive() {
    return this.hp > 0;
  }
}