import { GameConstant } from "../../gameConstant";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { TilingBackground } from "../objects/tilingBackground";
import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { ClawMachineUI } from "../ui/clawMachineUI";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Tween } from "../../systems/tween/tween";
import { Collider } from "../../physics/aabb/collider";
import { CollisionTag } from "../../physics/aabb/collisionTag";
import emiter from "../../../assets/jsons/emitter.json"
import { Container, Texture } from "pixi.js";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import TWEEN from "@tweenjs/tween.js";


export class PickUpScene extends Scene {
    constructor() {
        super(GameConstant.SCENE_PICK_UP);
    }

    create() {
        super.create();
        this._initBackground();
        this._initUI();
        this._initReward();
        this._initBtnPlay();
        this._initEvents();
        this._initEffect();
        this._initHand();
        this.picking = false;

    }

    _initHand() {
        this.hand = new PIXI.Sprite(PIXI.Texture.from("spr_hand"));
        this.hand.anchor.set(0.5, 0.5);
        this.hand.y = this.bgMachine.height / 2 - 30;
        this.hand.x = 30
        this.bgMachine.addChild(this.hand);

        this.tweenHand = Tween.createTween(
            this.hand.position,
            { x: 70, y: this.bgMachine.height / 2 - 10 },
            {
                duration: 0.5,
                yoyo: true,
                loop: true,
                easing: TWEEN.Easing.Quadratic.InOut,
            }
        ).start();
    }


    _initEvents() {
        this.clawMachineUI.on("onPickUp", (obj) => {
            var dura = this.clawMachineUI.x - (-this.bgMachine.width / 2 + this.clawMachineUI.width / 2 - 30)
            Tween.createTween(
                this.clawMachineUI,
                { x: -this.bgMachine.width / 2 + this.clawMachineUI.width / 2 - 30 },
                {
                    duration: dura / 250,
                    delay: 0.5,
                    onComplete: () => {
                        Tween.createTween(obj.position, { y: 970 }, {
                            duration: 0.8,
                            onComplete: () => { this.showReward(obj) }
                        }).start();
                    }
                }
            ).start();
        });
    }

    showReward(obj) {
        var pos = obj.parent.toGlobal(obj.position);
        obj.parent.removeChild(obj);
        this.bgMachine.addChild(obj);
        var posLocal = obj.parent.toLocal(pos, null, null, true);
        obj.position.set(posLocal.x, posLocal.y);
        obj.scale.set(0.8);
        Tween.createTween(
            obj.position,
            {
                x: 0,
                y: 0 - obj.height / 2 - 40
            },
            {
                duration: 1,
                delay: 0.3,
                onUpdate: () => {
                    obj.angle -= 4.9;
                },
                onComplete: () => {
                    this.getReward(0, -obj.height / 2 - 40);
                    this.emitterRight.emit = true;
                    obj.parent.removeChild(obj);
                    obj.destroy();
                }
            }
        ).start();
    }

    getReward(x, y) {
        let reward = new PIXI.Sprite(PIXI.Texture.from("circle"));
        reward.anchor.set(0.5, 0.5);
        reward.x = x;
        reward.y = y;
        reward.scale.set(0.2);

        let spaceShip = new PIXI.Sprite(PIXI.Texture.from("ship_phoenix_dark"));
        spaceShip.anchor.set(0.5, 0.5);
        spaceShip.y = -8;
        spaceShip.scale.set(0.9);
        reward.addChild(spaceShip);
        this.bgMachine.addChild(reward);
        Tween.createTween(
            reward.scale,
            { x: 1, y: 1 },
            { duration: 0.5 }
        ).start();
    }

    _initEffect() {
        let texture = Texture.from("halo");
        let texture1 = Texture.from("spark");
        this.effectRight = new Container();
        this.effectRight.x = 0;
        this.effectRight.y = -100;
        this.bgMachine.addChild(this.effectRight);
        this.emitterRight = new Emitter(
            this.effectRight,
            upgradeConfig(emiter, [texture, texture1])
        );
        this.emitterRight.emit = false;
    }

