'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {Api} from "../homee/api/homee-api.js";
import {SharedView} from "../homee/shareView.js";

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
                nav:{
                    leftIcon:import.meta.resolve!('../img/component/left-arrow.svg',import.meta.url),
                    leftPage:"",
                },

            },
            render:(gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    html{
                        margin: 0;
                        box-sizing: border-box;    
                        font-family: 'Noto Sans TC';        
                    }
                    .voucherInput{                        
                        font-style: normal;
                        font-weight: 400;
                        font-size: 14px;
                    }
                    .voucherInput::placeholder{
                        color: #858585;
                    }
                    
                `)
                const sharedView=new SharedView(gvc);

                return {
                    view: ()=>{
                        return sharedView.navigationBar({
                            title:"設置",
                            leftIcon : `<img class="" src="${widget.data.nav.leftIcon}" style="width: 24px;height: 24px;" alt="" onclick="${gvc.event(() => {
                            })}">`,
                            rightIcon : ``

                        })

                    },
                    editor: ()=>{
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">返回icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.nav.leftIcon}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                glitter.ut.chooseMediaCallback({
                                    single:true,
                                    accept:'image/*',
                                    callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                        api.upload(data[0].file,(link)=>{
                                            widget.data.nav.leftIcon=link;
                                            widget.refreshAll()
                                        })
                                    }
                                })
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `返回的頁面`,
                                default: widget.data.nav.leftPage,
                                placeHolder: widget.data.nav.leftPage,
                                callback: (text: string) => {
                                    widget.data.nav.leftPage = text
                                    widget.refreshAll!()
                                }
                            }),
                        ])
                    }

                }
            },
        },
        funRow: {
            defaultData:{

                img: "../img/component/notification.svg",
                text: "消息通知",
                click: ()=>{

                }

            },
            render:(gvc, widget, setting, hoverID) => {
                const data: { link: { img: string,code?:string }[] } = widget.data

                return {
                    view: ()=>{
                        gvc.addStyle(`
                            .rowText{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 500;
                                font-size: 20px;
                                line-height: 29px;
                                color: #1E1E1E;                                  
                            }
                        `)
                        return `
                        <div class="d-flex align-items-center  " style="padding:35px 0px;" onclick="${gvc.event(() => {
                            widget.data.click();
                        })}">
                            <img src="${import.meta.resolve!(widget.data.img)}" alt="${widget.data.text}" style="width: 32px;height: 32px;margin-right: 16px;">
                            <div class="rowText">${widget.data.text}</div>
                            <img class="ms-auto" src="${import.meta.resolve!("../img/component/right-arrow.svg")}" alt="右箭頭" style="height: 24px;width: 24px;" >
                        </div>
                        `
                    },
                    editor: ()=>{
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">左方icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.img}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                glitter.ut.chooseMediaCallback({
                                    single:true,
                                    accept:'image/*',
                                    callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                        api.upload(data[0].file,(link)=>{
                                            widget.data.img=link;
                                            widget.refreshAll()
                                        })
                                    }
                                })
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `中間文字內容`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text: string) => {
                                    widget.data.text = text
                                    widget.refreshAll!()
                                }
                            }),

                        ])
                    }
                }
            },
        },
        button: {
            defaultData:{
                text:"文字",
                click:()=>{

                }
            },
            render:(gvc, widget, setting, hoverID) => {

                return {
                    view: ()=>{
                        return `
                        <buttom class="" onclick="${gvc.event(()=>{
                            widget.data.click();    
                        })}">${widget.data.text}</buttom>
                        `
                    },
                    editor: ()=>{
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `中間文字內容`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text: string) => {
                                    widget.data.text = text
                                    widget.refreshAll!()
                                }
                            })

                        ])
                    }
                }
            },
        },
        text: {
            defaultData:{
                text:"文字",
                click:()=>{

                }
            },
            render:(gvc, widget, setting, hoverID) => {

                return {
                    view: ()=>{
                        return `
                        <div class="" onclick="${gvc.event(()=>{
                            widget.data.click();
                        })}">${widget.data.text}</div>
                        `
                    },
                    editor: ()=>{
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `文字內容`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text: string) => {
                                    widget.data.text = text
                                    widget.refreshAll!()
                                }
                            })

                        ])
                    }
                }
            },
        },
        empty: {
            defaultData:{
                link:[]
            },
            render:(gvc, widget, setting, hoverID) => {
                const data: { link: { img: string,code?:string }[] } = widget.data

                return {
                    view: ()=>{return ``},
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },


    }
});