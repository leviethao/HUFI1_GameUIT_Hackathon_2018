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
@ccclass
export default class NewClass extends cc.Component {

    leftItem: cc.Node = null;
    rightItem: cc.Node = null;
    canvasNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    init () {
        this.leftItem = this.node.getChildByName("LeftItem");
        this.rightItem = this.node.getChildByName("RightItem");

        let street = this.canvasNode.getComponent(InGame).street;

        this.leftItem.x = -street.width / 2;
        this.rightItem.x = street.width / 2;
        this.canvasNode.getComponent(InGame).camera.getComponent(cc.Camera).addTarget(this.node);

        // let randWidth = Math.floor(Math.random() * this.canvasNode.width / 4) + this.leftItem.width;
        // this.leftItem.width = randWidth;
        // this.rightItem.width = randWidth;

        // let randHeight = Math.floor(Math.random() * this.canvasNode.height / 2) + this.leftItem.height;
        // this.leftItem.height = randHeight;
        // this.rightItem.height = randHeight;

        let entityList = this.canvasNode.getComponent(InGame).gameSetting.getComponent(GameSetting).entityList;
        let randEntity = Math.floor(Math.random() * entityList.length);
        this.leftItem.getComponent(cc.Sprite).spriteFrame = entityList[randEntity].getComponent(cc.Sprite).spriteFrame.clone();
        this.rightItem.getComponent(cc.Sprite).spriteFrame = entityList[randEntity].getComponent(cc.Sprite).spriteFrame.clone();
        this.leftItem.setContentSize(entityList[randEntity].getContentSize());
        this.rightItem.setContentSize(entityList[randEntity].getContentSize());
        //this.leftItem.anchorX = 0;
        //this.rightItem.anchorX = 1;

        this.leftItem.getComponent(cc.BoxCollider).size = this.leftItem.getContentSize();
        this.leftItem.getComponent(cc.BoxCollider).offset = new cc.Vec2(this.leftItem.width / 2, 0);
        this.rightItem.getComponent(cc.BoxCollider).size = this.leftItem.getComponent(cc.BoxCollider).size;
        this.rightItem.getComponent(cc.BoxCollider).offset = new cc.Vec2(-this.rightItem.width / 2, 0);

        this.node.getComponent(cc.BoxCollider).size = cc.size(this.canvasNode.width, this.leftItem.height);
        //console.log("Box Size: " + this.node.getComponent(cc.BoxCollider).size.width  + ": " + this.node.getComponent(cc.BoxCollider).size.height);
        
    }

    start () {

    }

    update (dt) {
        //this.node.y -= 100 * dt;
    }
}
