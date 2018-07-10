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
const ZOOM_ON_START_TIME = 2;
const ZOOM_ON_START_DELAY = 0.5;
const ZOOM_ON_START_BEGIN = 2;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    // LIFE-CYCLE CALLBACKS:

    timer: number = 0;
    isZoomOnStartGameBegan: boolean = false;
    isZoomOnStartGameComplete: boolean = false;

    // onLoad () {}

    start () {
        this.node.getComponent(cc.Camera).zoomRatio = 1;
    }

    update (dt) {
        this.zoomOnStartGame(dt);
    }

    lateUpdate () {
        if (this.isZoomOnStartGameComplete) {
            this.node.position = this.target.position;
            this.node.y = this.target.y + this.canvas.node.height / 4;
        }
    }

    zoomOnStartGame (dt:number) {
        if (this.isZoomOnStartGameComplete == false) {
            if (this.isZoomOnStartGameBegan == false) {
                this.node.getComponent(cc.Camera).zoomRatio = ZOOM_ON_START_BEGIN;
                this.node.position = this.target.position;
                this.isZoomOnStartGameBegan = true;
            }
            
            if (this.timer >= ZOOM_ON_START_DELAY) {
                this.node.getComponent(cc.Camera).zoomRatio = ZOOM_ON_START_BEGIN - (this.timer - ZOOM_ON_START_DELAY) / ZOOM_ON_START_TIME;
                this.node.y = this.target.y + (this.canvas.node.height / 4) * (this.timer - ZOOM_ON_START_DELAY) / ZOOM_ON_START_TIME;
            }
    
            if (this.timer >= ZOOM_ON_START_TIME + ZOOM_ON_START_DELAY) {
                this.node.getComponent(cc.Camera).zoomRatio = 1;
                this.timer = 0;
                this.isZoomOnStartGameComplete = true;
            }
    
            this.timer += dt;
        }
    }

    zoomAndVibrate () {
        
    }
}
