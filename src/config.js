import { Plugin } from "./glitterBundle/plugins/plugin-creater.js";
import { Api } from "./homee/api/homee-api.js";
import { DialogHelper } from "./dialog/dialog-helper.js";
import { LegacyPage } from "./homee/legacy/interface.js";
export function appConfig() {
    return Plugin.getAppConfig("HOMEEAppConfig", {
        serverURL: "http://127.0.0.1:3080",
        token: "",
        uploadImage: (photoFile, callback) => {
            const glitter = window.glitter;
            glitter.share.dialog.dataLoading({ text: '上傳中', visible: true });
            $.ajax({
                url: Api.serverURL + '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name: `${new Date().getTime()}` }),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: appConfig().token },
                success: (data1) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2) => {
                            glitter.share.dialog.dataLoading({ visible: false });
                            glitter.share.dialog.successMessage({ text: "上傳成功" });
                            callback(data1.fullUrl);
                        },
                        error: (err) => {
                            glitter.share.dialog.successMessage({ text: "上傳失敗" });
                        },
                    });
                },
                error: (err) => {
                    glitter.share.dialog.dataLoading({ visible: false });
                    glitter.share.dialog.successMessage({ text: "上傳失敗" });
                },
            });
        },
        changePage: (gvc, tag) => {
            const api = new Api();
            DialogHelper.dataLoading({
                text: "",
                visible: true
            });
            api.homeeAJAX({ api: Api.serverURL, route: '/api/v1/lowCode/pageConfig?query=config&tag=' + tag, method: 'get' }, (res) => {
                LegacyPage.execute(gvc.glitter, () => {
                    DialogHelper.dataLoading({
                        text: "",
                        visible: false
                    });
                    gvc.glitter.changePage(LegacyPage.getLink("jsPage/htmlGenerater.js"), tag, true, res.result[0].config);
                });
            });
        }
    });
}
