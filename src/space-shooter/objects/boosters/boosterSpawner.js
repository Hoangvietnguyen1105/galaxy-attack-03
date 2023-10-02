import { Game } from "../../../game";
import { GameState, GameStateManager } from "../../../pureDynamic/systems/gameStateManager";
import { ContainerSpawner } from "../../../systems/spawners/containerSpawner";
import { PurpleShip } from "../ships/purpleShip";
import { BlueShipBooster } from "./blueShipBooster";
import { BoosterBase } from "./boosterBase";
import { BoosterEvent } from "./boosterEvent";
import { BoosterType } from "./boosterType";
import { LevelUpBooster } from "./levelUpBooster";
import { PowerBooster } from "./powerBooster";
import { PurpleShipBooster } from "./purpleShipBooster";

export class BoosterSpawner extends PIXI.Container {
  constructor(scene) {
    super();
    this.scene = scene;
    this.scene.addChild(this);
    /** @type {Array<BoosterBase>} */
    this.boosters = [];
    this.rate = 1;
    this.levelUpBoosterSpawner = new ContainerSpawner();
    this.levelUpBoosterSpawner.init(this._createLevelUpBooster.bind(this));
    // this.powerBoosterSpawner = new ContainerSpawner();
    // this.powerBoosterSpawner.init(this._createPowerBooster.bind(this));
    // this.purpleShipSpawner = new ContainerSpawner();
    // this.purpleShipSpawner.init(this._createPurpleShipBooster.bind(this));
    // this.blueShipSpawner = new ContainerSpawner();
    // this.blueShipSpawner.init(this._createBlueShipBooster.bind(this));

    Game.app.ticker.add(this.update, this);
  }

  update() {
    if (!GameStateManager.isState(GameState.Playing)) {
      return;
    }

    this.boosters.forEach(booster => booster.update(Game.app.ticker.deltaMS / 1000));
  }

  roll(position) {
    if (this._shouldSpawn(this.rate)) {
      // TODO: Add spawn rate for each type
      this.spawnBooster(BoosterType.LevelUp, position);
    }
  }

  spawnBooster(type, position) {
    let booster;
    if (type === BoosterType.LevelUp) {
      booster = this._spawn(this.levelUpBoosterSpawner);
    }
    else if (type === BoosterType.Power) {
      // booster = this._spawn(this.powerBoosterSpawner);
    }
    else if (type === BoosterType.PurpleShip) {
      // booster = this._spawn(this.purpleShipSpawner);
    }
    else if (type === BoosterType.BlueShip) {
      // booster = this._spawn(this.blueShipSpawner);
    }

    if (booster) {
      booster.x = position.x;
      booster.y = position.y;
    }
  }

  _spawn(spawner) {
    let booster = spawner.spawn(this);
    this.addChild(booster);
    this.boosters.push(booster);
    return booster;
  }

  _depsawn(booster, spawner) {
    spawner.despawn(booster);
    this.boosters.splice(this.boosters.indexOf(booster), 1);
  }

  _shouldSpawn(rate) {
    return Math.random() <= rate;
  }

  _createLevelUpBooster() {
    let booster = new LevelUpBooster();
    booster.on(BoosterEvent.Collected, () => this._depsawn(booster, this.levelUpBoosterSpawner));
    return booster;
  }

  _createPowerBooster() {
    let booster = new PowerBooster();
    booster.on(BoosterEvent.Collected, () => this._depsawn(booster, this.powerBoosterSpawner));
    return booster;
  }

  _createPurpleShipBooster() {
    let ship = new PurpleShip(this.scene);
    let booster = new PurpleShipBooster();
    booster.collider.collideData.ship = ship;
    booster.on(BoosterEvent.Collected, () => this._depsawn(booster, this.purpleShipSpawner));
    return booster;
  }

  _createBlueShipBooster() {
    let ship = new BlueShip(this.scene);
    let booster = new BlueShipBooster();
    booster.collider.collideData.ship = ship;
    booster.on(BoosterEvent.Collected, () => this._depsawn(booster, this.blueShipSpawner));
    return booster;
  }
}