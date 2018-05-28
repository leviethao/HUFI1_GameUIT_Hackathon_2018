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

    // LIFE-CYCLE CALLBACKS:
    @property({url: cc.AudioClip})
    backgroundAudio: cc.AudioClip = null;

    audioId:number = 0;
    // onLoad () {}

    start () {
        this.audioId = cc.audioEngine.play(this.backgroundAudio, true, 1);
    }

    // update (dt) {}

    onPlayBtnClicked () {
        cc.audioEngine.stop(this.audioId);
        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
            cc.director.loadScene("InGame");
        })));
    }

    onQuitBtnClicked () {
        cc.game.end();
    }
}
