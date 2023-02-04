export class DialogHelper {
    static dataLoading(obj) {
        const glitter = window.glitter;
        if (obj.visible) {
            glitter.openDiaLog(new URL('./dialog.js', import.meta.url), 'dataLoading', { type: 'dataLoading', obj: obj });
        }
        else {
            glitter.closeDiaLog('dataLoading');
        }
    }
}
