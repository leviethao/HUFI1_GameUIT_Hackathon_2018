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


    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    bestScoreLabel: cc.Label = null;

    // @property(cc.Node)
    // ads: cc.Node = null;

    @property(cc.Node)
    gameOverForm: cc.Node = null;

    // @property({url: cc.AudioClip})
    // backgroundAudio: cc.AudioClip = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scoreLabel.string = "Score: " + cc.sys.localStorage.getItem("score");
        this.bestScoreLabel.string = cc.sys.localStorage.getItem("bestScore");
        //cc.audioEngine
    }

    start () {
        //this.gameOverForm.active = false;
        //this.ads.active = true;
    }

    // update (dt) {}

    onReplayBtnClicked () {
        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
            cc.director.loadScene("InGame");
        })));
    }

    onMainMenuBtnClicked () {
        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
            cc.director.loadScene("GameStart");
        })));
    }

    onExitBtnClicked () {
        cc.game.end();
    }

    // onQuitAdsBtnClicked () {
    //     this.ads.active = false;
    //     this.gameOverForm.active = true;
    // }
}
