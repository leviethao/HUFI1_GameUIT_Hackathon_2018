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

    canvasNode: cc.Node = null;
    item: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    init () {
        this.canvasNode.getComponent(InGame).camera.getComponent(cc.Camera).addTarget(this.node);
        
        this.item = this.node.getChildByName("Item");

        // let randWidth = Math.floor(Math.random() * this.canvasNode.width * 0.7) + this.canvasNode.width / 6;
        // this.item.width = randWidth;

        // let randHeight = Math.floor(Math.random() * this.canvasNode.height / 2) + this.item.height;
        // this.item.height = randHeight;

        let entityList = this.canvasNode.getComponent(InGame).gameSetting.getComponent(GameSetting).entityList;
        let randEntity = Math.floor(Math.random() * entityList.length);
        this.item.getComponent(cc.Sprite).spriteFrame = entityList[randEntity].getComponent(cc.Sprite).spriteFrame.clone();
        this.item.setContentSize(entityList[randEntity].getContentSize());

        this.item.getComponent(cc.BoxCollider).size.width = this.item.getContentSize().width;
        this.item.getComponent(cc.BoxCollider).size.height = this.item.getContentSize().height;

        this.node.getComponent(cc.BoxCollider).size = cc.size(this.canvasNode.width, this.item.height);
    }

    start () {

    }

    update (dt) {
        //this.node.y -= 100 * dt;
    }
}
