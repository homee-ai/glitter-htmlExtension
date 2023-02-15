'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {Api} from "../homee/api/homee-api.js";
import {SharedView} from "../homee/shareView.js";
import {Voucher} from "../homee/legacy/api/voucher.js";
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";


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
                    title:"",
                    leftIcon:new URL('../img/component/left-arrow.svg',import.meta.url),
                    leftPage:"",
                    boxShadow:true
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
                            title:widget.data.nav.title,
                            leftIcon : `<img class="" src="${widget.data.nav.leftIcon}" style="width: 24px;height: 24px;" alt="" onclick="${gvc.event(() => {
                            })}">`,
                            rightIcon : ``,

                        })

                    },
                    editor: ()=>{
                        return gvc.map([
                        `
                            <h3 style="font-size: 16px;">是否需要底線</h3>
                            <select class="form-control" onchange="${gvc.event((e)=>{
                                widget.data.nav.boxShadow = (e.value == 1);    
                                widget.refreshAll;
                            })}">         
                              <option value="1">要</option>                     
                              <option value="0">不用</option>                              
                              ${(()=>{
                                  let text = (widget.data.nav.boxShadow) ? "要" : "不用"                             
                                  return `<option selected hidden>${text}</option>`
                              })()}                              
                            </select>
                        `
                        ,
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: `文字`,
                            default: widget.data.nav.title,
                            placeHolder: widget.data.nav.title,
                            callback: (text: string) => {
                                widget.data.nav.title = text
                                widget.refreshAll!()
                            }
                        }),
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
                            })
                        ])
                    }

                }
            },
        },
        banner: {
            defaultData:{
                img:new URL('../img/component/ourServiceBanner.png',import.meta.url),
                text:"文字",
                click:()=>{

                }
            },
            render:(gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    .banner-text{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 500;
                        font-size: 15px;
                        color: #1E1E1E;
                        word-wrap:break-word;
                        white-space:pre-wrap; 
                        margin-top : 16px;
                        padding:0 27px;
                    }
                `)
                return {
                    view: ()=>{
                        return `
                        <div style="padding:0 42px;">
                            <img class="w-100" src="${widget.data.img}">
                        </div>
                        <div class="banner-text">${widget.data.text}</div>
                        
                        `
                    },
                    editor: ()=>{
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">返回icon</h3>
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
                            <img src="${new URL(widget.data.img)}" alt="${widget.data.text}" style="width: 32px;height: 32px;margin-right: 16px;">
                            <div class="rowText">${widget.data.text}</div>
                            <img class="ms-auto" src="${new URL("../img/component/right-arrow.svg")}" alt="右箭頭" style="height: 24px;width: 24px;" >
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
                click:{}
            },
            render:(gvc, widget, setting, hoverID) => {

                return {
                    view: ()=>{
                        return `
                        <div class="" onclick="${gvc.event(()=>{
                            ClickEvent.trigger({
                                gvc,
                                widget,
                                clickEvent:widget.data.click
                            })
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
                            }),
                            ClickEvent.editer(gvc,widget,widget.data.click)

                        ])
                    }
                }
            },
        },
        dividingLine: {
            defaultData:{
                style:"solid",
                width:1,
                color:"000"
            },
            render:(gvc, widget, setting, hoverID) => {

                return {
                    view: ()=>{
                        return `
                        <div class="w-100" style="border-top: ${widget.data.width}px ${widget.data.style} #${widget.data.color};"></div>
                        
                        `
                    },
                    editor: ()=>{
                        return gvc.map([


                        ])
                    }
                }
            },
        },
        textArea: {
            defaultData:{
                text:"文字",
                click:()=>{

                }
            },
            render:(gvc, widget, setting, hoverID) => {

                return {
                    view: ()=>{
                        return `
                        <div class="" style="white-space:normal;word-wrap:break-word;word-break:break-all;" onclick="${gvc.event(()=>{
                            widget.data.click();
                        })}">${widget.data.text}</div>
                        `
                    },
                    editor: ()=>{
                        return gvc.map([
                           `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">文字內容</h3>
                            <textarea class="form-control p-0" placeholder="" style="height:auto"  onchange="${gvc.event((e)=>{
                                let element = e as HTMLTextAreaElement;
                                widget.data.text = e.value;    
                                widget.refreshAll!()
                                element.style.height = "auto";
                                element.style.height = (element.scrollHeight) + "px";
                                console.log(e.scrollHeight)
                            })}" >${widget.data.text ?? ''}</textarea>`
                        ])
                    }
                }
            },
        },
        ourService: {
            defaultData:{
                link:[],
                section:[
                    {
                        title:"產品相關",
                        service:[
                            {
                                text:"免費線上規劃軟體",
                                onclick:()=>{

                                }
                            },
                            {
                                text:"品質保證",
                                onclick:()=>{

                                }
                            },
                            {
                                text:"國際認證",
                                onclick:()=>{

                                }
                            },
                            {
                                text:"試睡保證",
                                onclick:()=>{

                                }
                            },
                        ]
                    },
                    {
                        title:"購物相關",
                        service:[
                            {
                                text:"HOMEE 分店",
                                onclick:()=>{

                                }
                            },
                            {
                                text:"付款方式說明",
                                onclick:()=>{

                                }
                            },
                            {
                                text:"隱私權保護及網站使用與購物政策   ",
                                onclick:()=>{

                                }
                            },
                            {
                                text:"折讓單作業說明",
                                onclick:()=>{

                                }
                            },
                        ]
                    },
                    {
                        title:"服務相關",
                        service:[
                            {
                                text:"運送服務",
                                onclick:()=>{

                                }
                            },
                            {
                                text:"組裝服務",
                                onclick:()=>{

                                }
                            },
                            {
                                text:"舊家具搬運 / 舊床墊回收服務",
                                onclick:()=>{

                                }
                            },
                            {
                                text:"空間規劃 / 丈量服務",
                                onclick:()=>{

                                }
                            },
                            {
                                text:"驗房服務",
                                onclick:()=>{

                                }
                            },
                        ]
                    }

                ],
                lastSection:{
                    contactUs:{
                        title:"聯絡我們",
                        servicePhoneTitle:"客服專線",
                        servicePhone:"8729-5939 （手機用戶請加02）",
                        serviceTimeTitle:"服務時間",
                        physicalStore : "分店：週一 ~ 週日 10:00-21:00",
                        onlineStore : "線上購物：週一 ~ 週日 09:00-18:00",
                        service1v1:{
                            title:"線上專人服務",
                            onclick:()=>{}
                        }
                    },
                    kanban:"img/kanban.png"

                }
            },
            render:(gvc, widget, setting, hoverID) => {
                const data: { link: { img: string,code?:string }[] } = widget.data

                return {
                    view: ()=>{
                        gvc.addStyle(`
        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Bold.otf);
            font-weight: bold;
        }

        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Regular.otf);
            font-weight: normal;
        }

        html {
            width: 100%;
            height: 100%;

        }

        body {
            width: 100%;
            height: 100%;
     
        }

        main {
            padding: 24px 35px 44px;
         
            font-family: 'Noto Sans TC';
            margin: 0;
            box-sizing: border-box;
        }

        `)
                        gvc.addStyle(`
        html{
            overflow-y : auto;
        }
        main{
            width:100%;
            padding-left:19px;
            padding-right:19px;
        }
        .addr-add{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
      
            
            
            /* HOMEE red */
            
            color: #FD6A58;
        }
        .addr-edit{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
            color: #FD6A58;
            margin-right : 12px;
        }
        .addr-del{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
            color: #858585;
           
        }
    `)
                        return `
                        ${gvc.bindView({
                            bind:"serviceListGroup",
                            view:()=>{
                                gvc.addStyle(`
                                    .serviceCard{
                                        background: #FBF9F6;
                                        border-radius: 24px;
                                        padding: 16px 0px 7px;
                                        margin-bottom:16px;
                                    }
                                    
                                    .serviceTitle{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 24px;
                                        line-height: 35px;
                                        color: #292929;
                                        margin-bottom:24px;
                                    }
                                    .serviceText{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        line-height: 150%;
                                        color: #858585;
                                    }
                                `)
                                let returnHTML = ``;
                                widget.data.section.forEach((serviceList:any)=>{
                                    returnHTML += `                           
                                    ${gvc.bindView({
                                      bind:"service",
                                      view : ()=>{
                                          gvc.addStyle(`
            .serviceRow{
                padding-left : 32px;
                padding-right : 24px;
                gap : 8px;
                margin-bottom:17px;                          
                height : 23px;
                               
            }      
            .left{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 15px;
                line-height: 150%;
                /* identical to box height, or 22px */
                
                
                /* HOMEE grey */
                
                color: #858585;

            }   
            .right{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 13px;
                line-height: 14px;
                /* identical to box height, or 108% */
                
                
                /* HOMEE dark grey */
                
                color: #858585;

            }   
        `)
                                          let serviceGroup = ``;
                                          serviceGroup = gvc.map(serviceList.service.map((service:any)=>{
                                              console.log(service)
                                              return `
                                                <div class="d-flex align-items-center  w-100 serviceRow" onclick="${gvc.event(() => {
                                                  service.onclick();
                                                })}">
                                                    <div class="d-flex me-auto left" style="padding-left:2px;height: 29px;align-items: center;" >
                                                        ${service.text}
                                                    </div>
                                                    <div class="d-flex align-items-center ms-auto">                                                        
                                                        <img class="ms-auto" src="${new URL!(`../img/component/angle-right.svg`,import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                                    </div>
                                                </div>
                                              
                                              `
                                          }))
       
                                        return `
                                    <div class="d-flex align-items-center flex-column serviceCard">
                                        <div class="serviceTitle">${serviceList.title}</div>
                                        ${serviceGroup}
                                    </div>
                                `

                                    }
                                })}
                                `

                                })
                                return returnHTML
                            },divCreate:{style:`margin-top: 26px;` , class:``}
                        })}
                        ${gvc.bindView({
                            bind:"lastSection",
                            view : ()=>{
                                gvc.addStyle(`
                                .lastSectionTitle{
                                    font-family: 'Noto Sans TC';
                                    font-style: normal;
                                    font-weight: 700;
                                    font-size: 24px;
                                    line-height: 35px;
                                    
                                    color: #292929;
                                    
                                    margin-bottom : 24px;
                                }
                                .serviceTimeBlock * ,.servicePhoneBlock *{
                                    font-family: 'Noto Sans TC';
                                    font-style: normal;
                                    font-weight: 400;
                                    font-size: 15px;
                                    line-height: 150%;
                                    color: #858585;
                                }
                                .serviceBTN{
                                    height: 48px;
                                    margin-top:24px;
                                    font-family: 'Noto Sans TC';
                                    font-style: normal;
                                    font-weight: 700;
                                    font-size: 18px;
                                    line-height: 26px;
                                    
                                    text-align: center;
                                    letter-spacing: 0.15em;
        
                                    background: #FD6A58;
                                    border-radius: 28px;
                                    
                                    
                                    color: #FFFFFF;
                                    
                                    
                                }
                            `)
                                let thisModel = widget.data.lastSection
                                return`
                        
                                <div class="lastSectionTitle d-flex justify-content-center align-items-center">${thisModel.contactUs.title}</div>
                                <div class="servicePhoneBlock d-flex flex-column align-items-start justify-content-start" style="margin-bottom: 16px;">
                                    <div>${thisModel.contactUs.servicePhoneTitle}</div>
                                    <div>${thisModel.contactUs.servicePhone}</div>
                                </div>
                                <div class="serviceTimeBlock" >
                                    <div>${thisModel.contactUs.serviceTimeTitle}</div>
                                    <div>${thisModel.contactUs.physicalStore}</div>
                                    <div>${thisModel.contactUs.onlineStore}</div>
                                </div>
                                <button class="w-100 serviceBTN border-0" onclick="${gvc.event(()=>{
                                    thisModel.contactUs.service1v1.onclick();
                                })}">${thisModel.contactUs.service1v1.title}</button>
                                
                                ${gvc.bindView({
                                    bind : "kanban",
                                    view : ()=>{

                                        return `
                                            <div class="" style="padding-top: 57%;width : 100%;background:50% / cover url(${new URL!(`../img/component/kanban.png`,import.meta.url)})"></div>
                                        `
                                    },
                                    divCreate:{class:`` , style:`width : 100%;`}
                                })}     
                            `
                            },divCreate:{class:`` , style:`background: #FBF9F6;border-radius: 24px;padding: 16px 32px 24px;`}
                        })}
                        `
                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        footer: {
            defaultData:{
                dataList:[
                    {
                        title : "首頁",
                        icon : new URL('../img/component/footer/home.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "靈感",
                        icon : new URL('../img/component/footer/idea.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "我的空間",
                        icon : new URL('../img/component/footer/myspace.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "購物車",
                        icon : new URL('../img/component/footer/shoopingCart.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "會員",
                        icon : new URL('../img/component/footer/user.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },

                ],
            },
            render:(gvc, widget, setting, hoverID) => {
                glitter.runJsInterFace("getBottomInset", {}, (response:any) => {
                    if (widget.data?.bottomInset != response.data){
                        widget.data.bottomInset = response.data;
                        widget.refreshAll!();
                    }
                }, {
                    webFunction: () => {
                        return {data: 10}
                    }
                })
                return {
                    view: ()=>{return ``},
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        pointsRewardBlock: {
            defaultData:{
                backPoint:600,
            },
            render:(gvc, widget, setting, hoverID) => {


                return {
                    view: ()=>{return `
                        ${gvc.bindView({
                        bind: 'backPoint',
                        view: () => {
                            gvc.addStyle(`
                                .giveBack {
                                    font-weight: 500;
                                    font-size: 18px;
                                    line-height: 200%;
                                    color: #292929;
                                    font-feature-settings: 'pnum' on, 'lnum' on;
                                }
                                .backPoint {
                                    font-weight: 700;
                                    font-size: 32px;
                                    line-height: 46px;
                                    font-feature-settings: 'pnum' on, 'lnum' on;
                                    color: #fd6a58;
                                }
                            `);
                            return /*html*/ `
                                <div class="d-flex align-items-baseline justify-content-center">
                                    <div class="giveBack">點數回饋：</div>
                                    <div class="backPoint">${widget.data.backPoint}</div>
                                </div>
                            `;
                        },
                        divCreate: {
                            style: `height:96px;background: #FBF9F6;border-radius: 20px;margin-top:24px;`,
                            class: `w-100 d-flex justify-content-center align-items-center `,
                        },
                    })}
                    `},
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        voucher: {
            defaultData:{
                voucherList:[
                    {
                        id: "0",
                        vendor_name: "供應商名稱",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "優惠卷名稱",
                        config: {},
                        title: "現折 10,000 元",
                        subTitle: "滿 30,000 元",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "有效期限：2025.03.31",
                        isUse: false,
                        status:0,
                    },
                    {
                        id: "1",
                        vendor_name: "供應商名稱",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "優惠卷名稱",
                        config: {},
                        title: "現折 10,000 元",
                        subTitle: "滿 30,000 元",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "即將失效：剩下 8 小時",
                        isUse: false,
                        status:1,
                    },
                    {
                        id: "2",
                        vendor_name: "供應商名稱",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "優惠卷名稱",
                        config: {},
                        title: "現折 10,000 元",
                        subTitle: "滿 30,000 元",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "有效期限：2025.03.31",
                        isUse: false,
                        status:2,
                    },
                    {
                        id: "3",
                        vendor_name: "供應商名稱",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "優惠卷名稱",
                        config: {},
                        title: "現折 10,000 元",
                        subTitle: "滿 30,000 元",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "有效期限：2025.03.31",
                        isUse: false,
                        status:3,
                    }

                ],
                cEvent:{},
                eventList:{
                    status0:{},
                    status1:{},
                    status2:{}
                }


            },
            render:(gvc, widget, setting, hoverID) => {
                enum voucherStatus {
                    unused,
                    expire,
                    used,
                    passed
                }

                return {
                    view: ()=>{
                        gvc.addStyle(`
                            .unusedDate{
                                color : #FF0000;
                            }
                            .normalDate{
                                color : #858585;
                            }
                            .useBTNtext{                            
                                border-radius: 4px;                               
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 12px;
                                line-height: 20px;
                                margin-right: 10px;
                                width:48px;
                                text-align: center;
                                height: 20px;
                                
                            }
                            .useBTNtext.on{
                                background: #FE5541;
                                color: #FFFFFF;
                            }
                            .useBTNtext.off{
                                background: #EAD8C2;
                                color: #858585;
                            }
                            .useBTNtext.passed{
                                background: #E0E0E0;
                                color: #858585;
                            }
                        `)
                        return gvc.map(widget.data.voucherList.map((coupon:any)=>{
                            return `
                            <div
                                class="d-flex align-items-center border"
                                style="
                                    padding:13px 16px;
                                    height: 104px;
                                    background: #FBF9F6;
                                    box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);
                                    border-radius: 20px;
                                    margin-top:12px;
                                "
                                onclick="${gvc.event(() => {
                                ClickEvent.trigger({
                                    gvc,
                                    widget,
                                    clickEvent:widget.data
                                })        
                                
                            })}">
                            <div
                                class="d-flex flex-column align-items-center"
                                style="width: 60px;overflow: hidden;"
                            >
                                <img src="${coupon.vendor_icon}" style="width: 56px;height: 56px;border-radius: 50%;" />
                                <span
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 10px;
                                        width: 60px;
                                        line-height: 12px;
                                        margin-top: 4px;
                                        word-break: break-all;
                                        overflow: hidden; 
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        -webkit-line-clamp: 1;
                                        -webkit-box-orient: vertical;  
                                        overflow: hidden;
                                        text-align: center;
                                    "
                                    >${coupon.vendor_name}</span
                                >
                            </div>
                            <div
                                style="
                                    width: 1px;
                                    height: 64px;
                                    background: #D6D6D6;
                                    margin-left: 24px;
                                "
                            ></div>
                            <div
                                class="d-flex flex-column justify-content-center"
                                style="margin-left: 20px;width: calc(100% - 170px);">
                                <span       
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 18px;
                                        line-height: 26px;
                                        font-feature-settings: 'pnum' on, 'lnum' on;
                                        color: #FD6A58;
                                    " 
                                    >${coupon.title}</span
                                >
                                <span
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 12px;
                                        line-height: 17px;
                                    "
                                    >${coupon.subTitle}</span
                                >
                                <span class="${(()=>{
                            if (coupon.status==voucherStatus.expire){
                                
                                return "unusedDate"
                            }else{
                                return "normalDate"
                            }
                        })()}"
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 10px;
                                        line-height: 14px;
                                    "
                                    >${coupon.formatEndTime}</span
                                >
                            </div>
                            <div class="flex-fill" style=""></div>
                            <div class="useBTNtext ${(()=>{
                                switch (coupon.status){
                                    case voucherStatus.unused:{
                                        return `on`;
                                    }
                                    case voucherStatus.expire:{
                                        return `on`;
                                    }
                                    case voucherStatus.used:{
                                        return `off`;
                                    }
                                    case voucherStatus.passed:{
                                        return `passed`;
                                    }
                                }
                            })()}">${(()=>{
                                switch (coupon.status){
                                    case voucherStatus.unused:{
                                        return `使用`;
                                    }
                                    case voucherStatus.expire:{
                                        return `使用`;
                                    }
                                    case voucherStatus.used:{
                                        return `已使用`;
                                    }
                                    case voucherStatus.passed:{
                                        return `已過期`;
                                    }
                                }
                            })()}</div>
                               
                        </div>
                        `
                        }))


                    },
                    editor: ()=>{
                        return ClickEvent.editer(gvc,widget,widget.data,{
                            option:[],
                            hover:true
                        });
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