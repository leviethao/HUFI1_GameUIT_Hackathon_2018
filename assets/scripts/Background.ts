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
import CoupleEntity from "./CoupleEntity";
import GameSetting from "./GameSetting";
import {SpriteType} from "./CoupleEntity";
const HEM_SIZE = 225;
const STREET_SIZE = 561;
const DAU_HEM_DISTANCE = 260;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    camera: cc.Node = null;

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    item1: cc.Node = null;
    item2: cc.Node = null;
    ngaTu: cc.Node = null;
    dauHem: cc.Node = null;
    trongHem: cc.Node = null;
    cuoiHem: cc.Node = null;

    items: cc.Node[] = [];
    prevCameraPosY: number;
    //normalBackground: cc.SpriteFrame = null;
    //ngaTuBackground: cc.SpriteFrame = null;
    oldLevel: number;
    isChallengeNgaTuActive: boolean = false;
    isChallengeHemActive: boolean = false;
    dauHemPoint: number = 0;
    cuoiHemPoint: number = 0;
    challengeHemCount: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.item1 = this.node.getChildByName("Item1");
        this.item2 = this.node.getChildByName("Item2");
        this.ngaTu = this.node.getChildByName("NgaTu");
        this.dauHem = this.node.getChildByName("DauHem");
        this.trongHem = this.node.getChildByName("TrongHem");
        this.cuoiHem = this.node.getChildByName("CuoiHem");
        this.items = [this.item1, this.item2];

        //item location at begin
        this.item2.y = this.item1.y + this.item1.height;

        this.prevCameraPosY = this.camera.y;

        //this.normalBackground = item1.getComponent(cc.Sprite).spriteFrame;
        //this.ngaTuBackground = this.node.getChildByName("NgaTu").getComponent(cc.Sprite).spriteFrame;
        this.oldLevel = this.canvas.node.getComponent(InGame).level;
    }

    start () {

    }

    update (dt) {
        if (this.camera.y - this.prevCameraPosY >= this.items[0].height) {
            this.scroll();
            this.prevCameraPosY += this.items[0].height;
            
            //this.changeBackground(this.item1);
            if (this.canvas.node.getComponent(InGame).level > this.oldLevel) {
                if (this.canvas.node.getComponent(InGame).level == 5) {
                    this.isChallengeHemActive = true;
                }

                if (this.canvas.node.getComponent(InGame).level % 3 == 0) {
                    this.isChallengeNgaTuActive = true;
                }

                this.oldLevel = this.canvas.node.getComponent(InGame).level;
            }

            this.changeBackground(this.item1);

            if (this.isChallengeHemActive) {
                this.challengeHem();
            }

            if (this.isChallengeNgaTuActive) {
                this.challengeNgaTu();
            }
        }

        if (this.isChallengeHemActive && this.canvas.node.getComponent(InGame).player.y + this.canvas.node.getComponent(InGame).player.getChildByName("LeftItem").height / 2 > this.dauHemPoint) {
            this.canvas.node.getComponent(InGame).street.width = HEM_SIZE;
        } else if (this.isChallengeHemActive == false && this.canvas.node.getComponent(InGame).player.y - this.canvas.node.getComponent(InGame).player.getChildByName("LeftItem").height / 2 > this.cuoiHemPoint) {
            this.canvas.node.getComponent(InGame).street.width = STREET_SIZE;
        }
    }

    scroll () {
        this.items[0].y = this.items[1].y + this.items[1].height;
        //swap
        [this.items[0], this.items[1]] = [this.items[1], this.items[0]];
    }

    changeBackground (item: cc.Node) {
        //this.items[0].getComponent(cc.Sprite).spriteFrame = spriteFrame;
        let backgroudItem: cc.Node = item;

        if (backgroudItem.name == this.item1.name || backgroudItem.name == this.item2.name) {

            let flag: boolean = true;
            for (let i = 0; i < this.items.length; ++i) {
                if (this.items[i].name != this.item1.name && this.items[i].name != this.item2.name) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                return;
            }

            if (this.items[0].name == this.item1.name) {
                backgroudItem = this.item2;
            } else if (this.items[0].name == this.item2.name) {
                backgroudItem = this.item1;
            }
        }

        
        if (backgroudItem.name != this.items[1].name) {
            backgroudItem.position = new cc.Vec2(this.items[1].x, this.items[1].y);    
            this.removeBackgroundItem(this.items[1]);
            this.items[1] = backgroudItem;
            //this.items[1].getComponent(cc.Sprite).spriteFrame = spriteFrame;    
        }
        
    }

    removeBackgroundItem (item: cc.Node) {
        item.x = 3000;
    }

    challengeNgaTu () {
        
        this.changeBackground(this.ngaTu);
        let entity = this.canvas.node.getComponent(InGame).spawnEntity(this.items[1].y, 2);
        entity.getComponent(CoupleEntity).changeSprite(SpriteType.Taxi);
        entity.getComponent(CoupleEntity).leftItem.rotation = -90;
        entity.getComponent(CoupleEntity).rightItem.rotation = 90;
        
        this.isChallengeNgaTuActive = false;
    }

    challengeHem () {
        // this.canvas.getComponent(InGame).isSpawnAble = false;
        // if (this.items[0].name == this.cuoiHem.name) {
        //     this.isChallengeHemActive = false;
        //     this.canvas.node.getComponent(InGame).spawnEntity(this.canvas.node.getComponent(InGame).player.y + this.canvas.node.height, 1);
        //     this.canvas.getComponent(InGame).isSpawnAble = true; console.log("HET HEM");
        //     return;
        // } else if (this.items[0].name == this.trongHem.name) {
        //     this.changeBackground(this.cuoiHem); console.log("CUOI HEM");
        //     this.cuoiHemPoint = this.items[1].y - DAU_HEM_DISTANCE;
        // } else if (this.items[0].name == this.dauHem.name) {
        //     this.changeBackground(this.trongHem); console.log("TRONG HEM");
        // } else {
        //     this.changeBackground(this.dauHem); console.log("DAU HEM");
        //     this.dauHemPoint = this.items[1].y + DAU_HEM_DISTANCE;
        // }

        this.canvas.getComponent(InGame).isSpawnAble = false;
        if (this.challengeHemCount == 3) {
            this.isChallengeHemActive = false;
            this.canvas.node.getComponent(InGame).spawnEntity(this.canvas.node.getComponent(InGame).player.y + this.canvas.node.height, 1);
            this.canvas.getComponent(InGame).isSpawnAble = true; console.log("HET HEM");
            this.challengeHemCount = 0;
            return;
        } else if (this.challengeHemCount == 0) {
            this.changeBackground(this.dauHem); console.log("DAU HEM");
            this.dauHemPoint = this.items[1].y + DAU_HEM_DISTANCE; 
            this.challengeHemCount++;
        } else if (this.challengeHemCount == 1) {
            this.changeBackground(this.trongHem); console.log("TRONG HEM");
            this.challengeHemCount++;
        } else {
            this.changeBackground(this.cuoiHem); console.log("CUOI HEM");
            this.cuoiHemPoint = this.items[1].y - DAU_HEM_DISTANCE;
            this.challengeHemCount++;
        }
    }
}
