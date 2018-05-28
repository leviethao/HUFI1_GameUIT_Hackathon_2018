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

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    AnhSang: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.AnhSang.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.2),cc.rotateBy(1,5),cc.delayTime(0.2),cc.rotateBy(1,-5))));
        var act1 = cc.moveTo(1,this.node.x,this.node.y + 6);
        var act2 = cc.moveTo(1,this.node.x,this.node.y - 6);
        this.node.runAction(cc.repeatForever(cc.sequence(act2,act1)));
    }

    // update (dt) {}
}
