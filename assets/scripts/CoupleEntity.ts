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
import Player from "./Player";

export enum SpriteType {
    Car1 = 0,
    Car2 = 1,
    Car3 = 2,
    MotoBike = 3,
    Taxi = 4
}

@ccclass
export default class NewClass extends cc.Component {

    leftItem: cc.Node = null;
    rightItem: cc.Node = null;
    canvasNode: cc.Node = null;
    isMoveUp: boolean = false;
    isShrinkBack: boolean = false;
    isGrownUp: boolean = false;
    isChallenge1Active: boolean = false;
    actionRepeatCount: number = 0;
    moveSpeed: number = 0;
    countFlag: boolean = false;
    delayCountFlag: boolean = true;
    challenge1_next1_flag: boolean = false;
    newEntity: cc.Node = null;
    isAssociate: boolean = false;
    isStaging: boolean = false;
    isSwinging: boolean = false;
    shrinkSpeed: number = 0;
    swingingCount: number = 0;


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
        
        this.shrinkSpeed = this.canvasNode.getComponent(InGame).player.getComponent(Player).shrinkSpeed * 3;
    }

    start () {

    }

    update (dt) {
        //this.node.y -= 100 * dt;
        this.moveUp(dt);
        this.shrinkBack(dt);
        this.grownUP(dt);
        this.runActionChallenge1();
    }

    runActionChallenge1 () {

        if (!this.isChallenge1Active) {
            //this.isChallenge1Active = false;
            return;
        }

        if (this.challenge1_next1_flag) {
            this.runActionChallenge1_next1();
            return;
        }

        //this.actionRepeatCount++;

        let player = this.canvasNode.getComponent(InGame).player;

        if (player.y >= this.node.y + this.leftItem.height) {
            if (this.actionRepeatCount >= 2) {
                this.spawnEntityChallenge1_next1();
            }


            this.isGrownUp = true;
            this.isShrinkBack = false;
            this.isMoveUp = true;
            this.moveSpeed = player.getComponent(Player).moveSpeed;
            this.countFlag = true;
            this.delayCountFlag = false;
        }

        let street = this.canvasNode.getComponent(InGame).street;

        if (this.rightItem.x >= street.width / 2) {
            this.moveSpeed = player.getComponent(Player).moveSpeed * 1.5;
        }

        if (this.node.y > player.y + this.leftItem.height && this.isMoveUp) {
            this.isShrinkBack = true;
            this.isGrownUp = false;
        }

        if (this.rightItem.x - this.leftItem.x <= this.leftItem.width * 2) {
            if (this.countFlag && this.delayCountFlag) {
                this.actionRepeatCount++;
                this.countFlag = false;
            }

            this.delayCountFlag = true;
            this.moveSpeed = player.getComponent(Player).moveSpeed * 0.5;
        }
    }

    moveUp (dt: number) {
        if (this.isMoveUp) {
            let player = this.canvasNode.getComponent(InGame).player;
            this.node.y +=  this.moveSpeed * dt;
        }
    }

    shrinkBack (dt: number) {
        if (this.isShrinkBack) {
            if (this.rightItem.x - this.leftItem.x <= this.leftItem.width * 2) {
                this.leftItem.x = -this.leftItem.width;
                this.rightItem.x = this.rightItem.width;  
                this.isShrinkBack = false;  
                return;
            }

            this.leftItem.x += this.shrinkSpeed * dt;
            this.rightItem.x -= this.shrinkSpeed * dt;
        }
    }

    grownUP (dt: number) {
        if (this.isGrownUp) {
            let street = this.canvasNode.getComponent(InGame).street;
            if (this.rightItem.x >= street.width / 2) {
                this.leftItem.x = -street.width / 2;
                this.rightItem.x = street.width / 2;    
                this.isGrownUp = false;
                return;
            }

            this.leftItem.x -= this.shrinkSpeed * dt;
            this.rightItem.x += this.shrinkSpeed * dt;
        }
    }

    changeSprite (spriteType: SpriteType) {
        //let type: number = spriteType as number;
        let entityList = this.canvasNode.getComponent(InGame).gameSetting.getComponent(GameSetting).entityList;
        this.leftItem.getComponent(cc.Sprite).spriteFrame = entityList[spriteType].getComponent(cc.Sprite).spriteFrame.clone();
        this.rightItem.getComponent(cc.Sprite).spriteFrame = entityList[spriteType].getComponent(cc.Sprite).spriteFrame.clone();
        this.leftItem.setContentSize(entityList[spriteType].getContentSize());
        this.rightItem.setContentSize(entityList[spriteType].getContentSize());
        //this.leftItem.anchorX = 0;
        //this.rightItem.anchorX = 1;

        this.leftItem.getComponent(cc.BoxCollider).size = this.leftItem.getContentSize();
        this.leftItem.getComponent(cc.BoxCollider).offset = new cc.Vec2(this.leftItem.width / 2, 0);
        this.rightItem.getComponent(cc.BoxCollider).size = this.leftItem.getComponent(cc.BoxCollider).size;
        this.rightItem.getComponent(cc.BoxCollider).offset = new cc.Vec2(-this.rightItem.width / 2, 0);
    }

    spawnEntityChallenge1_next1 () {
        
        if (!this.challenge1_next1_flag) {
            this.newEntity = this.canvasNode.getComponent(InGame).spawnEntity(this.node.y + this.canvasNode.height * 1.2 , 2);
            this.newEntity.getComponent("CoupleEntity").changeSprite(SpriteType.MotoBike);
            this.challenge1_next1_flag = true;
        }
    }

    runActionChallenge1_next1 () {
        if (!this.isAssociate) {
            
            let street = this.canvasNode.getComponent(InGame).street;
            if (this.rightItem.x >= street.width / 2) {
                this.moveSpeed =  this.canvasNode.getComponent(InGame).player.getComponent(Player).moveSpeed * 1.5;
            }

            if (this.node.y + this.leftItem.height / 2 >= this.newEntity.y - this.newEntity.getChildByName("LeftItem").height / 2) {
                this.node.y = this.newEntity.y - this.newEntity.getChildByName("LeftItem").height / 2 - this.leftItem.height / 2;
                this.isMoveUp = true;
                this.moveSpeed = this.canvasNode.getComponent(InGame).player.getComponent(Player).moveSpeed * 1.5;
                this.isAssociate = true;
                //this.isChallenge1Active = false;
            }
        }

        if (this.isAssociate) {
            if (!this.isStaging) {
                this.newEntity.getComponent("CoupleEntity").isMoveUp = true;
                this.newEntity.getComponent("CoupleEntity").moveSpeed = this.moveSpeed;
                
                if (this.node.y - this.leftItem.height / 2 > this.canvasNode.getComponent(InGame).player.y + this.canvasNode.getComponent(InGame).player.getChildByName("LeftItem").height / 2 + this.leftItem.height * 2) {
                    this.isStaging = true;
                    //this.isAssociate = false;
                    console.log("STAGING");    
                }
            }

            if (this.isStaging) {
                
                if (!this.isSwinging) {
                    this.moveSpeed = this.canvasNode.getComponent(InGame).player.getComponent(Player).moveSpeed * 0.7;
                    this.newEntity.getComponent("CoupleEntity").moveSpeed = this.moveSpeed;
                    this.isShrinkBack = true;
                    if (this.rightItem.x - this.leftItem.x <= this.leftItem.width * 2) {
                        this.moveSpeed = this.canvasNode.getComponent(InGame).player.getComponent(Player).moveSpeed * 1.5;
                        if (this.node.y >= this.newEntity.y) {
                            this.node.y = this.newEntity.y;
                            this.moveSpeed = this.newEntity.getComponent("CoupleEntity").moveSpeed;

                            if (this.node.y <= this.canvasNode.getComponent(InGame).player.y) {
                                this.node.y = this.canvasNode.getComponent(InGame).player.y;
                                this.moveSpeed = this.canvasNode.getComponent(InGame).player.getComponent(Player).moveSpeed;
                                this.newEntity.getComponent("CoupleEntity").moveSpeed = this.moveSpeed;
                                this.isSwinging = true;
                            }
                        }
                    }
                }
                else {
                    let player = this.canvasNode.getComponent(InGame).player;
                    this.shrinkSpeed = player.getComponent(Player).shrinkSpeed / 2;
                    if (this.rightItem.x - this.leftItem.x <= this.leftItem.width * 2) {
                        this.swingingCount++;
                        if (this.swingingCount >= 3) {
                            this.isChallenge1Active = false;
                            this.isMoveUp = false;
                            this.newEntity.getComponent("CoupleEntity").isMoveUp = false;
                            this.canvasNode.getComponent(InGame).spawnEntity(this.canvasNode.getComponent(InGame).player.y + this.canvasNode.height, 1);
                            this.canvasNode.getComponent(InGame).isSpawnAble = true;
                        }
                        this.isShrinkBack = false;
                        this.isGrownUp = true;
                        this.moveSpeed = player.getComponent(Player).moveSpeed * 1.5;
                        this.newEntity.getComponent("CoupleEntity").moveSpeed = this.moveSpeed;
                    }
                    if (this.newEntity.getChildByName("RightItem").x - this.newEntity.getChildByName("RightItem").width - this.rightItem.x <= this.canvasNode.getComponent(InGame).player.getChildByName("RightItem").width * 2) {
                        this.isGrownUp = false;
                        this.isShrinkBack = true;
                        this.moveSpeed = player.getComponent(Player).moveSpeed * 0.5;
                        this.newEntity.getComponent("CoupleEntity").moveSpeed = this.moveSpeed;
                    }
                }
            }
        }
    }
}
