const c = {
    "cartData": {
        "product": {
            "A010001-1-1-1": {
                "isSelect": true,
                "count": 1,
                "price": 6900,
                "sku": "A010001-1-1-1"
            },
            "A010085-1": {
                "isSelect": false,
                "count": 1,
                "price": 7900,
                "sku": "A010085-1"
            }
        },
        "2023-02-10 08:05": {
            "A010001-1-1-1": {
                "isSelect": true,
                "count": 3,
                "price": 6900,
                "sku": "A010001-1-1-1"
            }
        }
    }
}

const b = {
    "product_list": [
        {
            "variant_id": 18729343,
            "sku_id": "A010001-1-1-1",
            "name": "FORLI 岩板餐桌",
            "preview_image": "https://cdn.store-assets.com/s/349867/i/41080954.png",
            "price": 6900,
            "attribute_value": "A型腳座, 120*60 公分, 直邊圓角",
            "amount": 3
        }, {
            "variant_id": 40422548,
            "sku_id": "A010085-1",
            "name": "LUCERA 餐桌",
            "preview_image": "https://cdn.store-assets.com/s/349867/i/51459689.png",
            "price": 7900,
            "attribute_value": "120 公分",
            "amount": 0
        }
    ],
    "total_amount": 20700,
    "discount": 0,
    "voucherArray": [],
    "voucherCode": false,
    "voucherText": "",
    "easterEggCode": false
}
let cartItem: any[] = []
Object.keys(c.cartData).map((dd) => {
    const obj: any = (c as any).cartData[dd]
    return  {
        category: dd,
        category_id: dd,
        item:
            Object.keys(obj).map((d4) => {
                const oc = obj[d4]
                return {
                    item_id: d4,//variant
                    name: "loading...",
                    img: ``,
                    kind: "loading...",
                    qty: oc.count,
                    price: oc.price,
                    subtotal: oc.price,
                    select: oc.isSelect,
                }
            })
    }
})
console.log(JSON.stringify(cartItem))
