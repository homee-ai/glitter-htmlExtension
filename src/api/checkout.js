import { appConfig } from "../config.js";
export class Checkout {
    static addToCart(obj) {
        const glitter = window.glitter;
        Checkout.getCart((cartData) => {
            var _a, _b;
            cartData[obj.category] = (_a = cartData[obj.category]) !== null && _a !== void 0 ? _a : {};
            cartData[obj.category][obj.skuID] = (_b = cartData[obj.category][obj.skuID]) !== null && _b !== void 0 ? _b : {
                count: 0,
                sku: obj.skuID,
                isSelect: true
            };
            cartData[obj.category][obj.skuID].count += obj.amount;
            glitter.setPro(Checkout.cartTag, JSON.stringify(cartData), (response) => {
                var _a, _b;
                obj.callback(true);
                glitter.share.cart = (_a = glitter.share.cart) !== null && _a !== void 0 ? _a : {};
                glitter.share.cart.callback = (_b = glitter.share.cart.callback) !== null && _b !== void 0 ? _b : [];
                glitter.share.cart.callback.map((dd) => {
                    dd();
                });
            });
        });
    }
    static setCart({ cartData, callback }) {
        const glitter = window.glitter;
        console.log(`setCart:${JSON.stringify(cartData)}`);
        glitter.runJsInterFace("setSpaceCartData", {
            data: JSON.stringify({ cartData: cartData })
        }, (response2) => {
            glitter.setPro(Checkout.cartTag, JSON.stringify(cartData), (response) => {
                var _a, _b;
                callback(true);
                glitter.share.cart = (_a = glitter.share.cart) !== null && _a !== void 0 ? _a : {};
                glitter.share.cart.callback = (_b = glitter.share.cart.callback) !== null && _b !== void 0 ? _b : [];
                glitter.share.cart.callback.map((dd) => {
                    dd();
                });
            });
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                };
            }
        });
    }
    static getCart(callback) {
        const glitter = window.glitter;
        glitter.runJsInterFace("getSpaceCartData", {}, (response2) => {
            glitter.getPro(Checkout.cartTag, (response) => {
                callback((() => {
                    try {
                        const data1 = JSON.parse(response2.data);
                        console.log(`getSpaceCartData:${JSON.stringify(data1)}`);
                        let data = JSON.parse(response.data);
                        console.log('parse' + JSON.stringify(data));
                        Object.keys(data1).map((dd) => {
                            data[dd] = data1[dd];
                        });
                        return data;
                    }
                    catch (e) {
                        return {};
                    }
                })());
            });
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                };
            }
        });
    }
    static deleteCart(callback) {
        const glitter = window.glitter;
        glitter.runJsInterFace("setSpaceCartData", {
            data: ''
        }, (response2) => {
            glitter.setPro(Checkout.cartTag, '', (response) => {
                callback();
            });
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                };
            }
        });
    }
    static getCartSkuInfo({ skuID, next }) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/getCartSkuInfo`,
                    type: 'get',
                    headers: { Authorization: response.token },
                    data: { sku: skuID },
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        next(response.data);
                    },
                    error: (err) => {
                        next(false);
                    },
                });
            }
        });
    }
    static setCheckOut({ data, callback }) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/setCart`,
                    type: 'post',
                    headers: { Authorization: response.token },
                    data: JSON.stringify({ sku_ids: data }),
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        callback(response);
                    },
                    error: (err) => {
                        callback(false);
                    },
                });
            }
        });
    }
    static setVoucher(obj) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/voucher`,
                    type: 'post',
                    headers: { Authorization: response.token },
                    data: JSON.stringify({ code: obj.code }),
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        obj.callback(response);
                    },
                    error: (err) => {
                        obj.callback(false);
                    },
                });
            }
        });
    }
    static deleteVoucher(obj) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/voucher`,
                    type: 'delete',
                    headers: { Authorization: response.token },
                    data: JSON.stringify({}),
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        obj.callback(response);
                    },
                    error: (err) => {
                        obj.callback(false);
                    },
                });
            }
        });
    }
    static getVoucher(view, callback) {
        const glitter = window.glitter;
        glitter.addMtScript([{ src: 'https://momentjs.com/downloads/moment-with-locales.js' }], () => {
            const moment = window.moment;
            console.log(new moment);
            const nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            moment.locale('zh-tw');
            const getEndtime = (t) => {
                let end = '';
                if (t === null) {
                    end = '???????????????';
                }
                else if (moment(t).isAfter(nowTime)) {
                    if (['??????', '??????', '???'].find((x) => moment(nowTime).to(t).includes(x))) {
                        end = `<a style="color:red">???????????? : ${moment(nowTime).to(t)}</a>`;
                    }
                    else {
                        end = moment(moment(t, 'YYYY-MM-DD HH:mm:ss')).format('YYYY/MM/DD');
                    }
                }
                else {
                    end = t;
                }
                return end;
            };
            const apiURL = (() => {
                if (view === 'History') {
                    return `${appConfig().serverURL}/api/v1/cart/v2/voucherHistory`;
                }
                else {
                    return `${appConfig().serverURL}/api/v1/cart/v2/voucher`;
                }
            })();
            appConfig().getUserData({
                callback: (response) => {
                    $.ajax({
                        url: apiURL,
                        type: 'get',
                        contentType: 'application/json; charset=utf-8',
                        headers: { Authorization: response.token },
                        success: (res) => {
                            callback(res.voucherList.map((dd) => {
                                const c = dd.config.config;
                                console.log(JSON.stringify(dd));
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
                                                        text = `?????? ${c.discount_rebate_value} ???`;
                                                        break;
                                                    case 'percent':
                                                        text = `??? ${c.discount_rebate_value} ???`;
                                                        break;
                                                    case 'single_price':
                                                        text = `???????????? ${c.discount_rebate_value} ???`;
                                                        break;
                                                    case 'unit_price':
                                                        text = `????????? ${c.discount_rebate_value} ???`;
                                                        break;
                                                }
                                                break;
                                            case 'rebate':
                                                text = `????????? ${c.discount_rebate_value} ???`;
                                                break;
                                            case 'giveaway':
                                                text = `??????????????????`;
                                                break;
                                        }
                                        return text;
                                    })(),
                                    subTitle: (() => {
                                        if (c.howToPlay === 'rebate') {
                                            return ``;
                                        }
                                        let text = '';
                                        switch (dd.config.type) {
                                            case 4:
                                                text += '???????????????';
                                                break;
                                            default:
                                                switch (c.applicability_product) {
                                                    case 'all':
                                                        text += '????????????';
                                                        break;
                                                    case 'categories':
                                                        text += '??????????????????';
                                                        break;
                                                    case 'products':
                                                        text += '????????????';
                                                        break;
                                                }
                                                switch (c.accord_rule) {
                                                    case 'least':
                                                        text += `????????? ${c.accord_number} `;
                                                        break;
                                                    case 'every':
                                                        text += `????????? ${c.accord_number} `;
                                                        break;
                                                }
                                                switch (c.accord) {
                                                    case 'consum':
                                                        text += '???';
                                                        break;
                                                    case 'product':
                                                        text += '???';
                                                        break;
                                                }
                                                break;
                                        }
                                        return text;
                                    })(),
                                    isUse: view === 'History',
                                };
                            }));
                        },
                        error: () => callback(false),
                    });
                }
            });
        }, () => {
        });
    }
    static getOrderList(obj) {
        appConfig().getUserData({
            callback: (response) => {
                console.log(response.token);
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/order`,
                    type: 'get',
                    headers: { Authorization: response.token },
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        obj.callback(response);
                    },
                    error: (err) => {
                        console.log(err);
                        obj.callback(false);
                    },
                });
            }
        });
    }
    static checkOut(obj) {
        obj.data.mainURL = appConfig().serverURL;
        appConfig().getUserData({
            callback: (response) => {
                obj.data.customerInfo = {
                    "email": response.email
                };
                $.ajax({
                    url: `${appConfig().serverURL}/api/bm/checkout`,
                    type: 'post',
                    headers: { Authorization: response.token },
                    data: JSON.stringify(obj.data),
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        console.log(response);
                        obj.callback(response);
                    },
                    error: (err) => {
                        obj.callback(false);
                    },
                });
            }
        });
    }
}
Checkout.cartTag = "njasndjnui32hi2";
