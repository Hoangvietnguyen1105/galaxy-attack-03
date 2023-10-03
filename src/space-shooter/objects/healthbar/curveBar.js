import { Container } from "@pixi/display";
import { Graphics } from "pixi.js";
export class CurvedHealthBar extends Container {
  constructor(width, height) {
    super();
    this.w = width;
    this.h = height;

    this.innerBar = new Graphics();
    this.innerBar.lineStyle(this.h, 0xeaacac, 0.5);
    this.innerBar.arc(0, 0, this.w, Math.PI / 6, Math.PI - Math.PI / 6);

    this.outerBar = new Graphics();
    this.outerBar.lineStyle(this.h, 0xfecb00, 1);
    this.outerBar.arc(0, 0, this.w, Math.PI / 6, Math.PI - Math.PI / 6);
    this.addChild(this.innerBar, this.outerBar);
  }

  update(curHP,maxHP) {
    var p = curHP/maxHP
    this.outerBar.clear();
    this.outerBar.lineStyle(this.h, 0xfecb00, 1);
    this.outerBar.arc(0, 0, this.w, Math.PI / 6 + 1 - p, Math.PI - Math.PI / 6);
  }

  refresh() {
    this.outerBar.clear();
    this.outerBar.lineStyle(this.h, 0xfecb00, 1);
    this.outerBar.arc(0, 0, this.w, Math.PI / 6, Math.PI - Math.PI / 6);
  }
}