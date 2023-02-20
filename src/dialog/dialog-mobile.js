export class Dialog {
    constructor(gvc) {
        const glitter = gvc.glitter;
        this.dataLoading = (show, text) => {
            switch (glitter.deviceType) {
                case glitter.deviceTypeEnum.Web:
                    if (show) {
                        glitter.openDiaLog(new URL('./dialog.js', import.meta.url).href, 'dataLoading', { type: 'dataLoading', obj: {
                                text: text
                            } });
                    }
                    else {
                        setTimeout(() => { glitter.closeDiaLog('dataLoading'); }, 500);
                    }
                    break;
                default:
                    glitter.runJsInterFace("dataLoading", { show: show, text: text }, (response) => { });
                    break;
            }
        };
        this.confirm = (title, callback) => {
            glitter.runJsInterFace("confirm", {
                title: title
            }, (response) => {
                callback(response);
            }, {
                webFunction(data, callback) {
                    return confirm(title);
                }
            });
        };
        this.showInfo = (title) => {
            glitter.runJsInterFace("showInfo", {
                title: title
            }, (response) => {
            }, {
                webFunction(data, callback) {
                    return confirm(title);
                }
            });
        };
    }
}