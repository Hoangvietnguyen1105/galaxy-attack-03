import { Tween } from "../../../systems/tween/tween";

export class CircleEffect extends PIXI.Container {
  constructor() {
    super("fx_circle");

    this.tweens = [];
    this.addCircle(0);
    this.addCircle(0.7);
    this.addCircle(1.4);
  }

  addCircle(delay = 0) {
    let texture = PIXI.Texture.from("circle");
    let circle = new PIXI.Sprite(texture);
    this.addChild(circle);
    circle.anchor.set(0.5);
    circle.blendMode = PIXI.BLEND_MODES.ADD;
    circle.alpha = 0;

    let scaleTween = Tween.createTween(circle.scale, { x: 0, y: 0 }, {
      duration: 2.1,
      onComplete: () => fadeTween.delay(0).start()
    });

    let fadeTween = Tween.createTween(circle, { alpha: 1 }, {
      delay,
      duration: 0.3,
      easing: Tween.Easing.Sinusoidal.In,
      onStart: () => scaleTween.start(),
    });
    fadeTween.start();

    this.tweens.push(scaleTween, fadeTween);
    return circle;
  }

  stop() {
    this.tweens.forEach(tween => tween.pause());
    this.visible = false;
  }

  resume() {
    this.tweens.forEach(tween => tween.resume());
    this.visible = true;
  }
}