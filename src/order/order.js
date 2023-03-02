'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { Api } from "../homee/api/homee-api.js";
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
        orderHistory: {
            defaultData: {
                orderData: [{
                        number: "20220718",
                        date: "2022-07-18",
                        paysStatus: 3,
                        processingStatus: 0,
                        amount: 470,
                    },
                    {
                        number: "20211108",
                        date: "2021-11-08",
                        paysStatus: 3,
                        processingStatus: 2,
                        amount: 470,
                    },],
                event: {},
                payStatus: ["未付款", "付款失敗", "超過付款時間", "已付款", "退款中", "以退款"],
                processingStatus: ["待出貨", "出貨中", "已出貨", "已取消"]
            },
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                return {
                    view: () => {
                        gvc.addStyle(`
                            .fontHomee *{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                            }
                        `);
                        let classStyle = {
                            ticket: `padding: 11px 24px 12px;gap: 8px;background: #FBF9F6;border-radius: 20px;margin-bottom:12px;`,
                            title: `font-weight: 400;font-size: 18px;line-height: 26px;margin-right:8px;`,
                            orderNo: `font-weight: 400;font-size: 18px;line-height: 26px;color: #FD6A58;`,
                            bar: `background:#D6D6D6;height:1px;margin:4px 0`,
                            status: `width:25%;font-weight: 400;font-size: 12px;line-height: 17px;color: #292929;`,
                            statusValue: `width:25%;font-weight: 400;font-size: 10px;line-height: 14px;color: #292929;`,
                            moreOrder: `font-weight: 400;font-size: 15px;color: #1E1E1E;`
                        };
                        return `${gvc.map(widget.data.orderData.map((orderData) => {
                            return `
                                <div class="d-flex flex-column fontHomee" style="${classStyle.ticket}">
                                    <div class="d-flex">
                                        <div class="" style="${classStyle.title}">訂單</div>
                                        <div class="" style="${classStyle.orderNo}">#${orderData.number}</div>
                                    </div>
                                    <div class="w-100">
                                        <div class="d-flex">
                                            <div style="${classStyle.status}">日期</div>
                                            <div style="${classStyle.status}">付款狀態</div>
                                            <div style="${classStyle.status}">處理狀態</div>
                                            <div style="${classStyle.status}">總共</div>
                                        </div>
                                        <div class="w-100" style="${classStyle.bar}"></div>
                                        <div class="d-flex">
                                            <div style="${classStyle.statusValue}">${orderData.date}</div>
                                            <div style="${classStyle.statusValue}">${widget.data.payStatus[orderData.paysStatus]}</div>
                                            <div style="${classStyle.statusValue}">${widget.data.processingStatus[orderData.processingStatus]}</div>
                                            <div style="${classStyle.statusValue}">NT$${orderData.amount}</div>                                            
                                        </div>
                                    </div>
                                </div>
                            `;
                        }))}
                            <div class="d-flex align-items-center justify-content-center" style="${classStyle.moreOrder}" onclick="${gvc.event(() => {
                            ClickEvent.trigger({
                                gvc, widget, clickEvent: widget.data.event
                            });
                        })}">
                                更多訂單
                            </div>
                        `;
                    },
                    editor: () => {
                        return `${ClickEvent.editer(gvc, widget, widget.data.event)}`;
                    }
                };
            },
        },
        orderAllHistory: {
            defaultData: {
                orderData: [{
                        number: "20220718",
                        date: "2022-07-18",
                        paysStatus: 3,
                        processingStatus: 0,
                        amount: 470,
                    },
                    {
                        number: "20211108",
                        date: "2021-11-08",
                        paysStatus: 3,
                        processingStatus: 2,
                        amount: 470,
                    },],
                event: {},
                payStatus: ["未付款", "付款失敗", "超過付款時間", "已付款", "退款中", "以退款"],
                processingStatus: ["待出貨", "出貨中", "已出貨", "已取消"]
            },
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                return {
                    view: () => {
                        gvc.addStyle(`
                            .fontHomee *{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                            }
                        `);
                        let classStyle = {
                            ticket: `padding: 11px 24px 12px;gap: 8px;background: #FBF9F6;border-radius: 20px;margin-bottom:12px;`,
                            title: `font-weight: 400;font-size: 18px;line-height: 26px;margin-right:8px;`,
                            orderNo: `font-weight: 400;font-size: 18px;line-height: 26px;color: #FD6A58;`,
                            bar: `background:#D6D6D6;height:1px;margin:4px 0`,
                            status: `width:25%;font-weight: 400;font-size: 12px;line-height: 17px;color: #292929;`,
                            statusValue: `width:25%;font-weight: 400;font-size: 10px;line-height: 14px;color: #292929;`,
                            moreOrder: `font-weight: 400;font-size: 15px;color: #1E1E1E;`
                        };
                        return `${gvc.map(widget.data.orderData.map((orderData) => {
                            return `
                                <div class="d-flex flex-column fontHomee" style="${classStyle.ticket}">
                                    <div class="d-flex">
                                        <div class="" style="${classStyle.title}">訂單</div>
                                        <div class="" style="${classStyle.orderNo}">#${orderData.number}</div>
                                    </div>
                                    <div class="w-100">
                                        <div class="d-flex">
                                            <div style="${classStyle.status}">日期</div>
                                            <div style="${classStyle.status}">付款狀態</div>
                                            <div style="${classStyle.status}">處理狀態</div>
                                            <div style="${classStyle.status}">總共</div>
                                        </div>
                                        <div class="w-100" style="${classStyle.bar}"></div>
                                        <div class="d-flex">
                                            <div style="${classStyle.statusValue}">${orderData.date}</div>
                                            <div style="${classStyle.statusValue}">${widget.data.payStatus[orderData.paysStatus]}</div>
                                            <div style="${classStyle.statusValue}">${widget.data.processingStatus[orderData.processingStatus]}</div>
                                            <div style="${classStyle.statusValue}">NT$${orderData.amount}</div>                                            
                                        </div>
                                    </div>
                                </div>
                            `;
                        }))}                            
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
                const data = widget.data;
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
