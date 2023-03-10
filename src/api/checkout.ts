import {appConfig} from "../config.js"

export interface CheckOutData {
    product_list: { variant_id: number; sku_id: string; name: string; preview_image: string; price: number; attribute_value: string; amount: number }[];
    total_amount: number;
    discount: number;
    voucherArray: { name: string; code: null | string; used: true; discount: number }[];
    voucherCode: false;
    voucherText: string;
    easterEggCode: false
}


export class Checkout {
    public static cartTag = "njasndjnui32hi2"

    public static addToCart(obj: { category: string, skuID: string, amount: number, callback: (response: boolean) => void }) {
        const glitter = (window as any).glitter
        Checkout.getCart((cartData) => {
            cartData[obj.category] = cartData[obj.category] ?? {}
            cartData[obj.category]!![obj.skuID] = cartData[obj.category]!![obj.skuID] ?? {
                count: 0,
                sku: obj.skuID,
                isSelect: true
            }
            cartData[obj.category]!![obj.skuID].count += obj.amount
            glitter.setPro(Checkout.cartTag, JSON.stringify(cartData), (response: any) => {
                obj.callback(true)
                glitter.share.cart = glitter.share.cart ?? {}
                glitter.share.cart.callback = glitter.share.cart.callback ?? []
                glitter.share.cart.callback.map((dd: any) => {
                    dd();
                });
            })
        })
    }

