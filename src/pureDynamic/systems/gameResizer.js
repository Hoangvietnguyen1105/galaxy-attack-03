import { GameConstant } from "../../gameConstant";

export class GameResizer {

  /**
   * @param {PIXI.Application} app 
   */
  static init(app) {
    this.app = app;
    this.canvas = this.app.view;
    this.app.resizeTo = this.canvas;
    this.mode = ResizeMode.FullScale;
    this.lastResize = { width: this.canvas.width, height: this.canvas.height }; // canvas width and height before resize

    this.emitter = new PIXI.utils.EventEmitter();
  }

  static resize(windowWidth = 0, windowHeight = 0) {
    this.windowWidth = windowWidth || window.innerWidth;
    this.windowHeight = windowHeight || window.innerHeight;
    this._resizeFullScale();
    this.app.resize();
    this.emitter.emit("resize");
  }

  static _resizeFullScale() {
    let style = this.canvas.style;

    console.log("--- Enter resize " + this.mode);
    console.log("Window: " + this.windowWidth + "x" + this.windowHeight);

    let ratio = Math.max(GameConstant.GAME_WIDTH / this.windowWidth, GameConstant.GAME_HEIGHT / this.windowHeight);
    this.width = this.windowWidth * ratio;
    this.height = this.windowHeight * ratio;
    this.orientation = this.width <= this.height ? Orientation.Portrait : Orientation.Landscape;

    console.log(`Resize to: ${this.width}x${this.height} orientation: ${this.orientation}`);
    this.lastResize.width = this.canvas.width;
    this.lastResize.height = this.canvas.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.gameScaleX = this.canvas.width / GameConstant.GAME_WIDTH;
    this.gameScaleY = this.canvas.height / GameConstant.GAME_HEIGHT;

    let scale = this.windowWidth / this.width;

    style.transformOrigin = "0px 0px";
    style.transform = `scale(${scale})`;

    let vMargin = Math.floor((this.windowWidth - this.width * scale) / 2);
    let hMargin = Math.floor((this.windowHeight - this.height * scale) / 2);

    style.margin = `${hMargin}px ${vMargin}px ${hMargin}px ${vMargin}px`;

    console.log(this.canvas);
  }

  static registerOnResizeCallback(fn, context) {
    this.emitter.on("resize", fn, context);
  }

  static removeOnResizeCallback(fn, context) {
    this.emitter.off("resize", fn, context);
  }

  static isPortrait() {
    return this.orientation === Orientation.Portrait;
  }

  static isLandScale() {
    return this.orientation === Orientation.Landscape;
  }
}

export const Orientation = Object.freeze({
  Portrait: "portrait",
  Landscape: "landscape",
});

export const ResizeMode = Object.freeze({
  LetterBox: "letterbox",
  FullScale: "fullscale",
});