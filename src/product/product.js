'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { Api } from "../homee/api/homee-api.js";
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
        nav: {
            defaultData: {
                nav: {
                    leftIcon: import.meta.resolve('../img/component/left-arrow.svg', import.meta.url),
                    leftPage: "",
                    rightIcon: import.meta.resolve('../img/component/searchBlack.png', import.meta.url),
                    rightPage: "",
                    rightIcon2: import.meta.resolve('../img/component/shoppingCart.png', import.meta.url),
                    rightPage2: "",
                },
            },
            render: (gvc, widget, setting, hoverID) => {
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
                    
                `);
                function drawNav(title, leftIcon, rightIcon) {
                    glitter.runJsInterFace("getTopInset", {}, (response) => {
                        var _a;
                        if (((_a = widget.data) === null || _a === void 0 ? void 0 : _a.topInset) != response.data) {
                            widget.data.topInset = response.data;
                            widget.refreshAll();
                        }
                    }, {
                        webFunction: () => {
                            return { data: 10 };
                        }
                    });
                    return gvc.bindView({
                        bind: `nav`,
                        view: () => {
                            return `
                    <nav class="bg-white w-100" style="padding-top: ${widget.data.topInset - 20}px;">
                        <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0;height: 63px; padding: 0 16px; background: #FFFFFF;box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05);position:relative;">
                            <div class="me-auto p-0 d-flex align-items-center" style="">
                                ${leftIcon}
                            </div>
                            <div class=" d-flex align-items-center justify-content-center" style="font-family: 'Noto Sans TC',serif;font-style: normal;font-size: 16px;font-weight: 700;color: #1E1E1E;">${title}</div>
                            ${(() => {
                                if (rightIcon) {
                                    return `
                                    <div class="d-flex ms-auto align-items-center" style="">
                                        ${rightIcon}
                                    </div>`;
                                }
                                else
                                    return ``;
                            })()}
                        
                        </div>
                    </nav>
                        `;
                        },
                        divCreate: { style: `width:100vw;height:calc(63px + ${widget.data.topInset - 20}px)` },
                        onCreate: () => {
                        }
                    });
                }
                return {
                    view: () => {
                        return gvc.map([
                            drawNav("", `<img class="" src="${widget.data.nav.leftIcon}" style="width: 24px;height: 24px;" alt="" onclick="${gvc.event(() => {
                            })}">`, `<img class="" src="${widget.data.nav.rightIcon}" style="width: 24px;height: 24px" alt="" onclick="${gvc.event(() => {
                            })}">
                                <img class="" src="${widget.data.nav.rightIcon2}" style="width: 24px;height: 24px;margin-left: 10px;" alt="" onclick="${gvc.event(() => {
                            })}">
                                `)
                        ]);
                    },
                    editor: () => {
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">返回icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.nav.leftIcon}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        api.upload(data[0].file, (link) => {
                                            widget.data.nav.leftIcon = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `返回的頁面`,
                                default: widget.data.nav.leftPage,
                                placeHolder: widget.data.nav.leftPage,
                                callback: (text) => {
                                    widget.data.nav.leftPage = text;
                                    widget.refreshAll();
                                }
                            }),
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">右方icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.nav.rightIcon}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        api.upload(data[0].file, (link) => {
                                            widget.data.nav.rightIcon = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `右方icon跳轉的頁面`,
                                default: widget.data.nav.rightPage,
                                placeHolder: widget.data.nav.rightPage,
                                callback: (text) => {
                                    widget.data.nav.rightPage = text;
                                    widget.refreshAll();
                                }
                            }),
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">右方icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.nav.rightIcon2}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        api.upload(data[0].file, (link) => {
                                            widget.data.nav.rightIcon2 = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `右方icon2跳轉的頁面`,
                                default: widget.data.nav.rightPage2,
                                placeHolder: widget.data.nav.rightPage2,
                                callback: (text) => {
                                    widget.data.nav.rightPage = text;
                                    widget.refreshAll();
                                }
                            }),
                        ]);
                    }
                };
            },
        },
        allPage: {
            defaultData: {
                name: "DIMARO 岩板餐桌",
                preview_image: "",
                price: "9960",
                sale_price: "13500",
                qty: 1,
                sizeSelect: [
                    {
                        title: "定製尺寸",
                        kind: ["120公分", "140公分", "160公分"],
                        selected: 0
                    }
                ],
                intro: [{
                        title: "商品介紹",
                        text: "SORIA 雙抽移門電視櫃強調功能性設計，整體甄選自然材質，展現典雅純粹的生活方式，為您的家居生活增一筆幹練大氣的獨特風情。 SORIA 雙抽移門電視櫃主體使用難得的進口山毛櫸製成，設計師在保留其原始的紋理的同時，借助其山毛櫸硬度高抗磨損、質地致密和紋理清晰均勻的特點，全程使用精湛工藝，匠心製造實用耐用與美觀兼具的家居單品，呈現別有風味的自然風尚。電視櫃整體線條自然流暢，邊角處的防磕碰處理尤其適合有孩子的家庭。通過以傳統榫卯技術巧妙結合的大容量泡桐木抽屜私密性好，並且防塵防潮，讓所有生活小物觸手可及。"
                    }]
            },
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                gvc.addStyle(`
                    .productTitleRow{
                        margin-top:16px;
                    }
                    .productTitle{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 24px;
                        color: #292929;
                    }
                    .productPriceRow .sale_price{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 500;
                        font-size: 20px;
                        color: #FD6A58;
                    }
                    .productPriceRow .price{
                        font-family: 'Noto Sans TC';
                        font-weight: 400;
                        font-size: 15px;
                        font-size: 20px;
                        color: #858585;
                        text-decoration-line: line-through;
                        
                        margin-left:40px;
                        padding-top:6px;
                    }
                    .productQTYRow .qtyBar{
                        width:40px;
                        height:1px;
                        background:#292929;
                    }
                    .productQTYRow .qtyNumber{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 24px;
                        margin:0 16px;
                        color: #292929;
                    }
                `);
                function addThousandSeparator(numStr) {
                    const num = Number(numStr);
                    return num.toLocaleString();
                }
                function qtyChange(action = true) {
                    widget.data.qty += (action) ? 1 : -1;
                    if (widget.data.qty < 0) {
                        widget.data.qty = 0;
                    }
                    gvc.notifyDataChange("qtyNumber");
                }
                return {
                    view: () => {
                        return `                        
                        <div class="productTitleRow d-flex flex-column">
                            <div class="productTitle">${widget.data.name}</div>
                            <div class="d-flex productPriceRow">
                                <div class="sale_price">NT$ ${addThousandSeparator(widget.data.sale_price)}</div>
                                <div class="price">NT$ ${addThousandSeparator(widget.data.price)}</div>
                            </div>
                        </div>
                        
                        <div class="productQTYRow d-flex align-items-center justify-content-between">
                            <div class="qtyBar"></div>
                            <div class="d-flex">
                                <img src="${import.meta.resolve('../img/component/minusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                            qtyChange(false);
                        })}">
                                ${gvc.bindView({
                            bind: "qtyNumber",
                            view: () => {
                                return `
                                        <input class="border-0" style="width: 15px"  value="${widget.data.qty}" onchange="${gvc.event((e) => {
                                    widget.data.qty = e.value;
                                    if (widget.data.qty < 0) {
                                        widget.data.qty = 0;
                                        gvc.notifyDataChange("qtyNumber");
                                    }
                                })}">`;
                            }, divCreate: { class: `qtyNumber`, style: `` }
                        })}
                                <img src="${import.meta.resolve('../img/component/plusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                            qtyChange();
                        })}">
                                
                            </div>
                        </div>
                        
                        ${gvc.bindView({
                            bind: "sizeSelect",
                            view: () => {
                                gvc.addStyle(`
                                    .kindUnselected{                                        
                                        border: 1px solid #D6D6D6;
                                        border-radius: 5px;
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 500;
                                        font-size: 14px;
                                        color: #292929;
                                        margin-right : 8px;
                                    }
                                    .kindSelected{                                        
                                        background: rgba(41, 41, 41, 0.1);                                                                                
                                        border: 1px solid #292929;
                                        border-radius: 5px;

                                    }
                                    .kindArray{
                                        margin-top : 8px;
                                    }
                                    .sizeSelectTitle{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #292929;
                                    }
                                `);
                                return gvc.map(widget.data.sizeSelect.map((sizeType, index) => {
                                    return `
                                        ${gvc.bindView({
                                        bind: `type${index}`,
                                        view: () => {
                                            return `
                                                    <div class="sizeSelectTitle">
                                                        ${sizeType.title}
                                                    </div>
                                                    <div class="kindArray d-flex">
                                                        ${gvc.map(sizeType.kind.map((kind, index) => {
                                                let className = "kindUnselected";
                                                if (index == sizeType.selected) {
                                                    className += " kindSelected";
                                                }
                                                return `
                                                                <div class="${className}">${kind}</div>
                                                            `;
                                            }))}
                                                    </div>
                                                `;
                                        }, divCreate: { class: ``, style: `` },
                                    })}
                                    `;
                                }));
                            }, divCreate: { class: ``, style: "padding-bottom:32px;border-bottom: 1px solid #292929;" },
                        })}
                        
                        ${gvc.bindView({
                            bind: `intro`,
                            view: () => {
                                gvc.addStyle(`
                                    .introTitle{
                                        font-family : 'Noto Sans TC';
                                        font-style : normal;
                                        font-weight : 700;
                                        font-size : 24px;
                                        color : #292929;
                                        margin-bottom : 16px;
                                    }
                                    .introText{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #292929;
                                        white-space:normal;
                                        word-wrap:break-word;
                                        word-break:break-all;                                       
                                    }
                                    
                                `);
                                return `
                                    ${gvc.map(widget.data.intro.map((intro) => {
                                    return `
                                            <div class="intro">
                                                <div class="introTitle">${intro.title}</div>
                                                <div class="introText">${intro.text}</div>
                                            </div>
                                        `;
                                }))}
                                `;
                            }, divCreate: { class: ``, style: `padding-top:40px;` }
                        })}
                    `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
    };
});