    public static setCart({cartData, callback}: { cartData: any, callback: (response: boolean) => void }) {
        const glitter = (window as any).glitter
        console.log(`setCart:${JSON.stringify(cartData)}`)
        glitter.runJsInterFace("setSpaceCartData", {
            data: JSON.stringify({cartData: cartData})
        }, (response2: any) => {
            glitter.setPro(Checkout.cartTag, JSON.stringify(cartData), (response: any) => {
                callback(true)
                glitter.share.cart = glitter.share.cart ?? {}
                glitter.share.cart.callback = glitter.share.cart.callback ?? []
                glitter.share.cart.callback.map((dd: any) => {
                    dd();
                });
            })
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                }
            }
        })

    }

    public static getCart(callback: (response: {
        [name: string]: {
            [skuID: string]: {
                sku: string,
                count: number,
                select: boolean
            }
        }
    }) => void) {
        const glitter = (window as any).glitter;
        glitter.runJsInterFace("getSpaceCartData", {}, (response2: any) => {
            glitter.getPro(Checkout.cartTag, (response: any) => {
                callback((() => {
                    try {
                        const data1 = JSON.parse(response2.data)
                        console.log(`getSpaceCartData:${JSON.stringify(data1)}`)
                        let data = JSON.parse(response.data)
                        console.log('parse' + JSON.stringify(data))
                        Object.keys(data1).map((dd) => {
                            data[dd] = data1[dd];
                        })
                        return data
                    } catch (e) {
                        return {}
                    }
                })())
            })
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                }
            }
        })
    }

    public static deleteCart(callback: () => void) {
        const glitter = (window as any).glitter;
        glitter.runJsInterFace("setSpaceCartData", {
            data: ''
        }, (response2: any) => {
            glitter.setPro(Checkout.cartTag, '', (response: any) => {
                callback()
            })
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                }
            }
        })

    }

    public static getCartSkuInfo({skuID, next}: { skuID: string[], next: (response: any) => void }) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/getCartSkuInfo`,
                    type: 'get',
                    headers: {Authorization: response.token},
                    data: {sku: skuID},
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {

                        next(response.data)
                    },
                    error: (err: any) => {
                        next(false)
                    },
                });
            }
        })

    }

    public static setCheckOut({
                                  data,
                                  callback
                              }: { data: { sku_id: string; amount: number }[], callback: (data: CheckOutData | boolean) => void }) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/setCart`,
                    type: 'post',
                    headers: {Authorization: response.token},
                    data: JSON.stringify({sku_ids: data}),
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        callback(response)
                    },
                    error: (err: any) => {
                        callback(false)
                    },
                });
            }
        })
    }

    public static setVoucher(obj: {
        code: string,
        callback: (result: boolean) => void
    }) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/voucher`,
                    type: 'post',
                    headers: {Authorization: response.token},
                    data: JSON.stringify({code: obj.code}),
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        obj.callback(response)
                    },
                    error: (err: any) => {
                        obj.callback(false)
                    },
                });
            }
        })

    }

    public static deleteVoucher(obj: {
        callback: (result: boolean) => void
    }) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/voucher`,
                    type: 'delete',
                    headers: {Authorization: response.token},
                    data: JSON.stringify({}),
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        obj.callback(response)
                    },
                    error: (err: any) => {
                        obj.callback(false)
                    },
                });
            }
        })
    }

    public static getVoucher(view: string, callback: (data: VoucherModel[] | boolean) => void) {
        const glitter = (window as any).glitter;
        glitter.addMtScript(
            [{src: 'https://momentjs.com/downloads/moment-with-locales.js'}],
            () => {

                const moment = (window as any).moment;
                console.log(new moment)
                const nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                moment.locale('zh-tw');
                const getEndtime = (t: string) => {
                    let end = '';
                    if (t === null) {
                        end = '無使用期限';
                    } else if (moment(t).isAfter(nowTime)) {
                        if (['小時', '分鐘', '秒'].find((x) => moment(nowTime).to(t).includes(x))) {
                            end = `<a style="color:red">即將失效 : ${moment(nowTime).to(t)}</a>`;
                        } else {
                            end = moment(moment(t, 'YYYY-MM-DD HH:mm:ss')).format('YYYY/MM/DD');
                        }
                    } else {
                        end = t;
                    }
                    return end;
                };

                const apiURL = (() => {
                    if (view === 'History') {
                        return `${appConfig().serverURL}/api/v1/cart/v2/voucherHistory`;
                    } else {
                        return `${appConfig().serverURL}/api/v1/cart/v2/voucher`;
                    }
                })();
                appConfig().getUserData({
                    callback: (response: any) => {
                        $.ajax({
                            url: apiURL,
                            type: 'get',
                            contentType: 'application/json; charset=utf-8',
                            headers: {Authorization: response.token},
                            success: (res: any) => {
                                callback(
                                    res.voucherList.map((dd: any) => {
                                        const c = dd.config.config;
                                        console.log(JSON.stringify(dd))
                                        return {
                                            id: dd.id,
                                            note: dd.config.note,
                                            vendor_name: dd.config.vendor ? dd.config.vendor.name : 'HOMEE',
                                            vendor_icon: dd.config.vendor ? dd.config.vendor.icon : 'img/coupon1.svg',
                                            startTime: dd.startTime,
                                            endTime: dd.endTime,
                                            formatEndTime: getEndtime(dd.endTime),
                                            config: dd.config.config,
                                            code: dd.config.code,
                                            name: dd.config.name,
                                            icon: 'img/coupon1.svg',
                                            title: (() => {
                                                let text = '';
                                                switch (c.howToPlay) {
                                                    case 'discount':
                                                        switch (c.discount_rebate_select) {
                                                            case 'basic_price':
                                                                text = `現折 ${c.discount_rebate_value} 元`;
                                                                break;
                                                            case 'percent':
                                                                text = `打 ${c.discount_rebate_value} 折`;
                                                                break;
                                                            case 'single_price':
                                                                text = `商品單價 ${c.discount_rebate_value} 元`;
                                                                break;
                                                            case 'unit_price':
                                                                text = `組合價 ${c.discount_rebate_value} 元`;
                                                                break;
                                                        }
                                                        break;
                                                    case 'rebate':
                                                        text = `回饋金 ${c.discount_rebate_value} 元`;
                                                        break;
                                                    case 'giveaway':
                                                        text = `贈送指定商品`;
                                                        break;
                                                }
                                                return text;
                                            })(),
                                            subTitle: (() => {
                                                if (c.howToPlay === 'rebate') {
                                                    return ``
                                                }
                                                let text = '';
                                                switch (dd.config.type) {
                                                    case 4:
                                                        text += '彩蛋優惠券';
                                                        break;
                                                    default:
                                                        switch (c.applicability_product) {
                                                            case 'all':
                                                                text += '全館商品';
                                                                break;
                                                            case 'categories':
                                                                text += '指定商品類別';
                                                                break;
                                                            case 'products':
                                                                text += '指定商品';
                                                                break;
                                                        }
                                                        switch (c.accord_rule) {
                                                            case 'least':
                                                                text += `消費滿 ${c.accord_number} `;
                                                                break;
                                                            case 'every':
                                                                text += `每消費 ${c.accord_number} `;
                                                                break;
                                                        }
                                                        switch (c.accord) {
                                                            case 'consum':
                                                                text += '元';
                                                                break;
                                                            case 'product':
                                                                text += '件';
                                                                break;
                                                        }
                                                        break;
                                                }
                                                return text;
                                            })(),
                                            isUse: view === 'History',
                                        };
                                    })
                                );
                            },
                            error: () => callback(false),
                        });
                    }
                })

            },
            () => {
            }
        );
    }

    public static getOrderList(obj: {
        callback: (result: any) => void
    }) {
        appConfig().getUserData({
            callback: (response: any) => {
                console.log(response.token)
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/order`,
                    type: 'get',
                    headers: {Authorization: response.token},
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        obj.callback(response)
                    },
                    error: (err: any) => {
                        console.log(err)
                        obj.callback(false)
                    },
                });
            }
        })
    }

    public static checkOut(obj: {
        data: {
            "cartInfo": {
                "sku": string,
                "quantity": number
            }[],
            "customerInfo"?: {
                "email": string
            },
            "mainURL"?: string,
            "voucherArray": string[]
        }
        callback: (response: boolean | {
            "result": boolean,
            "message": string,
            "create_time": string,
            "redirect": string
        }) => void
    }) {
        obj.data.mainURL = appConfig().serverURL

        appConfig().getUserData({
            callback: (response: any) => {
                obj.data.customerInfo = {
                    "email": response.email
                }

                $.ajax({
                    url: `${appConfig().serverURL}/api/bm/checkout`,
                    type: 'post',
                    headers: {Authorization: response.token},
                    data: JSON.stringify(obj.data),
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        console.log(response)

                    },
                    error: (err: any) => {
                        obj.callback(false)
                    },
                });
            }
        })
    }
}