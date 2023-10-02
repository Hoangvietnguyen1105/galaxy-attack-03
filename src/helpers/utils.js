import { TextureCache } from "@pixi/utils";
import { Texture } from "pixi.js";
export class Util {
  static copyObject(src, dst = {}) {
    Object.keys(src).forEach(key => {
      dst[key] = src[key];
    });
    return dst;
  }

  /**
   * @param {Array<string>} textureKeys 
   * @returns {Array<PIXI.Texture>}
   */
  static getAnimationTextures(textureKeys) {
    let textures = [];
    for (let i = 0; i < textureKeys.length; i++) {
      textures.push(PIXI.Texture.from(textureKeys[i]));
    }
    return textures;
  }

  static getTexturesContain(text) {
    let keys = Object.keys(TextureCache).filter((key) => key.indexOf(text) >= 0);

    // CHEAT: sort key texture by number
    keys = keys.sort((textureA, textureB) => {
      let aspl = textureA.split("_");
      let a = aspl[aspl.length - 1];
      let bspl = textureB.split("_");
      let b = bspl[bspl.length - 1];
      return a - b;
    });
    let textures = keys.map((key) => Texture.from(key));
    return textures;
  }

  /**
   * @summary Shorthand function for creating PIXI.Sprite object
   * @param {string} textureKey 
   * @param {number} x 
   * @param {number} y 
   * @param {number} scale 
   */
  static createSprite(textureKey, x = 0, y = 0, scale = 1, anchorX = 0, anchorY = 0) {
    let spr = new PIXI.Sprite(PIXI.Texture.from(textureKey));
    // spr.anchor.y = 1;
    spr.x = x;
    spr.y = y;
    spr.scale.set(scale);
    spr.anchor.set(anchorX, anchorY);
    return spr;
  }

  /**
   * @summary Shorthand function for creating PIXI.AnimatedSprite object
   * @param {Array<string>} textureKeys 
   * @param {number} x 
   * @param {number} y 
   */
  static createAnimatedSprite(textureKeys, animationSpeed, x = 0, y = 0, scale = 1, anchorX = 0, anchorY = 0) {
    let anim = new PIXI.AnimatedSprite(Util.getAnimationTextures(textureKeys));
    anim.x = x;
    anim.y = y;
    anim.scale.set(scale);
    anim.anchor.set(anchorX, anchorY);
    anim.animationSpeed = animationSpeed;
    anim.play();
    return anim;
  }

  static copyObject(src, dst = {}) {
    Object.keys(src).forEach(key => {
      dst[key] = src[key];
    });
    return dst;
  }

  static sign(num) {
    return num < 0 ? -1 : 1;
  }

  static random(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * @summary Return random element from list 
   * @param {Array} list 
   */
  static randomFromList(list) {
    if (list && list.length > 0) {
      let randomIndex = this.randomInt(0, list.length - 1);
      return list[randomIndex];
    } else {
      return null;
    }
  }

  static distanceBetween(a, b) {
    return Math.abs(Math.abs(a) - Math.abs(b));
  }

  static toDegree(radian) {
    return radian * 180 / Math.PI;
  }

  static toRadian(degree) {
    return degree * Math.PI / 180;
  }

  static getRandomIntExclude(min, max, excludeNumber) {
    var rand = Math.floor(Math.random() * (max - min)) + min;
    if (rand === excludeNumber) {
      rand = max;
    }
    return rand;
  }

  static AABBCheck(x1, y1, w1, h1, x2, y2, w2, h2) {
    return ((x1 < x2 + w2) && (x1 + w1 > x2) && (y1 < y2 + h2) && (y1 + h1 > y2));
  }

  static interpolate(a, b, t, easing = Util.linear) {
    return a + (b - a) * easing(t);
  }

  static linear(num) {
    return num;
  }

  static pointOnVector(vector, length, dst = new PIXI.Point()) {
    let alpha = Math.atan(Math.abs(vector.x) / Math.abs(vector.y));
    dst.x = length * Math.sin(alpha) * this.sign(vector.x);
    dst.y = length * Math.cos(alpha) * this.sign(vector.y);
  }

  static registerOnPointerDown(displayObject, onPointerDown, context) {
    displayObject.eventMode = "static";
    displayObject.on("pointerdown", onPointerDown, context);
  }

  static getSpineAnimations(spine) {
    return spine.state.data.skeletonData.animations.map(a => a.name);
  }

  static lengthOfVector(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
  }

  static getCashFormat(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  }
}