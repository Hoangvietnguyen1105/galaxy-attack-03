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
        this.picking = false;

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
        this.btnPlay.x = -74;
        this.btnPlay.y = this.bgMachine.height / 2 + 194;
        this.bgMachine.addChild(this.btnPlay);

        this.btnPlay.interactive = true;
        this.btnPlay.on('pointerdown', this.pickUp.bind(this));
    }

    _initReward() {
        this.groupReward = [];

        let reward = new PIXI.Sprite(PIXI.Texture.from("glass_bottle"));
        reward.anchor.set(0.5, 0.5);
        reward.x = this.bgMachine.width / 2 + 50;
        reward.y = this.bgMachine.height / 2 - 130;
        reward.width = reward.width * 0.7;
        reward.height = reward.height * 0.7;
        // reward.scale.set(0.7);
        this.bgMachine.addChild(reward);
        this.groupReward.push(reward);

        let collider = new Collider(CollisionTag.Reward);
        collider.width = 300;
        collider.height = 400;
        reward.addChild(collider);

        let reward1 = new PIXI.Sprite(PIXI.Texture.from("pumpkin"));
        reward1.anchor.set(0.5, 0.5);
        reward1.x = 0;
        reward1.y = this.bgMachine.height / 2 - 130;
        this.bgMachine.addChild(reward1);
        this.groupReward.push(reward1);

        let collider1 = new Collider(CollisionTag.Reward);
        collider1.width = 300;
        collider1.height = 250;
        reward1.addChild(collider1);

        let reward2 = new PIXI.Sprite(PIXI.Texture.from("witch_hat"));
        reward2.anchor.set(0.5, 0.5);
        reward2.x = 220;
        reward2.y = this.bgMachine.height / 2 - 225;
        reward2.angle = -60;
        this.bgMachine.addChild(reward2);
        this.groupReward.push(reward2);

        let collider2 = new Collider(CollisionTag.Reward);
        collider2.width = 350;
        collider2.height = 210;
        collider2.angle = 60;
        reward2.addChild(collider2);

        let reward3 = new PIXI.Sprite(PIXI.Texture.from("skullcap"));
        reward3.anchor.set(0.5, 0.5);
        reward3.x = -this.bgMachine.width / 2 + 50;
        reward3.y = this.bgMachine.height / 2 - 130;
        this.bgMachine.addChild(reward3);
        this.groupReward.push(reward3);

        let collider3 = new Collider(CollisionTag.Reward);
        collider3.width = 300;
        collider3.height = 250;
        reward3.addChild(collider3);

        let reward4 = new PIXI.Sprite(PIXI.Texture.from("glass_bottle"));
        reward4.anchor.set(0.5, 0.5);
        reward4.x = -170;
        reward4.y = this.bgMachine.height / 2 - 280;
        reward4.width = PIXI.Texture.from("glass_bottle").width * 0.7;
        reward4.height = PIXI.Texture.from("glass_bottle").height * 0.7;
        console.log(reward4.getBounds(), PIXI.Texture.from("glass_bottle"));
        // reward4.scale.set(0.7);
        reward4.angle = -120;
        this.bgMachine.addChild(reward4);
        this.groupReward.push(reward4);

        let collider4 = new Collider(CollisionTag.Reward);
        collider4.width = 250;
        collider4.height = 350;
        reward4.addChild(collider4);

    }

    _initUI() {
        this.bgMachine = new PIXI.Sprite(PIXI.Texture.from("Claw_machine_Halloween"));
        this.bgMachine.anchor.set(0.5);
        this.bgMachine.width = this.bgMachine.width * 0.62;
        this.bgMachine.height = this.bgMachine.height * 0.62;
        // this.bgMachine.scale.set(0.62);
        this.bgMachine.x = GameResizer.width / 2;
        this.bgMachine.y = GameResizer.height / 2;
        this.addChild(this.bgMachine);

        this.clawMachineUI = new ClawMachineUI();
        this.clawMachineUI.x = -this.bgMachine.width / 2 + 10;
        this.clawMachineUI.y = -this.bgMachine.height / 2 - 125;
        this.bgMachine.addChild(this.clawMachineUI);

        this.tweenArrow = Tween.createTween(
            this.clawMachineUI,
            { x: this.bgMachine.width / 2 - 10 },
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