'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {appConfig} from "../config.js";
import {Dialog} from "../dialog/dialog-mobile.js";
import {Myspace, Space} from "../api/myspace.js";
import {Api} from "../homee/api/homee-api.js";
import {SharedView} from "../homee/shareView.js";
import {Checkout} from "../api/checkout.js";

Plugin.create(import.meta.url, (glitter) => {
    return {
        allPage: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {

                return {
                    view: () => {
                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            let vm: {
                                loading: boolean,
                                height: string,
                                data: Space[],
                                showMore: boolean
                            } = {
                                loading: true,
                                height: `100vh`,
                                data: [],
                                showMore: true
                            }

                            function getData() {
                                vm.data =[]
                                vm.loading=true
                                gvc.notifyDataChange(id)
                                Myspace.getModelList((data) => {
                                    vm.loading=false
                                    if (data) {
                                        vm.data = data as Space[]
                                        vm.data = vm.data.sort(function (a, b) {
                                            return b.time - a.time;
                                        });
                                        vm.showMore = vm.data.length >= 4
                                        vm.data = vm.data.filter((dd, index) => {
                                            return index < 4
                                        })
                                        spaceData = vm.data.map((dd) => {
                                            return {title: dd.key, date: dd.store_time, img: dd.space_image, config: dd}
                                        })
                                    }
                                    gvc.notifyDataChange(id)
                                })
                            }

                            getData()

                            async function getPageHeight() {
                                let top = await new Promise((resolve, reject) => {
                                    appConfig().getTopInset((number) => {
                                        resolve(number)
                                    })
                                }) as number
                                let bottom = await new Promise((resolve, reject) => {
                                    appConfig().getBottomInset((number) => {
                                        resolve(number)
                                    })
                                }) as number
                                console.log(JSON.stringify({top: top, bottom: bottom}))
                                vm.height = `calc(100vh - ${63 + top + 63}px)`
                                gvc.notifyDataChange(id)
                            }

                            getPageHeight()
                            let spaceData: { title: string, date: string, img: string, config: Space }[] = []
                            let clickEvent = glitter.ut.clock()
                            return {
                                bind: id,
                                view: () => {
                                    if(vm.loading){
                                        return  `<div class="w-100">
            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                <div class="spinner-border" role="status"></div>
            </div>
        </div>`
                                    }
                                    return `
<div class="w-100 position-fixed  d-flex align-items-center justify-content-center flex-column"
style="background: #F8F3ED;height: ${vm.height};">
<div class="d-flex flex-column align-items-center" style="width: calc(100% - 48px);transform: translateY(-40px);">

${spaceData.length === 0 ? `
<img src="${new URL('../img/noSpace.png', import.meta.url).href}" class="" style="width: calc(100% - 114px);">
` : `
<div class="w-100" style="height: 1px;background: #EAD8C2;width: calc(100% - 94px);margin-bottom: 24px;"></div>
${spaceData.map((dd) => {
                                        return `
<div class="w-100 bg-white d-flex align-items-center position-relative" style="height: 100px;border-radius: 20px;"
onclick="${gvc.event((e, event) => {
                                            if (clickEvent.stop() > 50) {
                                                (dd.config as any).json = JSON.stringify(dd.config)
                                                    .replace(/server_rout/g, 'serverRout')
                                                    .replace(/store_time/g, 'storeTime')
                                                    .replace(/space_image/g, 'spaceImage')
                                                    .replace(/preview_image/g, 'previewImage')
                                                    .replace(/model_url/g, 'modelUrl')
                                                glitter.runJsInterFace("openMySpaceMd", dd.config, () => {
                                                    getData()
                                                })
                                            }
                                        })}">
<div class="h-100 bg-white" style="width: 160px;background: url('${dd.img}')  50% / cover; border-top-left-radius: 20px;border-bottom-left-radius: 20px;"></div>
<div class="d-flex flex-column align-items-baseline" style="margin-left: 24px;margin-right: 14px;">
<h3 style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 23px;
font-feature-settings: 'pnum' on, 'lnum' on;
color: #1E1E1E;">${dd.title}</h3>
<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 17px;
text-align: center;
color: #858585;">????????????:${dd.date.substring(0, 16)}</span>
</div>
<img class="position-absolute top-0 right-0" src="${new URL('../img/more.svg', import.meta.url)}" style="width: 32px;height: 32px;right: 6px;" onclick="${
                                            gvc.event((e, event) => {
                                                if (clickEvent.stop() > 50) {
                                                    clickEvent.zeroing()
                                                    glitter.runJsInterFace("showSpaceAction", {
                                                        json:JSON.stringify(dd.config) .replace(/server_rout/g, 'serverRout')
                                                            .replace(/store_time/g, 'storeTime')
                                                            .replace(/space_image/g, 'spaceImage')
                                                            .replace(/preview_image/g, 'previewImage')
                                                            .replace(/model_url/g, 'modelUrl')
                                                    }, () => {
                                                        getData()
                                                    })
                                                }
                                            })
                                        }">
</div>`
                                    }).join('<div style="height: 16px;"></div>')}
<div class="w-100" style="height: 1px;background: #EAD8C2;width: calc(100% - 94px);margin-top: 14px;"></div>
`}

${(() => {
                                        if (vm.showMore) {
                                            return `<div style="font-family: 'Noto Sans TC';
font-style: normal;font-weight: 400;font-size: 15px;margin-top: 14px;line-height: 150%;color: #1E1E1E;
" onclick="${gvc.event(()=>{
    appConfig().changePage(gvc,'more_space',{})
                                            })}">????????????</div>`
                                        } else {
                                            return ``
                                        }
                                    })()}
</div>
<div id="" class="position-absolute d-flex  flex-column align-items-center justify-content-center p-0" style="
padding: 0;margin: 0 59px;bottom:25px;width:calc(100vw - 108px);height:48px;
background: #FE5541;border-radius: 24px; " onclick="${
                                        gvc.event((e) => {
                                            const dialog = new Dialog()
                                            dialog.dataLoading(true)
                                            glitter.runJsInterFace("startScan", {}, () => {
                                                getData()
                                                },
                                                {
                                                    webFunction: () => {
                                                        dialog.showInfo("?????????APP??????")
                                                    }
                                                })
                                        })
                                    }">
<h3 style="
font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 18px;
text-align: center;
letter-spacing: 0.15em;
color: #FFFFFF;" class="m-0" >????????????</h3>
                                    </div>
</div>`
                                },
                                divCreate: {}
                            }
                        })
                    },
                    editor: () => {
                        return ``
                    }
                }
            }
        },
        allSpace: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        const product=(gvc.parameter.pageConfig?.obj.data ?? {}).product

                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            let vm: {
                                loading: boolean,
                                height: string,
                                data: Space[],
                                showMore: boolean
                            } = {
                                loading: true,
                                height: `100vh`,
                                data: [],
                                showMore: true
                            }

                            function getData() {
                                vm.data =[]
                                vm.loading=true
                                gvc.notifyDataChange(id)
                                Myspace.getModelList((data) => {
                                    vm.loading=false
                                    if (data) {
                                        vm.data = data as Space[]
                                        vm.data = vm.data.sort(function (a, b) {
                                            return b.time - a.time;
                                        });
                                        spaceData = vm.data.map((dd) => {
                                            return {title: dd.key, date: dd.store_time, img: dd.space_image, config: dd}
                                        })
                                    }
                                    gvc.notifyDataChange(id)
                                })
                            }
                            getData()
                            async function getPageHeight() {
                                let top = await new Promise((resolve, reject) => {
                                    appConfig().getTopInset((number) => {
                                        resolve(number)
                                    })
                                }) as number
                                let bottom = await new Promise((resolve, reject) => {
                                    appConfig().getBottomInset((number) => {
                                        resolve(number)
                                    })
                                }) as number
                                console.log(JSON.stringify({top: top, bottom: bottom}))
                                vm.height = `calc(100vh - ${63 + top + 73}px)`
                                gvc.notifyDataChange(id)
                            }
                            getPageHeight()
                            let spaceData: { title: string, date: string, img: string, config: Space }[] = []
                            let clickEvent = glitter.ut.clock()
                            return {
                                bind: id,
                                view: () => {
                                    if(vm.loading){
                                        return  `<div class="w-100">
            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                <div class="spinner-border" role="status"></div>
            </div>
        </div>`
                                    }
                                    return `
<div class="d-flex flex-column align-items-center mx-auto pt-2" style="padding-left:24px;padding-right: 24px;min-height: 100vh;
background: #F8F3ED;padding-bottom: 24px;">
${spaceData.length === 0 ? `
<img src="${new URL('../img/noSpace.png', import.meta.url).href}" class="" style="width: calc(100% - 114px);">
` : `
${spaceData.map((dd) => {
                                        return `<div class="w-100 bg-white d-flex align-items-center position-relative" style="height: 100px;border-radius: 20px;"
onclick="${gvc.event((e, event) => {
                                            if (clickEvent.stop() > 50) {
                                                (dd.config as any).json = JSON.stringify(dd.config)
                                                    .replace(/server_rout/g, 'serverRout')
                                                    .replace(/store_time/g, 'storeTime')
                                                    .replace(/space_image/g, 'spaceImage')
                                                    .replace(/preview_image/g, 'previewImage')
                                                    .replace(/model_url/g, 'modelUrl')
                                                if(product){
                                                    (dd.config as any)['addPD']=product
                                                    console.log(JSON.stringify(product))
                                                    // return
                                                    glitter.runJsInterFace("selectSpaceToAdd",dd.config,()=>{})
                                                }else{
                                                    glitter.runJsInterFace("openMySpaceMd", dd.config, () => {
                                                        getData()
                                                    })
                                                }
                                                
                                            }
                                        })}">
<div class="h-100 bg-white" style="width: 160px;background: url('${dd.img}')  50% / cover;border-top-left-radius: 20px;border-bottom-left-radius: 20px;"></div>
<div class="d-flex flex-column align-items-baseline" style="margin-left: 24px;margin-right: 14px;">
<h3 style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 23px;
font-feature-settings: 'pnum' on, 'lnum' on;
color: #1E1E1E;">${dd.title}</h3>
<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 17px;
text-align: center;
color: #858585;">????????????:${dd.date.substring(0, 16)}</span>
</div>
<img class="position-absolute top-0 right-0" src="${new URL('../img/more.svg', import.meta.url)}" style="width: 32px;height: 32px;right: 6px;" onclick="${
                                            gvc.event((e, event) => {
                                                if (clickEvent.stop() > 50) {
                                                    clickEvent.zeroing()
                                                    glitter.runJsInterFace("showSpaceAction", {
                                                        json:JSON.stringify(dd.config) .replace(/server_rout/g, 'serverRout')
                                                            .replace(/store_time/g, 'storeTime')
                                                            .replace(/space_image/g, 'spaceImage')
                                                            .replace(/preview_image/g, 'previewImage')
                                                            .replace(/model_url/g, 'modelUrl')
                                                    }, () => {
                                                        getData()
                                                    })
                                                }
                                            })
                                        }">
