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
                    rightIcon:import.meta.resolve!('../img/component/service.png',import.meta.url),
                    rightPage:"",

                },

            },
            render:(gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    html{
                        margin: 0;
                        box-sizing: border-box;    
                        font-family: 'Noto Sans TC';        
                    }
                    
                    
                `)
                const sharedView=new SharedView(gvc);

                return {
                    view: ()=>{
                        return sharedView.navigationBar({
                            title:"購物車",
                            leftIcon : ``,
                            rightIcon : `<img class="" src="${widget.data.nav.rightIcon}" style="width: 24px;height: 24px" alt="" onclick="${gvc.event(() => {
                            })}">
                            `

                        })

                    },
                    editor: ()=>{
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">右方icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.nav.rightIcon}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                glitter.ut.chooseMediaCallback({
                                    single:true,
                                    accept:'image/*',
                                    callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                        api.upload(data[0].file,(link)=>{
                                            widget.data.nav.rightIcon=link;
                                            widget.refreshAll()
                                        })
                                    }
                                })
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `右方icon跳轉的頁面`,
                                default: widget.data.nav.rightPage,
                                placeHolder: widget.data.nav.rightPage,
                                callback: (text: string) => {
                                    widget.data.nav.rightPage = text
                                    widget.refreshAll!()
                                }
                            }),
                        ])
                    }

                }
            },
        },
        allPage: {
            defaultData:{
                cartItem:[
                    {
                        category:"HOMEE 商城",
                        category_id:"1",
                        item:[
                            {
                                item_id:"1",//variant
                                name:"SORIA 雙抽玻璃移門電視櫃",
                                img:`${import.meta.resolve!('../img/component/shoppingCart/img.png',import.meta.url)}`,
                                kind:"150公分",
                                qty:1,
                                price:11520,
                                subtotal:11520,
                                select:true,
                            }
                        ]
                    },
                    {
                        category:"客廳沙發區",
                        category_id:"2",
                        item:[
                            {
                                item_id:"2",
                                name:"LINZ 三人座羽絨沙發",
                                kind:"四人座沙發布套 淺灰藍色",
                                qty:1,
                                price:40500,
                                subtotal:40500,
                                select:false,
                            },
                            {
                                item_id:"3",
                                name:"SORIA 儲物櫃",
                                kind:"",
                                qty:1,
                                price:16100,
                                subtotal:16100,
                                select:false,
                            }
                        ]
                    },
                    {
                        category:"媽媽新家搭配",
                        category_id:"3",
                        item:[
                            {
                                item_id:"4",
                                name:"SORIA 雙抽玻璃移門電視櫃",
                                kind:"150 公分",
                                qty:1,
                                price:11520,
                                subtotal:11520,
                                select:false,
                            },
                            {
                                item_id:"5",
                                name:"SORIA 儲物櫃",
                                kind:"",
                                qty:1,
                                price:16100,
                                subtotal:16100,
                                select:false,
                            },
                            {
                                item_id:"6",
                                name:"SORIA 玻璃移門儲物書櫃",
                                kind:"小儲物書櫃",
                                qty:1,
                                price:9665,
                                subtotal:9665,
                                select:false,
                            },
                        ]
                    },
                    {
                        category:"電視區搭配",
                        category_id:"4",
                        item:[
                            {
                                item_id:"7",
                                name:"SORIA 雙抽玻璃移門電視櫃",
                                kind:"150 公分",
                                qty:1,
                                price:11520,
                                subtotal:11520,
                                select:true,
                            },
                            {
                                item_id:"8",
                                name:"SORIA 儲物櫃",
                                kind:"",
                                qty:1,
                                price:16100,
                                subtotal:16100,
                                select:false,
                            },
                            {
                                item_id:"9",
                                name:"SORIA 玻璃移門儲物書櫃",
                                kind:"小儲物書櫃",
                                qty:1,
                                price:9665,
                                subtotal:9665,
                                select:false,
                            },
                        ]
                    },
                ],

            },
            render:(gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    html{
                        margin: 0;
                        box-sizing: border-box;    
                        font-family: 'Noto Sans TC';        
                        font-style: normal;
                    }
                    
                    
                `)
                const sharedView=new SharedView(gvc);
                let cartIn:any[]=[]
                let cartOut:any[]=[]
                let itemIndex = -1;
                let categoryIndex = -1;
                widget.data.cartItem.forEach((cartCategory:any)=>{
                    let checkPush=false;
                    cartCategory.item.forEach((item:any)=>{
                        if (item.select){
                            checkPush = true;
                        }
                    })
                    if (checkPush){
                        cartIn.push(cartCategory);
                    }else {
                        cartOut.push(cartCategory);
                    }
                })

                function addThousandSeparator(item: any): string {

                    return (item.qty * item.price).toLocaleString();
                }



                return {
                    view: ()=>{
                        return `
                        ${gvc.bindView({
                            bind:"cartIn",
                            view : ()=>{
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
                                `)
                                return gvc.map(cartIn.map((category:any)=>{
                                    return `
                                    ${gvc.bindView({
                                        bind:category.category_id,
                                        view : ()=>{
                                            let categoryCheck = true;
                                            category.item.forEach((item:any)=>{
                                                if (!item.select){
                                                    categoryCheck = false;
                                                }
                                            })
                                            let checkPic = (categoryCheck) ?'../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png'
                                            return `
                                            <div class="w-100 d-flex align-items-center" style="padding: 12px;">
                                                <img class="checkboxImg" alt="選擇" src="${import.meta.resolve!(`${checkPic}`,import.meta.url)}" onclick="${gvc.event(()=>{
                                                    category.item.forEach((item:any)=>{
                                                        item.select = !categoryCheck;
                                                        
                                                    })
                                                    widget.refreshAll()
                                                })}">
                                                <div class="item-category">${category.category}</div>
                                                <div class="ms-auto item-edit" onclick="${gvc.event(()=>{
                                                    
                                                })}">編輯</div>
                                            </div>
                                            <div style="height:1px; width: 100%;background: #E0E0E0;"></div>
                                            <div style="padding:0 12px;">                                        
                                                ${(()=>{
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
                                                `)
                                                    return gvc.map(category.item.map((item:any)=>{
                                                        return gvc.bindView({
                                                            bind:`item${item.item_id}`,
                                                            view:()=>{
                                                                let checkPic = (item.select) ?'../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png'
                                                                return `
                                                                <img class="checkboxImg" alt="選擇" src="${import.meta.resolve!(`${checkPic}`,import.meta.url)}" onclick="${gvc.event(()=>{
                                                                    item.select = !item.select;
                                                                    widget.refreshAll();
                                                                })}">
                                                                <img class="itemImg" src="${item.img}">
                                                                <div class="d-flex flex-column flex-grow-1">
                                                                    <div class="item-name">${item.name}</div>
                                                                    <div class="d-flex">
                                                                        ${(()=>{
                                                                            if (item.kind){
                                                                                return `
                                                                                    <div class="item-kind">${item.kind}</div>
                                                                                    <img style="width:16px;height:16px;" src="${import.meta.resolve!('../img/component/shoppingCart/downArrow.svg',import.meta.url)}">
                                                                                ` 
                                                                            }
                                                                            return ``
                                                                        })()}                                                                        
                                                                    </div>
                                                                    <div class="d-flex " style="margin-top: 13px;">
                                                                        <div class="d-flex" style="">
                                                                            <img style="width: 24px;height: 24px;" src="${import.meta.resolve!('../img/component/minusCircle.svg',import.meta.url)}" onclick="${gvc.event(()=>{
                                                                                item.qty--;
                                                                                item.qty = (item.qty<1) ? 1 : item.qty;
                                                                                gvc.notifyDataChange(`qtyNumber${item.item_id}`);
                                                                            })}">
                                                                                ${gvc.bindView({
                                                                                bind:`qtyNumber${item.item_id}`,
                                                                                view : ()=>{
                                                                                    return `
                                                                                    <input class="border-0" style="width: 48px;text-align: center;"  value="${item.qty}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                                                                        item.qty = e.value
                                                                                        if (widget.data.qty < 1){
                                                                                            item.qty = 1;
                                                                                            gvc.notifyDataChange(`qtyNumber${item.item_id}`);
                                                                                        }
                                                                                    })}">`
                                                                                },divCreate : {class : `qtyNumber` , style : ``}
                                                                                })}
                                                                            <img style="width: 24px;height: 24px;" src="${import.meta.resolve!('../img/component/plusCircle.svg',import.meta.url)}" onclick="${gvc.event(()=>{
                                                                                item.qty++;
                                                                                
                                                                                gvc.notifyDataChange(`qtyNumber${item.item_id}`);
                                                                            })}">                                        
                                                                        </div>
                                                                        ${gvc.bindView({
                                                                            bind:`itemTotal${item.item_id}`,
                                                                            view : ()=>{
                                                                                return `NT$ ${addThousandSeparator(item)}`
                                                                            },divCreate : {class : `item-price ms-auto` , style : ``}
                                                                        })}                                                                        
                                                                    </div>
                                                                </div>                                                            
                                                                `
                                                            },divCreate:{class:`d-flex align-items-center` , style:``}
                                                        })
                                                    }))
                                                })()}
                                            </div>
                                            
                                            `
                                        }
                                        ,divCreate : {class:`border` , style:`background: #FFFFFF;border-radius: 20px;margin:12px`}
                                    })}
                                    `
                                }))
                            },divCreate : {class:`d-flex flex-column` , style:``}
                        })}
                        
                        
                        ${gvc.bindView({
                            bind:"cartSubtotal",
                            view : ()=>{
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
                                `)
                                let subTotal = 52020;
                                let voucher = 0;
                                let voucherUse = 0;
                                let total = subTotal - voucherUse;
                                return `
                                    <div class="d-flex align-items-center justify-content-between subTotal" style="padding:12px;">
                                        <div>小計金額</div>
                                        <div>${subTotal.toLocaleString()}</div>
                                    </div>
                                    <div class="d-flex" style="padding:0 12px; margin-bottom:7px;">
                                        <img style="width: 20px;height: 16px;margin-right:10px;" src="${import.meta.resolve!(`../img/component/ticket.svg`,import.meta.url)}">
                                        <div class="voucherBlock" onclick="${gvc.event(()=>{
                                                
                                        })}">使用優惠卷或輸入優惠代碼</div>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-between subTotal" style="padding:0 12px;margin-bottom:13px;">
                                        <div style="font-size: 12px;">你有<span class="voucher" style="font-size: 15px;">$${voucher.toLocaleString()}</span>點數回饋</div>
                                        <div class="d-flex">- NT$
                                            <input class="voucherInput" value="${voucherUse}" style="text-align: right" onchange="${gvc.event((e:HTMLInputElement)=>{
                                                e.value = String(voucherUse);
                                            })}">
                                        </div>
                                    </div>
                                    <div style="height:1px; width: 100%;background: #E0E0E0;"></div>
                                    <div class="d-flex justify-content-between" style="padding:12px;">
                                        <div class="shippingText">運費將在結帳時計算</div>
                                        <div class="d-flex">
                                            <div class="totalText">總計金額:</div>
                                            <div class="total">
                                                NT$ ${total}
                                            </div>
                                        </div>
                                        
                                    </div>
                                `
                            },divCreate : {class:`d-flex flex-column border` , style:`background: #FFFFFF;border-radius: 20px;margin:12px`}
                        })}
                        ${gvc.bindView({
                            bind:"cartOut",
                            view : ()=>{
                                return gvc.map(cartOut.map((category:any)=>{
                                    return `
                                    ${gvc.bindView({
                                        bind:category.category_id,
                                        view : ()=>{
                                            let categoryCheck = true;
                                            category.item.forEach((item:any)=>{
                                                if (!item.select){
                                                    categoryCheck = false;
                                                }
                                            })
                                            let checkPic = (categoryCheck) ?'../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png'
                                            return `
                                            <div class="w-100 d-flex align-items-center" style="padding: 12px;">
                                                <img class="checkboxImg" alt="選擇" src="${import.meta.resolve!(`${checkPic}`,import.meta.url)}" onclick="${gvc.event(()=>{
                                                    category.item.forEach((item:any)=>{
                                                        item.select = !categoryCheck;
                                                        // gvc.notifyDataChange(category.category_id)
                                                    })
                                                    widget.refreshAll()
                                                })}">
                                                <div class="item-category">${category.category}</div>
                                                <div class="ms-auto item-edit" onclick="${gvc.event(()=>{

                                            })}">編輯</div>
                                            </div>
                                            <div style="height:1px; width: 100%;background: #E0E0E0;"></div>
                                            <div style="padding:0 12px;">                                        
                                                ${(()=>{
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
                                                `)
                                                return gvc.map(category.item.map((item:any)=>{
                                                    return gvc.bindView({
                                                        bind:`item${itemIndex}`,
                                                        view:()=>{
                                                            let checkPic = (item.select) ?'../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png'
                                                            return `
                                                                <img class="checkboxImg" alt="選擇" src="${import.meta.resolve!(`${checkPic}`,import.meta.url)}" onclick="${gvc.event(()=>{
                                                                item.select = !item.select;
                                                                widget.refreshAll();
                                                            })}">
                                                                <img class="itemImg" src="${item.img}">
                                                                <div class="d-flex flex-column flex-grow-1">
                                                                    <div class="item-name">${item.name}</div>
                                                                    <div class="d-flex">
                                                                        ${(()=>{
                                                                            if (item.kind){
                                                                                return `
                                                                                    <div class="item-kind">${item.kind}</div>
                                                                                    <img style="width:16px;height:16px;" src="${import.meta.resolve!('../img/component/shoppingCart/downArrow.svg',import.meta.url)}">
                                                                                `
                                                                            }
                                                                            return ``
                                                                        })()}
                                                                        
                                                                    </div>
                                                                    <div class="d-flex " style="margin-top: 13px;">
                                                                        <div class="d-flex" style="">
                                                                            <img style="width: 24px;height: 24px;" src="${import.meta.resolve!('../img/component/minusCircle.svg',import.meta.url)}" onclick="${gvc.event(()=>{
                                                                                item.qty--;
                                                                                item.qty = (item.qty<1) ? 1 : item.qty;
                                                                                gvc.notifyDataChange(`qtyNumber${item.item_id}`);
                                                                            })}">
                                                                                ${gvc.bindView({
                                                                                    bind:`qtyNumber${item.item_id}`,
                                                                                    view : ()=>{
                                                                                        return `
                                                                                        <input class="border-0" style="width: 48px;text-align: center;"  value="${item.qty}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                                                                            item.qty = e.value
                                                                                            if (widget.data.qty < 1){
                                                                                                item.qty = 1;
                                                                                                gvc.notifyDataChange(`qtyNumber${item.item_id}`);
                                                                                            }
                                                                                        })}">`
                                                                                    },divCreate : {class : `qtyNumber` , style : ``}
                                                                                })}
                                                                            <img style="width: 24px;height: 24px;" src="${import.meta.resolve!('../img/component/plusCircle.svg',import.meta.url)}" onclick="${gvc.event(()=>{
                                                                                item.qty++;
                                                                                
                                                                                gvc.notifyDataChange(`qtyNumber${item.item_id}`);
                                                                            })}">                                        
                                                                        </div>
                                                                        <div class="item-price ms-auto">NT$ ${addThousandSeparator(item)}</div>
                                                                    </div>
                                                                </div>                                                            
                                                                `
                                                        },divCreate:{class:`d-flex align-items-center` , style:``}
                                                    })

                                                }))
                                            })()}
                                            </div>
                                            
                                            `
                                        }
                                        ,divCreate : {class:`border` , style:`background: #FFFFFF;border-radius: 20px;margin:12px;`}
                                    })}
                                    `
                                }))
                            },divCreate : {class:`d-flex flex-column` , style:``}
                        })}
                        
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