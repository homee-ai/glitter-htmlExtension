'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {Api} from "../homee/api/homee-api.js";

Plugin.create(import.meta.url,(glitter)=>{
    const api={
        upload:(photoFile:any,callback:(link:string)=>void)=>{
            glitter.share.dialog.dataLoading({text:'上傳中',visible:true})
            $.ajax({
                url: Api.serverURL+'/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name:`${new Date().getTime()}`}),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.getCookieByName('token') },
                success: (data1: { url: string; fullUrl: string }) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2: any) => {
                            glitter.share.dialog.dataLoading({visible:false})
                            glitter.share.dialog.successMessage({text:"上傳成功"})
                            callback(data1.fullUrl)
                        },
                        error: (err: any) => {
                            glitter.share.dialog.successMessage({text:"上傳失敗"})
                        },
                    });
                },
                error: (err: any) => {
                    glitter.share.dialog.successMessage({text:"上傳失敗"})
                },
            });
        }
    }
    return {
        nav: {
            defaultData:{
                topInset :10,

            },
            render:(gvc, widget, setting, hoverID) => {
                const data: { link: { img: string,code?:string }[] } = widget.data

                return {
                    view: ()=>{

                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (widget.data.topInset != response.data){
                                widget.data.topInset = response.data;
                                gvc.notifyDataChange('mainView')
                            }
                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })
                        return `
                            <div class="w-100 d-flex" style="padding-right: 26px;padding-top: ${10 + widget.data.topInset }px;">
                                ${gvc.bindView(() => {
                                    var noticeCount = 0
                                    glitter.runJsInterFace("setNotificationBadgeCallBack", {}, (response) => {
                                        noticeCount = parseInt(response.data, 10)
                                        gvc.notifyDataChange('notification')
                                    })
                                    return {
                                        bind: `notification`,
                                        view: () => {
                                            return ` 
                                            <img class="ms-auto" src="img/notify.svg" alt="" onclick="${gvc.event(() => {
                                                glitter.runJsInterFace("noticeBell", {}, () => {
                                                })
                                            })}">
                                            ${(noticeCount > 0) ? `<div class="mySpaceCount" style="position: absolute;right:-4px;top:-4px;z-index: 5;">${noticeCount}</div>` : ``}
                                     `
                                            },
                                            divCreate: {class: `ms-auto position-relative`},
                                            onCreate: () => {
                                            }
                                        }
                                    })}
                                <img  src="img/setting.svg" alt="" style="margin-left: 20px" onclick="${gvc.event(() => {
                                    glitter.changePage('', "", true, {})
                                })}">
                            </div>
                        `

                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },

    }
});