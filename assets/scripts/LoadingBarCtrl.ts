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

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    resources: any = null;
    progress: number = 0;
    completedCount: number = 0;
    totalCount: number = 0;
    progressSpeed: number = 0.5;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.progressBar.progress = 0;
        cc.loader.releaseAll();
        if (this.resources) {
            return;
        }

        cc.loader.loadResDir("", this.progressCallback.bind(this), this.completeCallback.bind(this));
    }

    start () {

    }

    update (dt) {
        if (!this.resources) {
            return;
        }

        let progress = this.progressBar.progress;
        if (progress >= 1) {
            this.completed();
            return;
        }

        if (progress < this.progress) {
            progress += this.progressSpeed * dt;
        }

        this.progressBar.progress = progress;
    }

    
    progressCallback (completedCount, totalCount, res) {
        this.progress = completedCount / totalCount;
        this.resources = res;
        this.completedCount = completedCount;
        this.totalCount = totalCount;
    }

    completeCallback (error, res) {
        console.log("LOADED COMPLETED: ");
        console.log(res);
    }

    completed () {
        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
            cc.director.loadScene("GameStart");
        })));
    }
}
