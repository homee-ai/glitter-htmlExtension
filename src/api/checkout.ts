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
    public static getCartSkuInfo({skuID, next}: { skuID: string[], next: (response: any) => void }) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/cart/getCartSkuInfo`,
            type: 'get',
            headers: {Authorization: appConfig().token},
            data: {sku: skuID},
            contentType: 'application/json; charset=utf-8',
            success: (response: any) => {
                console.log(JSON.stringify(response))
                next(response.data)
            },
            error: (err: any) => {
                next(false)
            },
        });
    }

    public static setCheckOut({
                                  data,
                                  callback
                              }: { data: { sku_id: string; amount: number }[], callback: (data:CheckOutData|boolean) => void }) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/cart/v2/setCart`,
            type: 'post',
            headers: {Authorization: appConfig().token},
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
}