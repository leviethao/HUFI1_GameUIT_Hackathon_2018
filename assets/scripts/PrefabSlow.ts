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
import Camera from "./Camera";
import Player from "./Player";
@ccclass
export default class NewClass extends cc.Component {
    
    canvas: cc.Canvas=null;
    camera:cc.Node=null;
    onLoad () {
    }
    init()
    {
        
          
        let street = this.canvas.node.getComponent(InGame).street;
        this.camera=this.canvas.node.getComponent(InGame).camera.getComponent(Camera).node;
        let y=this.camera.y*2;
        let randomx;
        if(this.canvas.node.getComponent(InGame).flagEntity==1)
        {
            randomx=cc.randomMinus1To1()*(street.width/2-this.node.width/2);
            if(randomx<65&&randomx>=0)
            {
                randomx=65+randomx;
            }
            else if(randomx>-65&&randomx<=0)
            {   
                randomx=-65-randomx;
            }
        }
        if(this.canvas.node.getComponent(InGame).flagEntity==2)
        {
            randomx=cc.randomMinus1To1()*(street.width/2-this.node.width/2-65);
        }
        this.node.position=this.node.position.add(new cc.Vec2(randomx,y));
    }
    start () {

    }

    update (dt) {
                //let player = this.canvas.getComponent(InGame).Player.getComponent(Player);
                if(this.node.position.y<=this.canvas.node.getComponent(InGame).player.getComponent(Player).node.height)
                {
                    this.node.destroy();
                }
    }
}