    update(delta) {
        this.emitterRight.update(delta);
    }

    pickUp() {
        if (this.picking) return;
        this.picking = true;
        this.tweenArrow.stop();
        this.clawMachineUI.downward(8);
    }

    _initBtnPlay() {
        this.btnPlay = new PIXI.Sprite(PIXI.Texture.from("btn_play"));
        this.btnPlay.anchor.set(0.5);
        this.btnPlay.x = -101 + this.btnPlay.width / 2;
        this.btnPlay.y = this.bgMachine.height / 2 - this.btnPlay.height / 2 - 50;
        this.bgMachine.addChild(this.btnPlay);

        this.btnPlay.interactive = true;
        this.btnPlay.on('pointerdown', this.pickUp.bind(this));
    }

    _initReward() {
        this.groupReward = [];
        this._initItem(
            PIXI.Texture.from("glass_bottle"),
            this.bgMachine.width / 2 - 26,
            this.bgMachine.height / 2 - 227,
            120,
            200,
            0
        );

        this._initItem(
            PIXI.Texture.from("pumpkin"),
            100,
            this.bgMachine.height / 2 - 220,
            200,
            150,
            0
        );

        this._initItem(
            PIXI.Texture.from("witch_hat"),
            250,
            this.bgMachine.height / 2 - 300,
            200,
            150,
            -60
        );

        this._initItem(
            PIXI.Texture.from("skullcap"),
            -this.bgMachine.width / 2 + 215,
            this.bgMachine.height / 2 - 260,
            200,
            150,
            0, 20, 30
        );

    }

    _initItem(texture, x, y, colliderWidth, colliderHeight, angle, x1 = 0, y1 = 0) {

        let ship = new PIXI.Sprite(PIXI.Texture.from("ship_phoenix_dark1"));
        ship.angle = angle + 60;
        ship.x = x - texture.width / 2;
        ship.y = y - texture.height / 2 + 27;
        ship.anchor.set(0.5, 0.5);
        this.bgMachine.addChild(ship);

        let reward = new PIXI.Sprite(texture);
        reward.anchor.set(0.5, 0.5);
        reward.angle = -60;
        reward.x = -25 + x1;
        reward.y = -20 + y1;
        ship.addChild(reward);
        this.groupReward.push(reward);

        let collider = new Collider(CollisionTag.Reward);
        collider.width = colliderWidth;
        collider.height = colliderHeight;
        ship.addChild(collider);
    }

    _initUI() {
        this.bgMachine = new PIXI.Sprite(PIXI.Texture.from("Claw_machine_Halloween"));
        this.bgMachine.anchor.set(0.5);
        this.bgMachine.x = GameResizer.width / 2;
        this.bgMachine.y = GameResizer.height / 2;
        this.addChild(this.bgMachine);

        this.clawMachineUI = new ClawMachineUI();
        this.clawMachineUI.x = -this.bgMachine.width / 2 + this.clawMachineUI.width / 2 - 20;
        this.clawMachineUI.y = -this.bgMachine.height / 2 * 0.75;
        this.bgMachine.addChild(this.clawMachineUI);

        this.tweenArrow = Tween.createTween(
            this.clawMachineUI,
            { x: this.bgMachine.width / 2 - this.clawMachineUI.width / 2 + 20 },
            {
                duration: 2,
                yoyo: true,
                loop: true
            }
        ).start();

    }

    _initBackground() {
        let texture = PIXI.Texture.from("bg");
        let transform = new PureTransform({
            container: this.root,
            alignment: Alignment.FULL,
            top: -10,
            right: -10,
            bottom: -10,
            left: -10,
        });
        this.bg = new TilingBackground(this, texture, transform);
    }

    resize() {
        super.resize();
        this.bgMachine.x = GameResizer.width / 2;
        this.bgMachine.y = GameResizer.height / 2;
    }
}