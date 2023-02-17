import {Plugin} from "./glitterBundle/plugins/plugin-creater.js";
import {Api} from "./homee/api/homee-api.js";
import {DialogHelper} from "./dialog/dialog-helper.js";
import {LegacyPage} from "./homee/legacy/interface.js";
import {GVC} from "./glitterBundle/GVController.js";

export function appConfig(): {
    //HOMEE API backend route
    serverURL: string,
    //HOMEE API token
    token: string,
    //Upload image
    uploadImage: (photoFile: any, callback: (result: string) => void) => void,
    //Change to other page
    changePage: (gvc: GVC, tag: string, obj?: any) => void
} {
    return Plugin.getAppConfig("HOMEEAppConfig", {
        serverURL: "http://127.0.0.1:3080",
        token: "",
        uploadImage: (photoFile: any, callback: (result: string) => void) => {
            const glitter = (window as any).glitter
            glitter.share.dialog.dataLoading({text: '上傳中', visible: true})
            $.ajax({
                url: Api.serverURL + '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({file_name: `${new Date().getTime()}`}),
                contentType: 'application/json; charset=utf-8',
                headers: {Authorization: appConfig().token},
                success: (data1: { url: string; fullUrl: string }) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2: any) => {
                            glitter.share.dialog.dataLoading({visible: false})
                            glitter.share.dialog.successMessage({text: "上傳成功"})
                            callback(data1.fullUrl)
                        },
                        error: (err: any) => {
                            glitter.share.dialog.successMessage({text: "上傳失敗"})
                        },
                    });
                },
                error: (err: any) => {
                    glitter.share.dialog.dataLoading({visible: false})
                    glitter.share.dialog.successMessage({text: "上傳失敗"})
                },
            });
        },
        changePage: (gvc: GVC, tag: string, obj?: any) => {
            const api = new Api()
            DialogHelper.dataLoading({
                text: "",
                visible: true
            })
            api.homeeAJAX({
                api: Api.serverURL,
                route: '/api/v1/lowCode/pageConfig?query=config&tag=' + tag,
                method: 'get'
            }, (res) => {
                DialogHelper.dataLoading({
                    text: "",
                    visible: false
                })
                gvc.glitter.changePage(
                    `${new URL('./htmlGenerater.js', import.meta.url)}`,
                    tag,
                    true,
                    {
                        config: res.result[0].config,
                        data: obj
                    })
                setTimeout(() => {
                    DialogHelper.dataLoading({
                        text: "",
                        visible: false,
                    })
                })
            })
        }
    })
}