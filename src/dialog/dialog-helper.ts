export class DialogHelper {
    public static dataLoading(obj: { text?: string; visible: boolean }) {
        const glitter=(window as any).glitter
        if (obj.visible) {
            glitter.openDiaLog('dialog/dialog.js', 'dataLoading', {type: 'dataLoading', obj: obj})
        } else {
            glitter.closeDiaLog('dataLoading')
        }
    }
}