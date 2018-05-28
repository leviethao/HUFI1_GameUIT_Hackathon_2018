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

import CoupleEntity from "./CoupleEntity";
import SimpleEntity from "./SimpleEntity";
import Player from "./Player";
import GameSetting from "./GameSetting";
import PlayerItem from "./PlayerItem";


@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    gameSetting: cc.Node = null;

    @property(cc.Node)
    pauseMenu: cc.Node = null;

    @property(cc.Prefab)
    simpleEntityPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    coupleEntityPrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    camera: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Node)
    street: cc.Node = null;

    @property(cc.Node)
    tutorialNode: cc.Node = null;

    @property(cc.Node)
    Ui: cc.Node = null;

    @property({url: cc.AudioClip})
    backgroundAudio: cc.AudioClip = null;


    prevEntityPosY: number;
    entityList: cc.Node[] = [];
    level: number = 0;
    levelFactor: number = 0;
    score: number = 0;
    moveSpeedFactor: number = 0;
    isStarted: boolean = false;
    backgroundAudioID:number = 0;



    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pauseMenu.active = false;
        this.levelFactor = this.gameSetting.getComponent(GameSetting).levelFactor;
        this.moveSpeedFactor = this.gameSetting.getComponent(GameSetting).moveSpeedFactor;
        this.backgroundAudioID = cc.audioEngine.play(this.backgroundAudio, true, 1);
    }

    start () {
        this.spawnEntity(this.node.height * 0.7);
        this.enableTutorial();
    }

    update (dt) {

        if (this.prevEntityPosY - this.camera.y <= this.node.height / 2) {
            this.spawnEntity(this.prevEntityPosY + this.node.height / 2);
        }

        this.levelUp();
    }

    spawnEntity (yPos: number) {
        let entityPrefab: cc.Prefab = null;
        let count = 2;
        let rand = Math.floor(Math.random() * count) + 1;
        let entityComponent: string = "";

        switch (rand) {
            case 1: {
                entityPrefab = this.simpleEntityPrefab;
                entityComponent = "SimpleEntity";
            } break;
            case 2: {
                entityPrefab = this.coupleEntityPrefab;
                entityComponent = "CoupleEntity";
            } break;
        }

        let entity = cc.instantiate(entityPrefab);
        this.node.addChild(entity);
        entity.getComponent(entityComponent).canvasNode = this.node;
        entity.getComponent(entityComponent).init();


        let d2: number = this.computeD2(entity);
        let playerComponent = this.player.getComponent(Player);
        let d1Needed = (d2 * playerComponent.moveSpeed) / playerComponent.shrinkSpeed;
        let maxY = 100;
        let minY = 50;
        let randY = Math.floor(Math.random() * maxY + minY);
        let d1 = d1Needed + randY;


        entity.position = new cc.Vec2(0, Math.max(yPos, d1));
        this.prevEntityPosY = entity.y;
        
        this.Ui.setLocalZOrder(entity.getLocalZOrder() + 1);
        
    }

    gameOver () {
        //save score
        let best = cc.sys.localStorage.getItem("bestScore");
        if (best == null) {
            cc.sys.localStorage.setItem("bestScore", this.score);   
        }

        if (this.score > best) {
            //save best score
            cc.sys.localStorage.setItem("bestScore", this.score);
        }
        
        cc.sys.localStorage.setItem("score", this.score);

        cc.audioEngine.stop(this.backgroundAudioID);

        let self = this;
        if (this.player.getChildByName("LeftItem").getComponent(PlayerItem).flag == true) {
            this.node.runAction(cc.sequence(cc.delayTime(2), cc.fadeOut(0.2), cc.callFunc(function () {
                //animState.stop();
                cc.director.loadScene("GameOver");
            })));
        }
        else {
            this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
                //animState.stop();
                cc.director.loadScene("GameOver");
            })));
        }
            
        

        
    }

    onPauseBtnClicked () {
        this.pauseMenu.active = true;
        cc.director.pause();
    }

    onResumeBtnClicked () {
        cc.director.resume();
        this.pauseMenu.active = false;
    }

    onReplayBtnClicked () {
        cc.director.resume();
        cc.audioEngine.stop(this.backgroundAudioID);
        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
            cc.director.loadScene("InGame");
        })));
    }

    onMainMenuBtnClicked () {
        cc.director.resume();
        cc.audioEngine.stop(this.backgroundAudioID);
        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
            cc.director.loadScene("GameStart");
        })));
    }

    onExitBtnClicked () {
        cc.director.resume();
        cc.game.end();
    }

    computeD2 (entity: cc.Node) : number {
        let playerRightItem: cc.Node = this.player.getChildByName("RightItem");
        let d2:number = 0;

        switch (entity.name) {
            case "SimpleEntity": {
                let entityItem = entity.getChildByName("Item");
                if (playerRightItem.x - playerRightItem.width / 2 <= entityItem.width / 2) {
                    d2 =  entityItem.width / 2 - (playerRightItem.x - playerRightItem.width / 2);
                } else {
                    d2 = 0;
                }
            } break;
            case "CoupleEntity" : {
                let entityRightItem = entity.getChildByName("RightItem");
                if (playerRightItem.x + playerRightItem.width / 2 >= entityRightItem.x - entityRightItem.width) {
                    d2 = playerRightItem.x + playerRightItem.width / 2 - (entityRightItem.x - entityRightItem.width); 
                }  else {
                    d2 = 0;
                }
            } break;
        }

        return d2;
    }

    gainScore () {
        this.score++;
        this.updateScoreLabel();
    }

    levelUp () {
        if (this.score - (this.level * this.levelFactor) >= this.levelFactor){
            this.level++;
            this.player.getComponent(Player).moveSpeed += this.moveSpeedFactor;
        }
    }

    updateScoreLabel () {
        this.scoreLabel.string = this.score.toString();
    }

    enableTutorial () {
        if (!this.isStarted) {
            this.tutorialNode.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.1), cc.scaleTo(0.5, 1))));
        }
    }

    disableTutorial () {
        this.isStarted = true;
        this.tutorialNode.stopAllActions();
        this.tutorialNode.active = false;
    }
}