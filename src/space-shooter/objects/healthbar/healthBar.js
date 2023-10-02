import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";

export class HealthBar extends Container {

  constructor(width, height) {
    super();

    this.w = width;
    this.h = height;

    this.innerBar = new Sprite(Texture.WHITE);
    this.innerBar.width = this.w;
    this.innerBar.height = this.h;
    this.innerBar.tint = 0xeaacac;
    this.innerBar.alpha = 0.5;

    this.outerBar = new Sprite(Texture.WHITE);
    this.outerBar.anchor.set(0);
    this.outerBar.width = this.w;
    this.outerBar.height = this.h;
    this.outerBar.tint = 0xff0000;

    this.addChild(this.innerBar, this.outerBar);
  }

  update(curHP, maxHP) {
    var percent = curHP / maxHP;
    this.outerBar.width = (percent < 0) ? 0 : percent * (this.w);
  }

  refresh() {
    this.fadeOuterBar.width = 0;
    this.outerBar.width = this.w;
  }
}
