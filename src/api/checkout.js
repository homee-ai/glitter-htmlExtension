import { appConfig } from "../config.js";
export class Checkout {
    static getCartSkuInfo({ skuID, next }) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/cart/getCartSkuInfo`,
            type: 'get',
            headers: { Authorization: appConfig().token },
            data: { sku: skuID },
            contentType: 'application/json; charset=utf-8',
            success: (response) => {
                console.log(JSON.stringify(response));
                next(response.data);
            },
            error: (err) => {
                next(false);
            },
        });
    }
    static setCheckOut({ data, callback }) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/cart/v2/setCart`,
            type: 'post',
            headers: { Authorization: appConfig().token },
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
}
