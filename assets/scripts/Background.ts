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
    camera: cc.Node = null;


    items: cc.Node[] = [];
    prevCameraPosY: number;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let item1: cc.Node = this.node.getChildByName("Item1");
        let item2: cc.Node = this.node.getChildByName("Item2");
        this.items = [item1, item2];

        //item location at begin
        item2.y = item1.y + item1.height;

        this.prevCameraPosY = this.camera.y;
    }

    start () {

    }

    update (dt) {
        if (this.camera.y - this.prevCameraPosY >= this.items[0].height) {
            this.scroll();
            this.prevCameraPosY += this.items[0].height;
        }
    }

    scroll () {
        this.items[0].y = this.items[1].y + this.items[1].height;
        //swap
        [this.items[0], this.items[1]] = [this.items[1], this.items[0]];
    }
}
