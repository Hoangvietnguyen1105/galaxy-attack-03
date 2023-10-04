import { Collider } from "../../physics/aabb/collider";
import { CollisionTag } from "../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../physics/aabb/collissionEvent";
import { Tween } from "../../systems/tween/tween";


export class ClawMachineUI extends PIXI.Container {
    constructor() {
        super();
        this._initClawMachine();
        this._initSilk();
        this._initClawHook();
        this.scaleY = this.silk.scale.y;
    }

    downward(targetY) {
        this.scaleY = this.silk.scale.y;
        this.tweenArow = Tween.createTween(this.silk.scale, {
            y: targetY
        }, {
            duration: 1.5,
            onUpdate: () => {
                this.clawHookBody.y = this.silk.height + this.clawMachine.height;
            },
            onComplete: () => {
            }
        }).start();
    }

    goUp(obj) {
        Tween.createTween(this.silk.scale, {
            y: this.scaleY
        }, {
            duration: 1.5 * (this.silk.scale.y - this.scaleY) / 8.5,
            onUpdate: () => {
                this.clawHookBody.y = this.silk.height + this.clawMachine.height;
            },
            onComplete: () => {
                var scaleY = this.scale.y - 0.2;
                var scaleX = this.scale.x - 0.2;
                Tween.createTween(this.scale, { x: scaleX, y: scaleY }, {
                    duration: 0.7,
                    delay: 0.5,
                    onComplete: () => {
                        this.emit("onPickUp", obj);
                    }
                }).start();
            }
        }).start();
    }


    _initClawHook() {
        this.clawHookBody = new PIXI.Sprite(PIXI.Texture.from("spider_body"));
        this.clawHookBody.anchor.set(0.5, 0);
        this.clawHookBody.x = 0;
        this.clawHookBody.y = this.silk.height + this.clawMachine.height;
        this.clawMachine.addChild(this.clawHookBody);

        this.clawHookRight = new PIXI.Sprite(PIXI.Texture.from("spr_spider_leg"));
        this.clawHookRight.anchor.set(0, 0.5);
        this.clawHookRight.scale.set(0.8)
        this.clawHookRight.x = 20;
        this.clawHookRight.y = this.clawHookBody.height / 2 - 20;
        this.clawHookBody.addChild(this.clawHookRight);

        this.clawHookLeft = new PIXI.Sprite(PIXI.Texture.from("spr_spider_leg"));
        this.clawHookLeft.anchor.set(0, 0.5);
        this.clawHookLeft.scale.set(-0.8, 0.8)
        this.clawHookLeft.x = -20;
        this.clawHookLeft.y = this.clawHookBody.height / 2 - 20;
        this.clawHookBody.addChild(this.clawHookLeft);

        this.tweenLeftLegStart = Tween.createTween(this.clawHookLeft, { rotation: -0.4 }, {
            duration: 0.4,
            easing: Tween.Easing.Sinusoidal.InOut,
        });

        this.tweenRightLegStart = Tween.createTween(this.clawHookRight, { rotation: 0.4 }, {
            duration: 0.4,
            easing: Tween.Easing.Sinusoidal.InOut,
        });

        let collider = new Collider(CollisionTag.ClawHook);
        collider.width = 150;
        collider.height = 120;
        collider.y = 65;

        collider.on(CollisionEvent.OnCollide, (x) => {
            this.clawHookBody.removeChild(collider);
            collider.destroy();
            this.tweenArow.stop();
            this.tweenRightLegStart.onComplete(() => {
                this.goUp(x.parent);
                x.parent.parent.removeChild(x.parent);
                this.clawHookBody.addChild(x.parent);
                x.parent.x = 0;
                x.parent.y = this.clawHookBody.height / 2 + x.parent.height / 2 + 50;
            });
            this.tweenLeftLegStart.start();
            this.tweenRightLegStart.start();
        }, this);

        this.clawHookBody.addChild(collider);
    }

    _initSilk() {
        this.silk = new PIXI.Sprite(PIXI.Texture.from("spider_silk"));
        this.silk.anchor.set(0.5, 0);
        this.silk.x = 0;
        this.silk.y = this.clawMachine.height;
        this.silk.height = this.silk.height * 0.5;
        this.silk.width = this.silk.width * 1.62
        this.clawMachine.addChild(this.silk);
    }

    _initClawMachine() {
        this.clawMachine = new PIXI.Sprite(PIXI.Texture.from("spider_base"));
        this.clawMachine.anchor.set(0.5, 0);
        this.addChild(this.clawMachine);
    }

    resize() {
    }
}