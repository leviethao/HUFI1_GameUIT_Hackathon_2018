// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import InGame from "./InGame";
import GameSetting from "./GameSetting";

enum ShrinkStatus {
    None,
    ShrinkBack,
    GrownUp
}

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;
    

    leftItem: cc.Node = null;
    rightItem: cc.Node = null;
    shrinkSpeed: number = 0;
    shrinkStatus: ShrinkStatus = ShrinkStatus.None;
    shrinkDefault: number;
    moveSpeed: number = 0;
    animFlag1: boolean = false;
    animFlag2: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));

        cc.director.getCollisionManager().enabled = true;
        this.node.getChildByName("anim").getComponent(cc.Animation).play("danhlon");
        this.node.getChildByName("anim").active = false;
    }

    init () {
        this.leftItem = this.node.getChildByName("LeftItem");
        this.rightItem = this.node.getChildByName("RightItem");

        let gameSetting = this.canvas.getComponent(InGame).gameSetting.getComponent(GameSetting);
        this.shrinkSpeed = gameSetting.shrinkSpeed;
        this.shrinkDefault = gameSetting.shrinkDefault;

        this.leftItem.x = -this.shrinkDefault / 2;
        this.rightItem.x = this.shrinkDefault / 2;

        this.moveSpeed = gameSetting.playerMoveSpeed;
    }

    start () {

    }

    update (dt) {

        if (this.canvas.node.getComponent(InGame).isStarted == false) {
            return;
        }
        
        this.grownUp(dt);
        this.shrinkBack(dt);
        
        this.node.y += this.moveSpeed * dt;
    }

    onTouchStart () {
        this.shrinkStatus = ShrinkStatus.GrownUp;
    }

    onTouchMove () {

    }

    onTouchEnd () {
        this.shrinkStatus = ShrinkStatus.ShrinkBack;

        this.canvas.node.getComponent(InGame).disableTutorial();
    }

    grownUp (dt: number) {
        if (this.shrinkStatus != ShrinkStatus.GrownUp) {
            this.animFlag1 = false;
            return;
        }

        let street = this.canvas.node.getComponent(InGame).street;
        if (Math.abs(this.leftItem.x) + Math.abs(this.rightItem.x) >= street.width - this.leftItem.width) {
            this.animFlag1 = false;
            return;
        }

        this.leftItem.x -= this.shrinkSpeed * dt;
        this.rightItem.x += this.shrinkSpeed * dt;

        if (!this.animFlag1) {
            let anim1State = this.leftItem.getComponent(cc.Animation).play("playerRunToLeft");
            anim1State.wrapMode = cc.WrapMode.Loop;
            let anim2State = this.rightItem.getComponent(cc.Animation).play("playerRunToRight");
            anim2State.wrapMode = cc.WrapMode.Loop;
            this.animFlag1 = true;
        }
        
    }

    shrinkBack (dt: number) {
        if (this.shrinkStatus != ShrinkStatus.ShrinkBack) {
            this.animFlag2 = false;
            return;
        }

        if (Math.abs(this.leftItem.x) + Math.abs(this.rightItem.x) <= this.leftItem.width) {
            this.animFlag2 = false;
            return;
        }

        this.leftItem.x += this.shrinkSpeed * dt;
        this.rightItem.x -= this.shrinkSpeed * dt;
        
        
        if (!this.animFlag2) {
            let anim1State = this.leftItem.getComponent(cc.Animation).play("playerRunToRight");
            anim1State.wrapMode = cc.WrapMode.Loop;
    
            let anim2State = this.rightItem.getComponent(cc.Animation).play("playerRunToLeft");
            anim2State.wrapMode = cc.WrapMode.Loop;
            this.animFlag2 = true;   
        }
    }

    onCollisionEnter (other) {
        
    }

    onCollisionStay (other) {
       
    }

    onCollisionExit (other) {
        switch (other.tag) {
            case 3: { // score
                //  if (this.node.y > other.node.y) {
                //      this.canvas.node.getComponent(InGame).gainScore();
                //  }
            } break;
        }
    }

}
