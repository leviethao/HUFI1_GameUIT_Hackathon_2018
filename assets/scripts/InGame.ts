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
import {SpriteType} from "./CoupleEntity";
import Camera from "./Camera"
import PrefabSlow from "./PrefabSlow";
import PrefabDoublePoint from "./PrefabDoublePoint";
import PrefabImmortal from "./PrefabImmortal";

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

    @property(cc.Node)
    backgound: cc.Node = null;

    @property(cc.Prefab)
    PrefabSlow: cc.Prefab = null;

    @property(cc.Prefab)
    PrefabDoublePoint: cc.Prefab = null;

    @property(cc.Prefab)
    PrefabImmortal: cc.Prefab = null

    @property(cc.Label)
    Delayx2: cc.Label = null;

    @property(cc.Label)
    Delaybt: cc.Label = null;

    prevEntityPosY: number;
    prevEntityPos: cc.Vec2;
    entityList: cc.Node[] = [];
    oldLevel: number = 0;
    level: number = 0;
    levelFactor: number = 0;
    score: number = 0;
    moveSpeedFactor: number = 0;
    isStarted: boolean = false;
    backgroundAudioID:number = 0;
    isSpawnAble: boolean = true;
    isChallenge1Active: boolean = false;
    isTutorialBegan: boolean = false;
    delay: number;
    flagEntity: number;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pauseMenu.active = false;
        this.levelFactor = this.gameSetting.getComponent(GameSetting).levelFactor;
        this.moveSpeedFactor = this.gameSetting.getComponent(GameSetting).moveSpeedFactor;
        this.backgroundAudioID = cc.audioEngine.play(this.backgroundAudio, true, 1);
    }

    start () {
        this.spawnEntity(this.node.height * 0.7);
        this.tutorialNode.active = false;
        this.delay=0;
        this.Delaybt.enabled=false;
        this.Delayx2.enabled=false;
    }

    update (dt) {
        this.delay=this.delay+dt;
        if((this.prevEntityPosY - this.camera.y <= this.node.height / 2))
        {
            if(this.delay>=3)
            {
            this.delay=0;
            this.spawmCN();
            }
        }
        if (this.camera.getComponent(Camera).isZoomOnStartGameComplete && this.isTutorialBegan == false) {
            this.enableTutorial();
            this.isTutorialBegan = true;
        }

        this.gainScore();

        if (this.prevEntityPosY - this.camera.y <= this.node.height / 2) {
            if (this.isSpawnAble) {
                this.spawnEntity(this.prevEntityPosY + this.node.height / 2);
            }
        }
        this.Delaybt.string=Math.floor(this.player.getComponent(Player).delaybt).toString();
        this.Delayx2.string=Math.floor(this.player.getComponent(Player).delayx2).toString();
        this.levelUp();

        if (this.level > this.oldLevel && this.level % 12 == 0) {
            this.challenge1();
            this.oldLevel = this.level;
            this.isSpawnAble = false;
        }

    }
    spawmCN()
    {
        let random=Math.round(cc.random0To1()*2);
        let CN: cc.Node;  
        if(random==0)
        {
            CN = cc.instantiate(this.PrefabDoublePoint);
            CN.getComponent(PrefabDoublePoint).canvas = this.node.getComponent(cc.Canvas);
            CN.getComponent(PrefabDoublePoint).init();
            this.node.addChild(CN);
        }      
        else if(random==1)
        {
            CN = cc.instantiate(this.PrefabImmortal);
            CN.getComponent(PrefabImmortal).canvas = this.node.getComponent(cc.Canvas);
            CN.getComponent(PrefabImmortal).init();
            this.node.addChild(CN);
        }
        else if(random==2)
        {
            CN = cc.instantiate(this.PrefabSlow);
            CN.getComponent(PrefabSlow).canvas = this.node.getComponent(cc.Canvas);
            CN.getComponent(PrefabSlow).init();
            this.node.addChild(CN);
        }

        this.camera.getComponent(cc.Camera).addTarget(CN);
    }
    spawnEntity (yPos: number, entityType?: number) : cc.Node {
        let entityPrefab: cc.Prefab = null;
        let count = 2;
        let rand = Math.floor(Math.random() * count) + 1;
        let entityComponent: string = "";

        switch (entityType? entityType : rand) {
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
        this.entityList.push(entity);
        entity.getComponent(entityComponent).canvasNode = this.node;
        entity.getComponent(entityComponent).init();


        let d2: number = this.computeD2(entity);
        let playerComponent = this.player.getComponent(Player);
        let d1Needed = (d2 * playerComponent.moveSpeed) / playerComponent.shrinkSpeed;
        let maxY = 100;
        let minY = 50;
        let randY = Math.floor(Math.random() * maxY + minY);
        let d1 = d1Needed + randY + this.player.y;


        entity.position = new cc.Vec2(0, Math.max(yPos, d1));
        this.prevEntityPosY = entity.y;
        
        this.Ui.setLocalZOrder(entity.getLocalZOrder() + 1);
        return entity;
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
        this.score = Math.floor(this.player.y / this.gameSetting.getComponent(GameSetting).scoreFactor);
        this.updateScoreLabel();   
    }

    levelUp () {
        if (this.score - (this.level * this.levelFactor) >= this.levelFactor){
            this.level++;
            this.player.getComponent(Player).moveSpeed += this.moveSpeedFactor;
        }
    }

    updateScoreLabel () {
        this.scoreLabel.string = this.score.toString() + "m";
    }

    enableTutorial () {
        if (!this.isStarted) {
            this.tutorialNode.active = true;
            this.tutorialNode.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.1), cc.scaleTo(0.5, 1))));
        }
    }

    disableTutorial () {
        this.isStarted = true;
        this.tutorialNode.stopAllActions();
        this.tutorialNode.active = false;
    }

    challenge1 () {
        let coupleEntity = this.spawnEntity(this.prevEntityPosY + this.node.height * 0.7, 2);
        coupleEntity.getComponent(CoupleEntity).changeSprite(SpriteType.MotoBike);
        coupleEntity.getComponent(CoupleEntity).isChallenge1Active = true;
    }

    decreaseCoordinate () {
        let yLimit = 1000;
        if (this.player.y >= yLimit) {
            this.player.y -= yLimit;
            this.backgound.y -= yLimit;
            for (let entity of this.entityList) {
                entity.y -= yLimit;
            }
        }
    }
}