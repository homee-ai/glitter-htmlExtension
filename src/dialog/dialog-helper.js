export class DialogHelper {
    static dataLoading(obj) {
        const glitter = window.glitter;
        if (obj.visible) {
            glitter.openDiaLog('dialog/dialog.js', 'dataLoading', { type: 'dataLoading', obj: obj });
        }
        else {
            glitter.closeDiaLog('dataLoading');
        }
    }
}
