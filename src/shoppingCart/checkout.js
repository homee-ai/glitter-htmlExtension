'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { Api } from "../homee/api/homee-api.js";
import { SharedView } from "../homee/shareView.js";
import { ClickEvent } from "../glitterBundle/plugins/click-event.js";
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
                    rightIcon: import.meta.resolve('../img/component/service.png', import.meta.url),
                    rightPage: "",
                },
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    html{
                        margin: 0;
                        box-sizing: border-box;    
                        font-family: 'Noto Sans TC';        
                    }
                    
                    
                `);
                const sharedView = new SharedView(gvc);
                return {
                    view: () => {
                        return sharedView.navigationBar({
                            title: "購物車",
                            leftIcon: ``,
                            rightIcon: `<img class="" src="${widget.data.nav.rightIcon}" style="width: 24px;height: 24px" alt="" onclick="${gvc.event(() => {
                            })}">
                            `
                        });
                    },
                    editor: () => {
                        return gvc.map([
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
                        ]);
                    }
                };
            },
        },
        allPage: {
            defaultData: {
                cartItem: [
                    {
                        category: "HOMEE 商城",
                        category_id: "1",
                        item: [
                            {
                                item_id: "1",
                                name: "SORIA 雙抽玻璃移門電視櫃",
                                img: `${import.meta.resolve('../img/component/shoppingCart/img.png', import.meta.url)}`,
                                kind: "150公分",
                                qty: 1,
                                price: 11520,
                                subtotal: 11520,
                                select: true,
                            }
                        ]
                    },
                    {
                        category: "客廳沙發區",
                        category_id: "2",
                        item: [
                            {
                                item_id: "2",
                                name: "LINZ 三人座羽絨沙發",
                                kind: "四人座沙發布套 淺灰藍色",
                                qty: 1,
                                price: 40500,
                                subtotal: 40500,
                                select: false,
                            },
                            {
                                item_id: "3",
                                name: "SORIA 儲物櫃",
                                kind: "",
                                qty: 1,
                                price: 16100,
                                subtotal: 16100,
                                select: false,
                            }
                        ]
                    },
                    {
                        category: "媽媽新家搭配",
                        category_id: "3",
                        item: [
                            {
                                item_id: "4",
                                name: "SORIA 雙抽玻璃移門電視櫃",
                                kind: "150 公分",
                                qty: 1,
                                price: 11520,
                                subtotal: 11520,
                                select: false,
                            },
                            {
                                item_id: "5",
                                name: "SORIA 儲物櫃",
                                kind: "",
                                qty: 1,
                                price: 16100,
                                subtotal: 16100,
                                select: false,
                            },
                            {
                                item_id: "6",
                                name: "SORIA 玻璃移門儲物書櫃",
                                kind: "小儲物書櫃",
                                qty: 1,
                                price: 9665,
                                subtotal: 9665,
                                select: false,
                            },
                        ]
                    },
                    {
                        category: "電視區搭配",
                        category_id: "4",
                        item: [
                            {
                                item_id: "7",
                                name: "SORIA 雙抽玻璃移門電視櫃",
                                kind: "150 公分",
                                qty: 1,
                                price: 11520,
                                subtotal: 11520,
                                select: true,
                            },
                            {
                                item_id: "8",
                                name: "SORIA 儲物櫃",
                                kind: "",
                                qty: 1,
                                price: 16100,
                                subtotal: 16100,
                                select: false,
                            },
                            {
                                item_id: "9",
                                name: "SORIA 玻璃移門儲物書櫃",
                                kind: "小儲物書櫃",
                                qty: 1,
                                price: 9665,
                                subtotal: 9665,
                                select: false,
                            },
                        ]
                    },
                ],
                dataList: [
                    {
                        title: "首頁",
                        icon: new URL('../img/component/footer/homeBlack.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "靈感",
                        icon: new URL('../img/component/footer/idea.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "我的空間",
                        icon: new URL('../img/component/footer/myspace.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "購物車",
                        icon: new URL('../img/component/footer/shoopingCartRed.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "會員",
                        icon: new URL('../img/component/footer/user.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                ],
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    html{
                        margin: 0;
                        box-sizing: border-box;    
                        font-family: 'Noto Sans TC';        
                        font-style: normal;
                        background:#F8F3ED;
                    }
                    input[type="number"]::-webkit-inner-spin-button, 
                    input[type="number"]::-webkit-outer-spin-button { 
                      margin: 0;
                      -webkit-appearance: none;
                      appearance: none;
                    }
                    
                    
                `);
                const sharedView = new SharedView(gvc);
                let cartIn = [];
                let cartOut = [];
                let itemIndex = -1;
                let categoryIndex = -1;
                let voucherUse = 0;
                let voucher = 500;
                let subTotal = 0;
                let total = 0;
                widget.data.cartItem.forEach((cartCategory) => {
                    let checkPush = false;
                    cartCategory.item.forEach((item) => {
                        if (item.select) {
                            checkPush = true;
                        }
                    });
                    if (checkPush) {
                        cartIn.push(cartCategory);
                    }
                    else {
                        cartOut.push(cartCategory);
                    }
                });
                function addThousandSeparator(item) {
                    item.subtotal = item.qty * item.price;
                    return (item.subtotal).toLocaleString();
                }
                function checkOut() {
                }
                return {
                    view: () => {
                        return `
                        ${gvc.bindView({
                            bind: "cartIn",
                            view: () => {
                                gvc.addStyle(`
                                    .item-title{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #1E1E1E;
                                    }
                                    .item-edit{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #858585;
                                    }
                                    .checkboxImg{
                                        width:20px;
                                        height:20px;
                                        margin-right:10px;
                                    }
                                    .
                                `);
                                return gvc.map(cartIn.map((category, categoryIndex) => {
                                    return `
                                    ${gvc.bindView({
                                        bind: category.category_id,
                                        view: () => {
                                            let categoryCheck = true;
                                            category.item.forEach((item) => {
                                                if (!item.select) {
                                                    categoryCheck = false;
                                                }
                                            });
                                            let checkPic = (categoryCheck) ? '../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png';
                                            return `
                                            <div class="w-100 d-flex align-items-center" style="padding: 12px;">
                                                <img class="checkboxImg" alt="選擇" src="${import.meta.resolve(`${checkPic}`, import.meta.url)}" onclick="${gvc.event(() => {
                                                category.item.forEach((item) => {
                                                    item.select = !categoryCheck;
                                                });
                                                widget.refreshAll();
                                            })}">
                                                <div class="item-category">${category.category}</div>
                                                <div class="ms-auto item-edit" onclick="${gvc.event(() => {
                                                category.delete = (category === null || category === void 0 ? void 0 : category.delete) ? !category.delete : true;
                                                gvc.notifyDataChange(`itemGroup${category.category_id}`);
                                            })}">編輯</div>
                                            </div>
                                            <div style="height:1px; width: 100%;background: #E0E0E0;margin-bottom:12px;"></div>
                                            <div style="padding:0 12px;">   
                                                ${gvc.bindView({
                                                bind: `itemGroup${category.category_id}`,
                                                view: () => {
                                                    gvc.addStyle(`
                                                            .item-name{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 15px;
                                                                color: #1E1E1E;
                                                            }
                                                            .item-kind{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 10px;
                                                                color: #858585;
                                                            }
                                                            .itemImg{
                                                                width:64px;
                                                                height:64px;
                                                                border-radius: 12px;
                                                                background:white;
                                                                margin-right:16px;
                                                            }
                                                            .item-price{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 15px;
                                                                color: #FE5541;
                                                            }
                                                        `);
                                                    return gvc.map(category.item.map((item, itemIndex) => {
                                                        return gvc.bindView({
                                                            bind: `item${item.item_id}`,
                                                            view: () => {
                                                                let chooseEvent = () => {
                                                                    item.select = !item.select;
                                                                    widget.refreshAll();
                                                                };
                                                                let checkPic = (item.select) ? '../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png';
                                                                if (category.delete) {
                                                                    checkPic = '../img/component/shoppingCart/deleteCircle.png';
                                                                    chooseEvent = () => {
                                                                        let check = confirm("確定要刪除嘛?");
                                                                        if (check) {
                                                                            if (item.select) {
                                                                                category.item.splice(itemIndex, 1);
                                                                                widget.refreshAll();
                                                                            }
                                                                            category.item.splice(itemIndex, 1);
                                                                            if (category.item.length == 0) {
                                                                                let indexToRemove = widget.data.cartItem.findIndex((item) => item.category_id == category.category_id);
                                                                                widget.data.cartItem.splice(indexToRemove, 1);
                                                                                widget.refreshAll();
                                                                            }
                                                                            else {
                                                                                gvc.notifyDataChange(category.category_id);
                                                                                gvc.notifyDataChange('cartSubtotal');
                                                                            }
                                                                        }
                                                                    };
                                                                }
                                                                return `
                                                                    <img class="checkboxImg" alt="選擇" src="${import.meta.resolve(`${checkPic}`, import.meta.url)}" onclick="${gvc.event(() => {
                                                                    chooseEvent();
                                                                })}">
                                                                    <img class="itemImg" src="${item.img}">
                                                                    <div class="d-flex flex-column flex-grow-1">
                                                                        <div class="item-name">${item.name}</div>
                                                                        <div class="d-flex">
                                                                            ${(() => {
                                                                    if (item.kind) {
                                                                        return `
                                                                                            <div class="item-kind">${item.kind}</div>
                                                                                            <img style="width:16px;height:16px;" src="${import.meta.resolve('../img/component/shoppingCart/downArrow.svg', import.meta.url)}">
                                                                                        `;
                                                                    }
                                                                    return ``;
                                                                })()}                                                                        
                                                                        </div>
                                                                        <div class="d-flex " style="margin-top: 13px;">
                                                                            <div class="d-flex" style="">
                                                                                <img style="width: 24px;height: 24px;" src="${import.meta.resolve('../img/component/minusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                                                                    item.qty--;
                                                                    item.qty = (item.qty < 1) ? 1 : item.qty;
                                                                    item.subtotal = item.qty * item.price;
                                                                    gvc.notifyDataChange(`qtyNumber${item.item_id}`);
                                                                    gvc.notifyDataChange(`cartSubtotal`);
                                                                    gvc.notifyDataChange(`itemTotal${item.item_id}`);
                                                                })}">
                                                                                ${gvc.bindView({
                                                                    bind: `qtyNumber${item.item_id}`,
                                                                    view: () => {
                                                                        return `
                                                                                        <input class="border-0" style="width: 48px;text-align: center;" type="number" value="${item.qty}" onchange="${gvc.event((e) => {
                                                                            item.qty = e.value;
                                                                            if (widget.data.qty < 1) {
                                                                                item.qty = 1;
                                                                            }
                                                                            item.subtotal = item.qty * item.price;
                                                                            gvc.notifyDataChange(`qtyNumber${item.item_id}`);
                                                                            gvc.notifyDataChange(`cartSubtotal`);
                                                                            gvc.notifyDataChange(`itemTotal${item.item_id}`);
                                                                        })}">`;
                                                                    }, divCreate: { class: `qtyNumber`, style: `` }
                                                                })}
                                                                                <img style="width: 24px;height: 24px;" src="${import.meta.resolve('../img/component/plusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                                                                    item.qty++;
                                                                    item.subtotal = item.qty * item.price;
                                                                    gvc.notifyDataChange(`cartSubtotal`);
                                                                    gvc.notifyDataChange(`qtyNumber${item.item_id}`);
                                                                    gvc.notifyDataChange(`itemTotal${item.item_id}`);
                                                                })}">                                        
                                                                            </div>
                                                                            ${gvc.bindView({
                                                                    bind: `itemTotal${item.item_id}`,
                                                                    view: () => {
                                                                        return `NT$ ${addThousandSeparator(item)}`;
                                                                    }, divCreate: { class: `item-price ms-auto`, style: `` }
                                                                })}                                                                        
                                                                        </div>
                                                                    </div>                                                            
                                                                `;
                                                            }, divCreate: { class: `d-flex align-items-center`, style: `margin-bottom:16px;` }
                                                        });
                                                    }));
                                                }, divCreate: { style: ``, class: `` }
                                            })}                                     
                         
                                            </div>
                                            
                                            `;
                                        },
                                        divCreate: { class: `border`, style: `background: #FFFFFF;border-radius: 20px;margin:12px` }
                                    })}
                                    `;
                                }));
                            }, divCreate: { class: `d-flex flex-column`, style: `` }
                        })}
                        ${gvc.bindView({
                            bind: "cartSubtotal",
                            view: () => {
                                gvc.addStyle(`
                                    .subTotal{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #1E1E1E;
                                    }
                                    .voucherBlock{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 15px;
                                        color: #FE5541;
                                    }
                                    .voucher{
                                        color: #FE5541;
                                    }
                                    .voucherInput{
                                        height:100%;
                                        width:24px;
                                    }
                                    .shippingText{
                                        font-weight: 400;
                                        font-size: 12px;
                                        color: #1E1E1E;
                                        padding-top:9px;
                                    }
                                    .totalText{                                        
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #858585;
                                        padding-top:3px;
                                    }
                                    .total{
                                        font-weight: 500;
                                        font-size: 18px;
                                        color: #1E1E1E;
                                        margin-left:8px;
                                    }
                                    .checkout-left{
                                        width:60%;
                                        background:#FFDC6A;
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 500;
                                        font-size: 24px;
                                        border-radius: 26px 0px 0px 26px;
                                        padding-left:28px;
                                        color: #1E1E1E;
                                    }
                                    .checkout-right{
                                        width:40%;
                                        background:#FE5541;
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 20px;
                                        border-radius: 0px 26px 26px 0px;
                                        color: #FFFFFF;                                        
                                        letter-spacing: 0.15em;
                                    }
                                `);
                                subTotal = 0;
                                cartIn.forEach((category) => {
                                    category.item.forEach((item) => {
                                        if (item.select) {
                                            subTotal += item.subtotal;
                                        }
                                    });
                                });
                                total = subTotal - voucherUse;
                                return `
                                    <div class="d-flex align-items-center justify-content-between subTotal" style="padding:12px;">
                                        <div>小計金額</div>
                                        <div>${subTotal.toLocaleString()}</div>
                                    </div>
                                    <div class="d-flex" style="padding:0 12px; margin-bottom:7px;">
                                        <img style="width: 20px;height: 16px;margin-right:10px;" src="${import.meta.resolve(`../img/component/ticket.svg`, import.meta.url)}">
                                        <div class="voucherBlock" onclick="${gvc.event(() => {
                                })}">使用優惠卷或輸入優惠代碼</div>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-between subTotal" style="padding:0 12px;margin-bottom:13px;">
                                        <div style="font-size: 12px;">你有<span class="voucher" style="font-size: 15px;">$${voucher.toLocaleString()}</span>點數回饋</div>
                                        <div class="d-flex">- NT$
                                            <input class="voucherInput" type="number" value="${voucherUse}" style="text-align: right" onchange="${gvc.event((e) => {
                                    voucherUse = (Number(e.value) > voucher) ? voucher : Number(e.value);
                                    console.log(voucherUse);
                                    gvc.notifyDataChange('cartSubtotal');
                                })}">
                                        </div>
                                    </div>
                                    <div style="height:1px; width: 100%;background: #E0E0E0;"></div>
                                    <div class="d-flex justify-content-between" style="padding:12px;">
                                        <div class="shippingText">運費將在結帳時計算</div>
                                        <div class="d-flex">
                                            <div class="totalText">總計金額:</div>
                                            <div class="total">
                                                NT$ ${total.toLocaleString()}
                                            </div>
                                        </div>
                                        
                                    </div>

                                    <div class="w-100 d-flex" style="position:fixed;left:0;bottom:116px;height:52px;">
                                        <div class="checkout-left d-flex align-items-center">NT$ ${total.toLocaleString()}</div>
                                        <div class="checkout-right d-flex align-items-center justify-content-center" onclick="${gvc.event(() => {
                                    checkOut();
                                })}">結帳</div>
                                    </div>
                                `;
                            }, divCreate: { class: `d-flex flex-column border`, style: `background: #FFFFFF;border-radius: 20px;margin:12px` }
                        })}
                        ${gvc.bindView({
                            bind: "cartOut",
                            view: () => {
                                return gvc.map(cartOut.map((category, categoryIndex) => {
                                    return `
                                    ${gvc.bindView({
                                        bind: category.category_id,
                                        view: () => {
                                            let categoryCheck = true;
                                            category.item.forEach((item) => {
                                                if (!item.select) {
                                                    categoryCheck = false;
                                                }
                                            });
                                            let checkPic = (categoryCheck) ? '../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png';
                                            return `
                                            <div class="w-100 d-flex align-items-center" style="padding: 12px;">
                                                <img class="checkboxImg" alt="選擇" src="${import.meta.resolve(`${checkPic}`, import.meta.url)}" onclick="${gvc.event(() => {
                                                category.item.forEach((item) => {
                                                    item.select = !categoryCheck;
                                                });
                                                widget.refreshAll();
                                            })}">
                                                <div class="item-category">${category.category}</div>
                                                <div class="ms-auto item-edit" onclick="${gvc.event(() => {
                                                category.delete = (category === null || category === void 0 ? void 0 : category.delete) ? !category.delete : true;
                                                gvc.notifyDataChange(`itemGroup${category.category_id}`);
                                            })}">編輯</div>
                                            </div>
                                            <div style="height:1px; width: 100%;background: #E0E0E0;margin-bottom:12px;"></div>
                                            <div style="padding:0 12px;">       
                                                ${gvc.bindView({
                                                bind: `itemGroup${category.category_id}`,
                                                view: () => {
                                                    gvc.addStyle(`
                                                            .item-name{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 15px;
                                                                color: #1E1E1E;
                                                            }
                                                            .item-kind{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 10px;
                                                                color: #858585;
                                                            }
                                                            .itemImg{
                                                                width:64px;
                                                                height:64px;
                                                                border-radius: 12px;
                                                                background:white;
                                                                margin-right:16px;
                                                            }
                                                            .item-price{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 15px;
                                                                color: #FE5541;
                                                            }
                                                        `);
                                                    return gvc.map(category.item.map((item, itemIndex) => {
                                                        return gvc.bindView({
                                                            bind: `item${itemIndex}`,
                                                            view: () => {
                                                                let chooseEvent = () => {
                                                                    item.select = !item.select;
                                                                    widget.refreshAll();
                                                                };
                                                                let checkPic = (item.select) ? '../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png';
                                                                if (category.delete) {
                                                                    checkPic = '../img/component/shoppingCart/deleteCircle.png';
                                                                    chooseEvent = () => {
                                                                        let check = confirm("確定要刪除嘛?");
                                                                        if (check) {
                                                                            category.item.splice(itemIndex, 1);
                                                                            if (category.item.length == 0) {
                                                                                let indexToRemove = widget.data.cartItem.findIndex((item) => item.category_id == category.category_id);
                                                                                widget.data.cartItem.splice(indexToRemove, 1);
                                                                                widget.refreshAll();
                                                                            }
                                                                            else {
                                                                                gvc.notifyDataChange(category.category_id);
                                                                            }
                                                                        }
                                                                    };
                                                                }
                                                                return `
                                                                    <img class="checkboxImg" alt="選擇" src="${import.meta.resolve(`${checkPic}`, import.meta.url)}" onclick="${gvc.event(() => {
                                                                    chooseEvent();
                                                                })}">
                                                                    <img class="itemImg" src="${item.img}">
                                                                    <div class="d-flex flex-column flex-grow-1">
                                                                        <div class="item-name">${item.name}</div>
                                                                        <div class="d-flex">
                                                                            ${(() => {
                                                                    if (item.kind) {
                                                                        return `
                                                                                            <div class="item-kind">${item.kind}</div>
                                                                                            <img style="width:16px;height:16px;" src="${import.meta.resolve('../img/component/shoppingCart/downArrow.svg', import.meta.url)}">
                                                                                        `;
                                                                    }
                                                                    return ``;
                                                                })()}                                                                            
                                                                        </div>
                                                                        <div class="d-flex " style="margin-top: 13px;">
                                                                            <div class="d-flex" style="">
                                                                                <img style="width: 24px;height: 24px;" src="${import.meta.resolve('../img/component/minusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                                                                    item.qty--;
                                                                    item.qty = (item.qty < 1) ? 1 : item.qty;
                                                                    item.subtotal = item.qty * item.price;
                                                                    gvc.notifyDataChange(`item${item.item_id}`);
                                                                })}">
                                                                                ${gvc.bindView({
                                                                    bind: `qtyNumber${item.item_id}`,
                                                                    view: () => {
                                                                        return `
                                                                                            <input class="border-0" style="width: 48px;text-align: center;" type="number" value="${item.qty}" onchange="${gvc.event((e) => {
                                                                            item.qty = e.value;
                                                                            if (widget.data.qty < 1) {
                                                                                item.qty = 1;
                                                                            }
                                                                            item.subtotal = item.qty * item.price;
                                                                            gvc.notifyDataChange(`item${item.item_id}`);
                                                                        })}">`;
                                                                    }, divCreate: { class: `qtyNumber`, style: `` }
                                                                })}
                                                                                <img style="width: 24px;height: 24px;" src="${import.meta.resolve('../img/component/plusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                                                                    item.qty++;
                                                                    item.subtotal = item.qty * item.price;
                                                                    gvc.notifyDataChange(`item${item.item_id}`);
                                                                })}">                                        
                                                                            </div>
                                                                            <div class="item-price ms-auto">NT$ ${addThousandSeparator(item)}</div>
                                                                        </div>
                                                                    </div>                                                            
                                                                `;
                                                            }, divCreate: { class: `d-flex align-items-center`, style: `margin-bottom:16px;` }
                                                        });
                                                    }));
                                                }, divCreate: { style: ``, class: `` }
                                            })}                                                                                 
                                            </div>
                                            
                                            `;
                                        },
                                        divCreate: { class: `border`, style: `background: #FFFFFF;border-radius: 20px;margin:12px;padding-bottom:100px;` }
                                    })}
                                    `;
                                }));
                            }, divCreate: { class: `d-flex flex-column`, style: `` }
                        })}
                        ${gvc.bindView({
                            bind: "footer",
                            view: () => {
                                glitter.runJsInterFace("getBottomInset", {}, (response) => {
                                    var _a;
                                    if (((_a = widget.data) === null || _a === void 0 ? void 0 : _a.bottomInset) != response.data) {
                                        widget.data.bottomInset = response.data;
                                        widget.refreshAll();
                                    }
                                }, {
                                    webFunction: () => {
                                        return { data: 10 };
                                    }
                                });
                                gvc.addStyle(`
                                    footer{
                                        background:white;
                                        box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);
                                        padding-top:18px;
                                    }
                                    .footerTitle{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 12px;
                                        line-height: 17px;
                                        text-align: center;
                                        color: #1E1E1E;
                                    }
                                    .selected{
                                        color:#FE5541;
                                    }
                                    .cartinCount{
                                        width : 16px;
                                        height : 16px;
                                        background: #FE5541;
                                        
                                        font-weight: 500;
                                        font-size: 10px;
                                       
                                        border: 1px solid #FFFFFF;
                                        border-radius: 8px;
                                        color:white;
                                        
                                        position: absolute;
                                        top:0;
                                        right:0;
                                    }
                                `);
                                return `
                                    <footer class="d-flex align-items-center justify-content-around w-100" style="padding-bottom: ${widget.data.bottomInset}px;position: fixed;bottom: 0px;left: 0px;">
                                        ${(() => {
                                    return gvc.map(widget.data.dataList.map((data, index) => {
                                        return `
                                                <div class="d-flex flex-column align-items-center" onclick="${gvc.event((e) => {
                                            ClickEvent.trigger({
                                                gvc, widget, clickEvent: data
                                            });
                                        })}">
                                                    <div style="position:relative">
                                                        <img src=${data.icon} style="width: 28px;height: 28px;">
                                                        ${gvc.bindView({
                                            bind: "cartinCount",
                                            view: () => {
                                                if (index == 3) {
                                                    let count = 0;
                                                    cartIn.forEach((category) => {
                                                        category.item.forEach((item) => {
                                                            if (item.select) {
                                                                count++;
                                                            }
                                                        });
                                                    });
                                                    return `
                                                                    <div class="cartinCount d-flex align-items-center justify-content-center">
                                                                        ${count}
                                                                    </div>    
                                                                `;
                                                }
                                                else {
                                                    return ``;
                                                }
                                            }, divCreate: { style: '', class: `` }
                                        })}                                                      
                                                    </div>
                                                    
                                                    <div class="footerTitle ${(() => { if (index == 0)
                                            return "selected"; })()}">${data.title}</div>
                                                </div>
                                                        `;
                                    }));
                                })()}
                                    </footer>
                                `;
                            }, divCreate: {}
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