</div>`
                                    }).join('<div style="height: 16px;"></div>')}
`}
</div>
`
                                },
                                divCreate: {}
                            }
                        })
                    },
                    editor: () => {
                        return ``
                    }
                }
            }
        },
        footer: {
            defaultData: {
                dataList: [
                    {
                        title: "??????",
                        icon: new URL('../img/component/footer/home.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "??????",
                        icon: new URL('../img/component/footer/idea.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "????????????",
                        icon: new URL('../img/component/footer/myspace.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "?????????",
                        icon: new URL('../img/component/footer/shoopingCart.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "??????",
                        icon: new URL('../img/component/footer/user.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                ],
            },
            render: (gvc, widget, setting, hoverID) => {
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
                    `);
                return {
                    view: () => {
                        return `
                        <footer class="d-flex align-items-center justify-content-around w-100" style="padding-bottom: ${widget.data.bottomInset}px;position: fixed;top: 0px;left: 0px;">
                            ${(() => {
                            return gvc.map(widget.data.dataList.map((data: any, index: number) => {
                                return `
                                <div class="d-flex flex-column align-items-center" onclick="${gvc.event((e) => {
                                    glitter.runJsInterFace("setSpaceHome",{
                                        page:data.selectPage.tag
                                    },()=>{
                                        
                                    })
                                })}">
                                    <img src=${data.icon} style="width: 28px;height: 28px;">
                                    <div class="footerTitle" style="color:${data.color ?? `black`};">${data.title}</div>
                                </div>
                                `;
                            }));
                        })()}
                        </footer>
                    `;
                    },
                    editor: () => {
                        return `
`+gvc.map(widget.data.dataList.map((dd: any, index: number) => {
                            return `<div class="alert alert-dark mt-2">
<h3 style="color: white;font-size: 17px;color: orangered;">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                widget.data.dataList.splice(index, 1)
                                widget.refreshComponent()
                            })}"></i>
??????.${index + 1}</h3>
${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `??????`,
                                default: dd.title,
                                placeHolder: dd.title,
                                callback: (text) => {
                                    widget.data.dataList[index].title = text;
                                    widget.refreshAll();
                                }
                            }) +
                            `
 ${glitter.htmlGenerate.editeInput({
                                gvc,
                                title: "????????????",
                                default: dd.color ?? "black",
                                placeHolder: "?????????????????????",
                                callback: (text) => {
                                    dd.color = text
                                    widget.refreshComponent()
                                }
                            })}
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">??????</h3>
                                <div class="mt-2"></div>
                                <div class="d-flex align-items-center mb-3">
                                    <input class="flex-fill form-control " placeholder="?????????????????????" value="${widget.data.dataList[index].icon}">
                                    <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                    <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        appConfig().uploadImage(data[0].file, (link: string) => {
                                            widget.data.dataList[index].icon = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                                </div>
                            `
                            + ClickEvent.editer(gvc, widget, dd,{
                                option:['mySpaceSetHome'],hover:false
                            })
                            }
</div>`;
                        })) + `<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                            gvc.event(() => {
                                widget.data.dataList.push({
                                    title: "??????",
                                    icon: new URL('../img/component/footer/home.svg', import.meta.url).href
                                })
                                widget.refreshComponent()
                            })
                        }">????????????</div>`;
                    }
                };
            }
        },
        productDetail: {
            defaultData: {
                "orgSelectSku":"",
                "qty": 1,
                "intro": [{
                    "text": "<p>OLVAN ????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN ?????????????????????????????????????????????????????????????????????????????????HOMEE???????????????????????????????????????????????????????????????????????????????????</p>\n<p>??</p>\n<p>??</p>\n<h4>????????????</h4>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>??????</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>????????????26 ??????????????????24 ??????</p>\n</td>\n</tr>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>???</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>32 ??????</p>\n</td>\n</tr>\n</tbody>\n</table>\n<br>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p data-mce-style=\"text-align: left;\"><strong>????????????</strong></p>\n</td>\n<td data-mce-style=\"width: 70%;\">\n<p>????????????????????????????????? / PVC</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p>??</p>\n<p>??</p>\n<h4>????????????</h4>\n<p>??? ?????????????????????<a href=\"https://homee.cc/legal/refund-policy\" target=\"_blank\">???????????????</a>????????????????????????????????????????????????????????????????????????</p>\n<p>??? ???????????????????????????????????????????????????????????? (???????????????????????????) ?????????100%????????????????????????????????????????????????</p>\n<p>??? ?????????????????????????????????????????????????????????????????????????????????????????????0.5 - 2 ?????? ????????????</p>\n<p>??? ??????????????????????????????????????????????????????????????????HOMEE ???????????????????????????????????????????????????????????????</p>\n<p>??? ???????????????HOMEE ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 1 ?????????????????????????????? 2~4??????????</p>",
                    "title": "????????????"
                }],
                "price": "9960",
                "marginL": "10px",
                "marginR": "10px",
                "sale_price": "13500",
                "preview_image": "",
                "attribute_list": [{
                    "attribute_key": "????????????",
                    "display_order": 1,
                    "attribute_values": [{"value": "?????????", "display_order": 1, "selected": true}, {
                        "value": "?????????",
                        "display_order": 2
                    }]
                }],
                "name": "OLVAN ??????",
                "productData": {
                    "attribute_list": [{
                        "attribute_key": "????????????",
                        "display_order": 1,
                        "attribute_values": [{
                            "value": "?????????",
                            "display_order": 1,
                            "selected": true
                        }, {"value": "?????????", "display_order": 2}]
                    }],
                    "product_detail": {
                        "id": 8129130922284,
                        "name": "OLVAN ??????",
                        "handle": "olvan-??????",
                        "images": ["https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44609065.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471483.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471451.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471499.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471468.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471467.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471477.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44609066.jpg?v=1675167898&width=720"],
                        "created_time": 1675166918000,
                        "updated_time": 1675175826000,
                        "bodyHtml": "<p>OLVAN ????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN ?????????????????????????????????????????????????????????????????????????????????HOMEE???????????????????????????????????????????????????????????????????????????????????</p>\n<p>??</p>\n<p>??</p>\n<h4>????????????</h4>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>??????</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>????????????26 ??????????????????24 ??????</p>\n</td>\n</tr>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>???</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>32 ??????</p>\n</td>\n</tr>\n</tbody>\n</table>\n<br>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p data-mce-style=\"text-align: left;\"><strong>????????????</strong></p>\n</td>\n<td data-mce-style=\"width: 70%;\">\n<p>????????????????????????????????? / PVC</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p>??</p>\n<p>??</p>\n<h4>????????????</h4>\n<p>??? ?????????????????????<a href=\"https://homee.cc/legal/refund-policy\" target=\"_blank\">???????????????</a>????????????????????????????????????????????????????????????????????????</p>\n<p>??? ???????????????????????????????????????????????????????????? (???????????????????????????) ?????????100%????????????????????????????????????????????????</p>\n<p>??? ?????????????????????????????????????????????????????????????????????????????????????????????0.5 - 2 ?????? ????????????</p>\n<p>??? ??????????????????????????????????????????????????????????????????HOMEE ???????????????????????????????????????????????????????????????</p>\n<p>??? ???????????????HOMEE ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 1 ?????????????????????????????? 2~4??????????</p>"
                    },
                    "sku_list": {
                        "?????????": {
                            "sku_id": "G010025-1",
                            "attribute_key": "?????????",
                            "attribute_value": "?????????",
                            "attribute_list": ["?????????", null, null],
                            "isEnabled": true,
                            "sale_price": 519,
                            "price": 519,
                            "image_index": 0
                        },
                        "?????????": {
                            "sku_id": "G010025-2",
                            "attribute_key": "?????????",
                            "attribute_value": "?????????",
                            "attribute_list": ["?????????", null, null],
                            "isEnabled": true,
                            "sale_price": 519,
                            "price": 519,
                            "image_index": 7
                        }
                    }
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                let bottomInset = 0;
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
                        height:2px;
                        background:#1E1E1E;
                    }
                    .productQTYRow .qtyNumber{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 24px;
                        margin:0 16px;
                        color: #292929;
                    }
                    .kindUnselected{                                        
                        border: 1px solid #D6D6D6;
                        border-radius: 5px;
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 500;
                        font-size: 14px;
                        color: #292929;
                        margin-right : 8px;
                        padding: 4px 12px 3px;
                    }
                    .kindSelected{                                        
                        background: rgba(41, 41, 41, 0.1);                                                                                
                        border: 1px solid #292929;
                        border-radius: 5px;
        
                    }
                    .kindArray{
                        margin-top : 8px;
                        margin-bottom: 20px;
                    }
                    .sizeSelectTitle{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 400;
                        font-size: 15px;
                        color: #292929;
                    }
                `)
                function addThousandSeparator(numStr: string): string {
                    const num = Number(numStr);
                    return num.toLocaleString();
                }
                function goToSlide(index: number): void {
                    const Swiper = (window as any).Swiper
                    let mySwiper = new Swiper('.swiper', {
                        // ????????????
                    });

                    mySwiper.slideTo(index+1);

                    // ???????????? active ?????????
                    const oldActiveEl = document.querySelector('.swiper-pagination .swiper-pagination-bullet-active');
                    if (oldActiveEl) {
                        oldActiveEl.classList.remove('swiper-pagination-bullet-active');
                    }

                    // ???????????? index ?????? active ?????????
                    const newActiveEl = document.querySelectorAll('.swiper-pagination .swiper-pagination-bullet')[index];
                    if (newActiveEl) {
                        newActiveEl.classList.add('swiper-pagination-bullet-active');
                    }
                }

                return {
                    view: () => {

                        let posterID = gvc.parameter.pageConfig?.obj.data?.poster_id || undefined;
                        if(widget.data.loading){
                            return  `
                            
                            <div class="w-100">
                                <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                                    <div class="spinner-border" role="status"></div>
                                </div>
                            </div>`
                        }
                        let sku_list = (widget.data.productData && widget.data.productData.sku_list) ?? {}
                        let key: string[] = [];
                        let btnChange = false;
                        widget.data.attribute_list?.map((dd: any) => {
                            const select = dd.attribute_values.find((d2: any) => {
                                return d2.selected
                            })
                            select && key.push(select.value)
                        })
                        const selectSku = sku_list[key.join(' / ')]

                        console.log("??????")
                        console.log(widget.data.orgSelectSku)
                        if (!widget.data.orgSelectSku){
                            console.log("test")
                            widget.data.orgSelectSku = selectSku;
                        }
                        setTimeout(()=>{
                            goToSlide(selectSku.image_index);
                        },250)
                        return `       
                           ${gvc.bindView({
                            bind: 'productTitle',
                            view: () => {
                                return `  <div class="productTitle" style="white-space:normal;word-wrap:break-word;word-break:break-all;">${widget.data.name}</div>
                            <div class="d-flex productPriceRow" style="">
                                <div class="sale_price">NT$ ${addThousandSeparator(selectSku.sale_price)}</div>
                                <div class="price ${selectSku && (selectSku.sale_price === selectSku.price) ? 'd-none' : ''}">NT$ ${addThousandSeparator(selectSku.price)}</div>
                            </div>`
                            },
                            divCreate: {class: `productTitleRow d-flex flex-column` , style:`padding:0 24px`}
                        })}   
                        
                        <div class="productQTYRow d-flex align-items-center justify-content-between " style="padding:0 24px; margin-top: 34px;margin-bottom: 26px;">
                            <div class="qtyBar" style="width: 40px;"></div>                            
                        </div>
                        
                        ${gvc.bindView({
                            bind: "sizeSelect",
                            view: () => {
                                function productKindDom(index: number, sizeType: any) {
                                    return `
                                        ${gvc.bindView({
                                        bind: `type${index}`,
                                        view: () => {
                                            
                                            return `
                                                <div class="sizeSelectTitle">
                                                    ${sizeType.attribute_key}
                                                </div>

                                                <div class="d-flex flex-wrap" style="overflow: scroll;padding: 8px;">
                                                    ${gvc.map(sizeType.attribute_values.map((data: any, index: number) => {
                                                
                                                let className = "kindUnselected"
                                                if (data.selected) {
                                                    className += " kindSelected"
                                                }
                                                return `
                                                    <div class="${className}" style="margin-top: 8px;" onclick="${gvc.event(() => {
                                                        sizeType.attribute_values.map((dd: any) => {
                                                            dd.selected = false
                                                        })
                                                        data.selected = true
                                                        
                                                        
                                                        
                                                        widget.refreshComponent()
                                                    })}">${data.value}
                                                    </div>
                                                        `
                                            }))}
                                                </div>      
                                                `
                                        }, divCreate: {class: ``, style: `margin-bottom:8px;`},
                                    })}
                                        
                                    `
                                }
                                //todo ????????????????????????????????????????????????
                                return gvc.map(widget.data.attribute_list.map((sizeType: any, index: number) => {
                                    if (sizeType.attribute_key != "Title"){
                                        return productKindDom(index, sizeType);
                                    }else
                                        return ``

                                }))

                            }, divCreate: {class: ``, style: "padding:0 24px 32px;"},

                        })}
                        ${gvc.bindView({
                            bind:"BTN",
                            view:()=>{
                                if (widget.data.orgSelectSku!= selectSku){
                                    return `
                                    <div class="w-100 d-flex  flex-fill " style="padding: 0 59px;height: 48px;">
                                        <div class="d-flex align-items-center justify-content-center flex-fill" style="background: #FE5541;border-radius: 24px;font-weight: 700;font-size: 18px;line-height: 26px;text-align: center;letter-spacing: 0.15em;color: #FFFFFF;" onclick="${gvc.event(()=>{
                                        glitter.runJsInterFace("addToSpace",selectSku,()=>{

                                        })
                                    })}">????????????</div>                                        
                                    </div>
                                `
                                }else {
                                    return `
                                    <div class="w-100 d-flex  flex-fill " style="padding: 0 59px;height: 48px;">
                                        <div class="d-flex align-items-center justify-content-center flex-fill" style="background: #E0E0E0;border-radius: 24px;font-weight: 700;font-size: 18px;line-height: 26px;text-align: center;letter-spacing: 0.15em;color: #858585;" onclick="${gvc.event(()=>{
                                        glitter.runJsInterFace("addToSpace",selectSku,()=>{

                                        })
                                    })}">??????????????????</div>                                        
                                    </div>
                                `
                                }
                            },
                            divCreate:{}
                            
                        })}
            
                        ${gvc.bindView({
                            bind: `intro`,
                            view: () => {
                                gvc.addStyle(`
                                    .intro{
                                        padding-bottom : 90px;
                                    }
                                    .intro img{
                                      max-width:100%;
                                    }
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
                                    
                                `)
                                return `
                                    ${gvc.map(widget.data.intro.map((intro: any) => {
                                    return `
                                            <div class="">
                                                <div class="introTitle">${intro.title}</div>
                                                <div class="introText">${intro.text}</div>
                                            </div>
                                        `
                                }))}
                                `
                            }, divCreate: {class: `productIntroText`, style: `padding:40px 24px 100px;`},
                            onCreate : ()=>{
                                let intro = document.querySelector('.productIntroText');
                                let links  = intro!.querySelectorAll('a');
                                links.forEach(link => {
                                    link.addEventListener('click', (event) => {
                                        event.preventDefault();
                                        gvc.glitter.runJsInterFace("openWeb", {
                                            url: link.href
                                        }, (data) => {
                                        }, {
                                            webFunction(data: any, callback: (data: any) => void): any {
                                                gvc.glitter.openNewTab(link.href)
                                                // gvc.glitter.location.href=object.link
                                            }
                                        })
                                        console.log()
                                    });
                                });
                            }
                        })}
                        
                      
                    `
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        empty: {
            defaultData:{

            },
            render:(gvc, widget, setting, hoverID) => {


                return {
                    view: ()=>{return ``},
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },

    }
})
ClickEvent.create(import.meta.url,{
    mySpaceSetHome: {
        title: "????????????",
        fun: (gvc, widget, object: { selectPage: { tag?: string, name?: string } }) => {
            return {
                editor: () => {
                    const vm: {
                        loading: boolean,
                        data: { name: string, tag: string }[]
                    } = {
                        loading: true,
                        data: []
                    }
                    const id = gvc.glitter.getUUID()
                    const api = new Api()
                    object.selectPage = object.selectPage ?? {}
                    api.homeeAJAX({
                        api: Api.serverURL,
                        route: '/api/v1/lowCode/pageConfig?query=tag,`group`,name',
                        method: 'get'
                    }, (res) => {
                        vm.data = res.result
                        vm.loading = false
                        gvc.notifyDataChange(id)
                    })
                    return `
<h3 class="m-0 mb-2 mt-2" style="font-size: 16px;">????????????</h3>
${
                        gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    if (vm.loading) {
                                        return `<option value='${JSON.stringify(object.selectPage)}'>${object.selectPage.name ?? "????????????"}</option>`
                                    }
                                    let haveData = false
                                    return gvc.map(vm.data.map((dd) => {
                                        haveData = haveData || object.selectPage.tag === dd.tag
                                        return `<option value='${JSON.stringify(dd)}' ${(object.selectPage.tag === dd.tag) ? `selected` : ``}>${dd.name}</option>`
                                    })) + ((haveData) ? `` : `<option selected>????????????</option>`)
                                },
                                divCreate: {
                                    class: `form-control`, elem: `select`, option: [
                                        {
                                            key: 'onChange',
                                            value: gvc.event((e, event) => {
                                                object.selectPage = JSON.parse(e.value)
                                                widget.refreshAll()
                                            })
                                        }
                                    ]
                                }
                            }
                        })
                    }
`
                },
                event: () => {
                    appConfig().setHome(gvc, object.selectPage.tag!)
                }
            }
        }
    },
    }
)
