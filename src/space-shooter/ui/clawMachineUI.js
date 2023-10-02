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

    goUp() {
        Tween.createTween(this.silk.scale, {
            y: this.scaleY
        }, {
            duration: 1.5 * (this.silk.scale.y - this.scaleY) / 8.5,
            onUpdate: () => {
                this.clawHookBody.y = this.silk.height + this.clawMachine.height;
            },
            onComplete: () => {
            }
        }).start();
    }


    _initClawHook() {
        this.clawHookBody = new PIXI.Sprite(PIXI.Texture.from("spider_body"));
        this.clawHookBody.anchor.set(0.5, 0);
        this.clawHookBody.x = 0;
        this.clawHookBody.y = this.silk.height + this.clawMachine.height;
        this.clawMachine.addChild(this.clawHookBody);

        this.clawHook = new PIXI.Sprite(PIXI.Texture.from("spider_leg"));
        this.clawHook.anchor.set(0.5, 0.5);
        // this.clawHook.width = this.clawHook.width * 0.6;
        // this.clawHook.height = this.clawHook.height * 0.6;
        this.clawHook.x = 0;
        this.clawHook.y = this.clawHookBody.height / 2;
        // this.clawHook.scale.set(0.6);
        this.clawHookBody.addChild(this.clawHook);

        let collider = new Collider(CollisionTag.ClawHook);
        collider.width = 280;
        collider.height = 260;

        collider.on(CollisionEvent.OnCollide, (x) => {
            this.clawHook.removeChild(collider);
            collider.destroy();
            this.tweenArow.stop();
            this.goUp();
            x.parent.parent.removeChild(x.parent);
            this.clawHookBody.addChild(x.parent);
            x.parent.x = 0;
            x.parent.y = this.clawHookBody.height / 2 + x.parent.height / 2;
        }, this);

        this.clawHook.addChild(collider);
    }

    _initSilk() {
        this.silk = new PIXI.Sprite(PIXI.Texture.from("spider_silk"));
        this.silk.anchor.set(0.5, 0);
        this.silk.x = 0;
        this.silk.y = this.clawMachine.height;
        this.silk.scale.set(1.62, 0.5);
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