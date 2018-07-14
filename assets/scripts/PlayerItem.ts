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
import Player from "./Player";

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    @property({url: cc.AudioClip})
    sound: cc.AudioClip = null;

    @property({url: cc.AudioClip})
    hug: cc.AudioClip = null;

    flag: boolean = false;

    speed:number;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    start () {
        this.speed=this.canvas.node.getComponent(InGame).player.getComponent(Player).moveSpeed;
    }

    // update (dt) {}

    onCollisionEnter (other, self) {
        switch (other.tag) {
            case 0: { //left player
                //this.canvas.node.getComponent(InGame).gameOver();
                //cc.audioEngine.play(this.sound, false, 1);
            } break;
            case 1: {//right player
                if(this.canvas.node.getComponent(InGame).player.getComponent(Player).statusbt==1)
                {
                }
                else
                {
                this.flag = true;
                cc.audioEngine.play(this.sound, false, 1);
                let animState = this.node.parent.getChildByName("anim").active = true;
                this.node.parent.getComponent(Player).moveSpeed = 0;
                this.canvas.node.getComponent(InGame).gameOver();
                }
            } break;
            case 2: { //entity
                if(this.canvas.node.getComponent(InGame).player.getComponent(Player).statusbt==1)
                {
                }
                else
                {
                cc.audioEngine.play(this.hug, false, 1);
                this.node.parent.getComponent(Player).moveSpeed = 0;
                this.canvas.node.getComponent(InGame).gameOver();
                }
            } break; 
            case 10:
            {
                this.canvas.node.getComponent(InGame).player.getComponent(Player).statusx2=1;
                this.canvas.node.getComponent(InGame).player.getComponent(Player).delayx2=0;
                if(this.canvas.node.getComponent(InGame).Delaybt.enabled==true)
                {
                    this.canvas.node.getComponent(InGame).Delaybt.enabled=false;
                }
                this.canvas.node.getComponent(InGame).Delayx2.enabled=true;
            }
            case 11:
            {
                this.canvas.node.getComponent(InGame).player.getComponent(Player).statusbt=1;
                this.canvas.node.getComponent(InGame).player.getComponent(Player).delaybt=0;
                if(this.canvas.node.getComponent(InGame).Delayx2.enabled==true)
                {
                    this.canvas.node.getComponent(InGame).Delayx2.enabled=false;
                }
                this.canvas.node.getComponent(InGame).Delaybt.enabled=true;
                
            }break;
            case 12: 
            {  
                this.canvas.node.getComponent(InGame).player.getComponent(Player).moveSpeed-=100;               
                
            } break;
        }
    }
}
