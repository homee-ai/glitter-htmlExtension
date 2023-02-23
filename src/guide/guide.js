'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { Api } from "../homee/api/homee-api.js";
import { appConfig } from "../config.js";
Plugin.create(import.meta.url, (glitter) => {
    const api = {
        upload: (photoFile, callback) => {
            glitter.share.dialog.dataLoading({ text: '上傳中', visible: true });
            $.ajax({
                url: Api.serverURL + '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name: `${new Date().getTime()}` }),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.getCookieByName('token') },
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
                    glitter.share.dialog.successMessage({ text: "上傳失敗" });
                },
            });
        }
    };
    return {
        start: {
            defaultData: {
                model: {
                    remind: "此功能需使用支援 LiDAR 光學感測功能之手機",
                    BTN: "邀請好友協助掃描"
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        gvc.addStyle(`
                            body{
                                background-color: transparent!important;
                            }
                            .laravel{
                                background: #FFFFFF;
                                box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.1);
                                border-radius: 20px;          
                                padding:32px 24px 16px;         
                            }
                            .remind{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 500;
                                font-size: 18px;
                                color: #292929;
                                margin-bottom:32px;
                                word-break: break-all;
                                white-space: normal;
                                text-align: center;
                            }
                            .startBTN{
                                height: 40px;
                                background: #FD6A58;
                                border-radius: 20px;
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 700;
                                font-size: 18px;
                                color: #FFFFFF;
                            }
                        
                        `);
                        return `
                            ${gvc.bindView({
                            bind: "laravel",
                            view: () => {
                                return `
                                    <div class="laravel" >
                                        <div class="remind d-flex flex-wrap justify-content-center align-items-center">
                                            ${widget.data.model.remind}
                                        </div>
                                        <button class="w-100 border-0 startBTN" onclick="${gvc.event(() => {
                                    appConfig().changePage(gvc, "guide1");
                                })}">${widget.data.model.BTN}</button>
                                    </div>
                                `;
                            },
                            divCreate: { style: `padding : 0 55px;height:100vh `, class: `w-100  d-flex justify-content-center align-items-center` }
                        })}
                        `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        guide1: {
            defaultData: {
                model: {
                    title: "點擊按鈕開始空間掃描",
                    slogan: "探索空間搭配創意世界！",
                    BTN: "下一步",
                    nextPage: "guide2",
                    background: `${new URL(`video/homee 操作教學(步驟一).mp4`, import.meta.url)}`
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                let bottomInset = 0;
                return {
                    view: () => {
                        gvc.addStyle(`
                            body{
                                background-color: transparent!important;
                            }
                            .laravel{
                                background: #F8F3ED;
                                box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.1);
                                border-radius: 56px 56px 0px 0px;  
                                padding-top:50px;
                                position:fixed;
                                left:0;
                                bottom:0;
                            }
                            .titleText{
                                font-weight: 700;
                                font-size: 32px;
                                line-height: 46px;
                                color: #292929;
                            }
                            .sloganText{
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 150%;
                                color: #858585;
                                
                                margin-top:8px;
                            }
                            .nextBTN{
                                width: 256px;
                                height: 48px;
                                background: #FD6A58;
                                border-radius: 24px;
                                font-weight: 700;
                                font-size: 18px;
                                line-height: 26px;
                                letter-spacing: 0.15em;
                                color: #FFFFFF;
                                
                                
                            }
                            
                        
                        `);
                        glitter.runJsInterFace("getBottomInset", {}, (response) => {
                            if (bottomInset != response.data) {
                                bottomInset = (response.data);
                                gvc.notifyDataChange('mainView');
                            }
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        return `                                
                        <div class="w-100 background-guide" style="height: 100vh;padding-top: ${10 + glitter.share.topInset}px;">
                            <div class="w-100" style="">
                                <img class="" src="${new URL(`../img/sample/idea/left-arrow.svg`, import.meta.url)}" style="position:absolute; left:19px;top:${10 + glitter.share.topInset};z-index:3;width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            glitter.runJsInterFace("dismissController", {}, () => { });
                        })}">
                            </div>
                            <video autoplay loop muted playsinline defaultmuted preload="auto" style="height: 100%;width: 100%;position:absolute;left: 0;top: -10%">
                                <source src="${widget.data.model.background}" type="video/mp4">
                            </video>
                            
                        </div>
                        ${gvc.bindView({
                            bind: "laravel",
                            view: () => {
                                var _a;
                                return `
                                    <div class="laravel w-100 d-flex flex-column align-items-center" style="padding-bottom: ${((_a = glitter.share) === null || _a === void 0 ? void 0 : _a.bottomInset) || 10}px;">
                                        <div class="titleText d-flex flex-wrap justify-content-center align-items-center">
                                            ${widget.data.model.title}
                                        </div>
                                        <div class="sloganText d-flex flex-wrap justify-content-center align-items-center">
                                            ${widget.data.model.slogan}
                                        </div>
                                        <button class="border-0 nextBTN" style="margin-top:38px;" onclick="${gvc.event(() => {
                                    appConfig().changePage(gvc, widget.data.model.nextPage);
                                })}">${widget.data.model.BTN}</button>
                                    </div>
                                `;
                            },
                            divCreate: { style: `` }
                        })}
            `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        guide2: {
            defaultData: {
                model: {
                    title: "平穩移動掃描",
                    slogan: "探索空間搭配創意世界！",
                    BTN: "下一步",
                    prevPage: "guide2",
                    nextPage: "guide3",
                    background: `${new URL(`video/homee 操作教學(步驟二).mp4`, import.meta.url)}`
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                let topInset = 0;
                let bottomInset = 0;
                return {
                    view: () => {
                        gvc.addStyle(`
                            body{
                                background-color: transparent!important;
                            }
                            .laravel{
                                background: #F8F3ED;
                                box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.1);
                                border-radius: 56px 56px 0px 0px;  
                                padding-top:50px;
                                position:fixed;
                                left:0;
                                bottom:0;
                            }
                            .titleText{
                                font-weight: 700;
                                font-size: 32px;
                                line-height: 46px;
                                color: #292929;
                            }
                            .sloganText{
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 150%;
                                color: #858585;
                                
                                margin-top:8px;
                            }
                            .nextBTN{
                                width: 256px;
                                height: 48px;
                                background: #FD6A58;
                                border-radius: 24px;
                                font-weight: 700;
                                font-size: 18px;
                                line-height: 26px;
                                letter-spacing: 0.15em;
                                color: #FFFFFF;
                                
                                
                            }
                            
                        
                        `);
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (topInset != response.data) {
                                topInset = (response.data);
                                gvc.notifyDataChange('mainView');
                            }
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        glitter.runJsInterFace("getBottomInset", {}, (response) => {
                            if (bottomInset != response.data) {
                                bottomInset = (response.data);
                                gvc.notifyDataChange('mainView');
                            }
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        return `                                
                        <div class="w-100 background-guide" style="height: 100vh;padding-top: ${10 + topInset}px;">
                            <div class="w-100" style="">
                                <img class="" src="${new URL(`../img/sample/idea/left-arrow.svg`, import.meta.url)}" style="position:absolute; left:19px;top:${10 + topInset};z-index:3;width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            glitter.goBack("guide1");
                        })}">
                            </div>
                            <video autoplay loop muted playsinline defaultmuted preload="auto" style="height: 100%;width: 100%;position:absolute;left: 0;top: -10%" muted>
                                <source src="${widget.data.model.background}" type="video/mp4">
                            </video>
                            
                        </div>
                        ${gvc.bindView({
                            bind: "laravel",
                            view: () => {
                                return `
                            <div class="laravel w-100 d-flex flex-column align-items-center" style="padding-bottom: ${bottomInset || 10}px;">
                                <div class="titleText d-flex flex-wrap justify-content-center align-items-center">
                                    ${widget.data.model.title}
                                </div>
                                <div class="sloganText d-flex flex-wrap justify-content-center align-items-center">
                                    ${widget.data.model.slogan}
                                </div>
                                <div class="d-flex align-items-center" style="margin-top:38px;">
                                    <img class="" src="${new URL(`../img/guide-back.svg`, import.meta.url)}" style="width: 40px;height: 40px;margin-right: 8px" alt="" onclick="${gvc.event(() => {
                                    glitter.goBack();
                                })}">
                                    <button class="border-0 nextBTN" onclick="${gvc.event(() => {
                                    appConfig().changePage(gvc, widget.data.model.nextPage);
                                })}">${widget.data.model.BTN}</button>
                                </div>
                                
                            </div>
                        `;
                            },
                            divCreate: { style: `animation-delay: 0s;` }
                        })}
                    `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        guide3: {
            defaultData: {
                model: {
                    title: "前後移動掃描",
                    slogan: "捕捉更多空間細節！",
                    BTN: "下一步",
                    prevPage: "guide2",
                    nextPage: "guide4",
                    background: `${new URL(`video/homee 操作教學(步驟三).mp4`, import.meta.url)}`
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                let topInset = 0;
                let bottomInset = 0;
                return {
                    view: () => {
                        gvc.addStyle(`
                            body{
                                background-color: transparent!important;
                            }
                            .laravel{
                                background: #F8F3ED;
                                box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.1);
                                border-radius: 56px 56px 0px 0px;  
                                padding-top:50px;
                                position:fixed;
                                left:0;
                                bottom:0;
                            }
                            .titleText{
                                font-weight: 700;
                                font-size: 32px;
                                line-height: 46px;
                                color: #292929;
                            }
                            .sloganText{
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 150%;
                                color: #858585;
                                
                                margin-top:8px;
                            }
                            .nextBTN{
                                width: 256px;
                                height: 48px;
                                background: #FD6A58;
                                border-radius: 24px;
                                font-weight: 700;
                                font-size: 18px;
                                line-height: 26px;
                                letter-spacing: 0.15em;
                                color: #FFFFFF;
                                
                                
                            }
                            
                        
                        `);
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (topInset != response.data) {
                                topInset = (response.data);
                                gvc.notifyDataChange('mainView');
                            }
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        glitter.runJsInterFace("getBottomInset", {}, (response) => {
                            if (bottomInset != response.data) {
                                bottomInset = (response.data);
                                gvc.notifyDataChange('mainView');
                            }
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        return `                                
                        <div class="w-100 background-guide" style="height: 100vh;padding-top: ${10 + topInset}px;">
                            <div class="w-100" style="">
                                <img class="" src="${new URL(`../img/sample/idea/left-arrow.svg`, import.meta.url)}" style="position:absolute; left:19px;top:${10 + topInset};z-index:3;width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            glitter.goBack("guide1");
                        })}">
                            </div>
                            <video autoplay loop muted playsinline defaultmuted preload="auto" style="height: 100%;width: 100%;position:absolute;left: 0;top: -10%" muted>
                                <source src="${widget.data.model.background}" type="video/mp4">
                            </video>
                            
                        </div>
                        ${gvc.bindView({
                            bind: "laravel",
                            view: () => {
                                return `
                            <div class="laravel w-100 d-flex flex-column align-items-center" style="padding-bottom: ${bottomInset || 10}px;">
                                <div class="titleText d-flex flex-wrap justify-content-center align-items-center">
                                    ${widget.data.model.title}
                                </div>
                                <div class="sloganText d-flex flex-wrap justify-content-center align-items-center">
                                    ${widget.data.model.slogan}
                                </div>
                                <div class="d-flex align-items-center" style="margin-top:38px;">
                                    <img class="" src="${new URL(`../img/guide-back.svg`, import.meta.url)}" style="width: 40px;height: 40px;margin-right: 8px" alt="" onclick="${gvc.event(() => {
                                    glitter.goBack();
                                })}">
                                    <button class="border-0 nextBTN" onclick="${gvc.event(() => {
                                    appConfig().changePage(gvc, widget.data.model.nextPage);
                                })}">${widget.data.model.BTN}</button>
                                </div>
                                
                            </div>
                        `;
                            },
                            divCreate: { style: `animation-delay: 0s;` }
                        })}
                    `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        guide4: {
            defaultData: {
                model: {
                    title: "移動掃描被遮蔽空間",
                    slogan: "記錄所有空間樣貌！",
                    BTN: "開始掃描",
                    prevPage: "guide3",
                    nextPage: "",
                    background: `${new URL(`video/homee 操作教學(步驟四).mp4`, import.meta.url)}`
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                let topInset = 0;
                let bottomInset = 0;
                return {
                    view: () => {
                        gvc.addStyle(`
                            body{
                                background-color: transparent!important;
                            }
                            .laravel{
                                background: #F8F3ED;
                                box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.1);
                                border-radius: 56px 56px 0px 0px;  
                                padding-top:50px;
                                position:fixed;
                                left:0;
                                bottom:0;
                            }
                            .titleText{
                                font-weight: 700;
                                font-size: 32px;
                                line-height: 46px;
                                color: #292929;
                            }
                            .sloganText{
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 150%;
                                color: #858585;
                                
                                margin-top:8px;
                            }
                            .nextBTN{
                                width: 256px;
                                height: 48px;
                                background: #FD6A58;
                                border-radius: 24px;
                                font-weight: 700;
                                font-size: 18px;
                                line-height: 26px;
                                letter-spacing: 0.15em;
                                color: #FFFFFF;
                                
                                
                            }
                            
                        
                        `);
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (topInset != response.data) {
                                topInset = (response.data);
                                gvc.notifyDataChange('mainView');
                            }
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        glitter.runJsInterFace("getBottomInset", {}, (response) => {
                            if (bottomInset != response.data) {
                                bottomInset = (response.data);
                                gvc.notifyDataChange('mainView');
                            }
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        return `                                
                        <div class="w-100 background-guide" style="height: 100vh;padding-top: ${10 + topInset}px;">
                            <div class="w-100" style="">
                                <img class="" src="${new URL(`../img/sample/idea/left-arrow.svg`, import.meta.url)}" style="position:absolute; left:19px;top:${10 + topInset};z-index:3;width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            glitter.goBack("guide1");
                        })}">
                            </div>
                            <video autoplay loop muted playsinline defaultmuted preload="auto" style="height: 100%;width: 100%;position:absolute;left: 0;top: -10%" muted>
                                <source src="${widget.data.model.background}" type="video/mp4">
                            </video>
                            
                        </div>
                        ${gvc.bindView({
                            bind: "laravel",
                            view: () => {
                                return `
                            <div class="laravel w-100 d-flex flex-column align-items-center" style="padding-bottom: ${bottomInset || 10}px;">
                                <div class="titleText d-flex flex-wrap justify-content-center align-items-center">
                                    ${widget.data.model.title}
                                </div>
                                <div class="sloganText d-flex flex-wrap justify-content-center align-items-center">
                                    ${widget.data.model.slogan}
                                </div>
                                <div class="d-flex align-items-center" style="margin-top:38px;">
                                    <img class="" src="${new URL(`../img/guide-back.svg`, import.meta.url)}" style="width: 40px;height: 40px;margin-right: 8px" alt="" onclick="${gvc.event(() => {
                                    glitter.goBack();
                                })}">
                                    <button class="border-0 nextBTN" onclick="${gvc.event(() => {
                                    appConfig().changePage(gvc, widget.data.model.nextPage);
                                })}">${widget.data.model.BTN}</button>
                                </div>
                                
                            </div>
                        `;
                            },
                            divCreate: { style: `animation-delay: 0s;` }
                        })}
                    `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        empty: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => { return ``; },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
    };
});
