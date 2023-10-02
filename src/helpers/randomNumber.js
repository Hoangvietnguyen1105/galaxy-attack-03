import { Util } from "./utils";

export class RandomNumber {
  constructor(min = 0, max = 0) {
    this.min = min;
    this.max = max;
  }

  random() {
    return Util.random(this.min, this.max);
  }

  randomInt() {
    return Util.randomInt(this.min, this.max);
  }

  randomIntExclude(exclude) {
    return Util.getRandomIntExclude(this.min, this.max, exclude);
  }
}