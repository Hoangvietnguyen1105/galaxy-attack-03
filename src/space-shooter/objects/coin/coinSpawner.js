import { Util } from "../../../helpers/utils";
import { ContainerSpawner } from "../../../systems/spawners/containerSpawner";
import { Tween } from "../../../systems/tween/tween";
import { CoinEvent } from "./coinEvent";

export class CoinSpawner extends ContainerSpawner {
  constructor() {
    super();
    this.spawnRange = 100;
    this.collectPosition = new PIXI.Point();
    this._initTextures();
    this.init(this._createCoin.bind(this), 20);
  }

  _initTextures() {
    this.textures = [];
    for (var i = 1; i <= 6; i++) {
      this.textures.push(PIXI.Texture.from(`coin_${i}`));
    }
  }

  spawnTo(target, count = 10) {
    for (var i = 0; i < count; i++) {
      var coin = this.spawnCoin(target);
      this.playMotion(coin);
    }
  }

  spawnCoin(target) {
    let coin = this.spawn(this);
    let pos = target.getGlobalPosition();
    coin.x = pos.x;
    coin.y = pos.y;
    coin.play();
    this.emit(CoinEvent.Spawn, coin);
    return coin;
  }

  playMotion(coin) {
    coin.tweens?.forEach(tween => tween.stop);
    let spawnRange = new PIXI.Point(
      Util.random(-this.spawnRange, this.spawnRange),
      Util.random(-this.spawnRange, this.spawnRange)
    );
    let coinPos = new PIXI.Point(coin.x, coin.y);
    let explodePos = new PIXI.Point(coinPos.x + spawnRange.x, coinPos.y + spawnRange.y);
    let explodeTween = Tween.createTween(coin, { x: explodePos.x, y: explodePos.y }, {
      duration: 0.25,
      easing: Tween.Easing.Sinusoidal.Out,
    });

    let collect = 1000;
    let collectDistance = new PIXI.Point(this.collectPosition.x - explodePos.x, this.collectPosition.y - explodePos.y);
    let collectLength = Util.lengthOfVector(collectDistance);
    let collectDuration = collectLength / collect;
    coin.x = explodePos.x;
    coin.y = explodePos.y;
    let collectTween = Tween.createTween(coin, this.collectPosition, {
      duration: collectDuration,
      onComplete: () => this._onCoinMotionComplete(coin)
    });

    coin.x = coinPos.x;
    coin.y = coinPos.y;
    explodeTween.chain(collectTween);
    explodeTween.start();
    coin.tweens = [explodeTween, collectTween];
  }

  _onCoinMotionComplete(coin) {
    this.emit(CoinEvent.Collect, coin);
    this.emit(CoinEvent.Despawn, coin);
    this.despawn(coin);
  }

  _createCoin() {
    let coin = new PIXI.AnimatedSprite(this.textures);
    coin.anchor.set(0.5);
    coin.animationSpeed = 0.5;
    return coin;
  }
}