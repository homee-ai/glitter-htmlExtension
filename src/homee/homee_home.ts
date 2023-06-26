'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {SharedView} from './shareView.js'
import {EditerApi} from "./api/editer-api.js";
import {ClickEvent} from "../glitterBundle/plugins/click-event.js"
import {LegacyPage} from "./legacy/interface.js"
import {Api} from "./api/homee-api.js";
import {DialogHelper} from "../dialog/dialog-helper.js";
import {GVC} from "../glitterBundle/GVController";
import {appConfig} from "../config.js";


Plugin.create(import.meta.url, (glitter) => {
    const rootURL = new URL("../", import.meta.url).href
    const api = {
        upload: (photoFile: any, callback: (link: string) => void) => {
            glitter.share.dialog.dataLoading({text: '上傳中', visible: true})
            $.ajax({
                url: Api.serverURL + '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({file_name: `${new Date().getTime()}`}),
                contentType: 'application/json; charset=utf-8',
                headers: {Authorization: glitter.getCookieByName('token')},
                success: (data1: { url: string; fullUrl: string }) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2: any) => {
                            glitter.share.dialog.dataLoading({visible: false})
                            glitter.share.dialog.successMessage({text: "上傳成功"})
                            callback(data1.fullUrl)
                        },
                        error: (err: any) => {
                            glitter.share.dialog.successMessage({text: "上傳失敗"})
                        },
                    });
                },
                error: (err: any) => {
                    glitter.share.dialog.successMessage({text: "上傳失敗"})
                },
            });
        }
    }
    return {
        banner: {
            defaultData: {
                link: []
            },
            render: (gvc, widget, setting, hoverID) => {
                // glitter.share.clickEvent
                const data: { link: { img: string, code?: string, clickEvent?: any }[] } = widget.data

                function slideControl(pageImgArray: any, pagination: boolean, navigation: boolean, scrollbar: boolean) {
                    const glitter = gvc.glitter
                    gvc.addStyle(`
            .swiper-slide{
                width: 100%;
                background-repeat: no-repeat;
            }
             .swiper-pagination-bullet {
                            ${(()=>{
                        if (widget.data.slideColor){
                            return `background: ${widget.data.slideColor};`;
                        }else return ``
                    })()}
                            ${(()=>{
                        if (widget.data.slideBorderColor){
                            return `background: ${widget.data.slideBorderColor};`;
                        }else return ``
                    })()}                            
                            width:7px;
                            height:7px;                         
                        }
                        .swiper-pagination-bullet-active {
                      
                            ${(()=>{
                        if (widget.data.slideSelectColor){
                            return `background: ${widget.data.slideSelectColor};`;
                        }else return ``
                    })()}
                            ${(()=>{
                        if (widget.data.slideSelectBorderColor){
                            return `border: ${widget.data.slideSelectBorderColor};`;
                        }else return ``
                    })()}                       
                        }
        `)
                    let slidePage = ``
                    pageImgArray.forEach((item: any, index: number) => {
                        // <!-- Slides -->
                        slidePage += `
                 <div class="swiper-slide" style="padding-bottom: ${widget.data.height ?? 128}%; background:50% / cover url(${item.img});" onclick="${gvc.event(() => {
                            ClickEvent.trigger({
                                gvc, widget, clickEvent: item
                            })
                        })}">
                </div>
            `
                    })
                    let id = `${glitter.getUUID()}`
                    return `
            <!-- Slider main container -->
            ${gvc.bindView({
                        bind: id,
                        view: () => {
                            return `
              <div class="swiper-wrapper">
                  ${slidePage}
              </div>
              ${(() => {
                                if (pagination) {
                                    return `<div class="swiper-pagination"></div>`
                                } else {
                                    return ``
                                }
                            })()}
              ${(() => {
                                if (navigation) {
                                    return `
                          <div class="swiper-button-prev"></div>
                          <div class="swiper-button-next"></div>`
                                } else {
                                    return ''
                                }
                            })()}
              ${(() => {
                                if (scrollbar) {
                                    return `<div class="swiper-scrollbar"></div>`
                                } else {
                                    return ``
                                }
                            })()}
              `
                        },
                        divCreate: {class: `swiper ${id}`},
                        onCreate: () => {
                            glitter.addMtScript([{
                                src: 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js'
                            }], () => {
                                const Swiper = (window as any).Swiper

                                const swiper = new Swiper(`.${id}`, {
                                    // Optional parameters
                                    direction: 'horizontal',
                                    loop: true,
                                    // If we need pagination
                                    pagination: {
                                        el: `.${id} .swiper-pagination`,
                                    },
                                    // Navigation arrows
                                    navigation: {
                                        nextEl: `.${id} .swiper-button-next`,
                                        prevEl: `.${id} .swiper-button-prev`,
                                    },
                                    // And if we need scrollbar
                                    scrollbar: {
                                        el: `.${id} .swiper-scrollbar`,
                                    },
                                });
                                glitter.share.swiper=glitter.share.swiper ?? []
                                glitter.share.swiper.push(swiper)
                            }, () => {
                            })
                        }
                    })}
        `;
                }

                gvc.addStyle(`
            .swiper-pagination-bullet{
            background-color: black !important;
            }
              .swiper-pagination-bullet-active{
            width:8px !important;
            background-color: white  !important;
            }
            `)
                gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css`)
                const editorID = glitter.getUUID()
                return {
                    view: () => {
                        return slideControl(data.link, true, false, false)
                    },
                    editor: () => {
                        return gvc.map([
                            // slideColor:"#E0E0E0",
                            // slideBorderColor:"",
                            // slideSelectColor:"#FFFFFF",
                            // slideSelectBorderColor:"1px solid #FE5541",
                            `
                            <h3 class="text-white" style="font-size: 16px;">圖片標示點顏色</h3>
                            <div class="d-flex align-items-center">                                
                                <input class="" type="color" value="${widget.data.slideColor ?? ""}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                widget.data.slideColor = e.value;
                                widget.refreshAll();
                            })}">
                                <input class="form-control" type="text" value="${widget.data.slideColor ?? ""}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                widget.data.slideColor = e.value
                                widget.refreshAll();
                            })}">
                            </div>
                            <h3 class="text-white" style="font-size: 16px;">圖片標示點邊框(border的Css)</h3>
                            <div class="d-flex align-items-center">                                
                                <input class="form-control" type="text" value="${widget.data.slideBorderColor ?? ""}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                widget.data.slideBorderColor = e.value
                                widget.refreshAll();
                            })}">
                            </div>
                            <h3 class="text-white" style="font-size: 16px;">目前圖片標示點顏色</h3>
                            <div class="d-flex align-items-center">                                
                                <input class="" type="color" value="${widget.data.slideSelectColor ?? ""}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                widget.data.slideSelectColor = e.value;
                                widget.refreshAll();
                            })}">
                                <input class="form-control" type="text" value="${widget.data.slideSelectColor ?? ""}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                widget.data.slideSelectColor = e.value
                                widget.refreshAll();
                            })}">
                            </div>
                            <h3 class="text-white" style="font-size: 16px;">目前圖片標示點邊框(border的Css)</h3>
                            <div class="d-flex align-items-center">                                
                                <input class="form-control" type="text" value="${widget.data.slideSelectBorderColor ?? ""}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                widget.data.slideSelectBorderColor = e.value
                                widget.refreshAll();
                            })}">
                            </div>                            
                            `,
                            gvc.bindView({
                                bind: editorID,
                                view: () => {
                                    function swapArr(arr: any[], index1: number, index2: number) {
                                        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                                        return arr;
                                    }

                                    return `
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片寬高比</h3>
<input class="mt-2 form-control" value="${widget.data.height??128}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                        widget.data.height = e.value;
                                        widget.refreshAll();
                                    })}">
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片連結</h3>
<div class="mt-2"></div>
${data.link.map((dd, index) => {
                                        return `
<div class="alert alert-dark">
<div class="d-flex align-items-center mb-3 mt-1 ">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                            data.link.splice(index, 1)
                                            widget.refreshAll()
                                        })}"></i>
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${dd.img}">
<div class="d-flex flex-column mx-2">
<i class="fa-duotone fa-up  text-white ${(index === 0) ? `d-none` : ``}"  style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                            data.link = swapArr(data.link, index, index - 1)
                                            widget.refreshAll()
                                        })}"></i>
<i class="fa-regular fa-down  text-white ${(index === data.link.length - 1) ? `d-none` : ``}" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                            data.link = swapArr(data.link, index, index + 1)
                                            widget.refreshAll()
                                        })}"></i>
</div>
<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                            glitter.ut.chooseMediaCallback({
                                                single: true,
                                                accept: 'image/*',
                                                callback(data: { file: any; data: any; type: string; name: string; extension: string }[]) {
                                                    api.upload(data[0].file, (link) => {
                                                        dd.img = link;
                                                        widget.refreshAll()
                                                    })
                                                }
                                            })
                                        })}"></i>
</div>
${ClickEvent.editer(gvc, widget, dd)}
</div>
`
                                    }).join(`<div class="w-100 my-3" style="background: white;height: 1px;"></div>`)}
<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                                        gvc.event(() => {
                                            data.link.push({img: `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`})
                                            widget.refreshAll()
                                        })
                                    }">添加輪播圖</div>
`
                                },
                                divCreate: {}
                            })
                        ])
                    }
                }
            },
        },
        rankingBlock: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                widget.data.titleStyle = widget.data.titleStyle ?? `font-family: 'Noto Sans TC';
font-style: normal;
color: black;
font-size: 16px;
margin-top: 16px;
margin-left: 12px;
font-weight: 700;`
                widget.data.rank = widget.data.rank ?? [{}, {}, {}]
                return {
                    view: () => {
                        return `
                <div class="" style="background-color: ${widget.data.bgcolor};border-radius:${widget.data.radius}px;">
                <h3 style="${widget.data.titleStyle}">${widget.label}</h3>
                   <div class="d-flex align-items-center justify-content-around " style="width:calc(100% -24px);margin-left: 12px;margin-right: 12px;gap: 8px;padding-bottom: 15px;">
               ${gvc.map(['firstRank.svg', 'secondRank.svg', 'thirdRank.svg'].map((dd, index) => {
                            const data = widget.data.rank[index]
                            data.data = data.data ?? {}
                            return ` <div class="d-flex flex-column align-items-center justify-content-center" style="width:calc(100% - 16px);">
 <div class="bg-white flex-fill position-relative" style="width:100%;border-radius: 8px;padding-bottom: calc(100%);" onclick="${gvc.event(() => {
                                ClickEvent.trigger({
                                    gvc,
                                    widget,
                                    clickEvent: data
                                })
                            })}">
 <img src="${data.data.preview_image}" class="position-absolute w-100 h-100" style="top: 0px;">
         <img src="${rootURL}img/homeeExtension/${dd}" class="position-absolute" style="top: 0px;">       
</div>
<span class="" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 500;
font-size: 10px;
line-height: 14px;
text-align: center;
margin-top: 4px;
color: #FE5541;">$ ${data.data.sale_price}</span>
</div>`
                        }))}
</div>
</div>
                `
                    },
                    editor: () => {
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "背景顏色",
                                default: widget.data.bgcolor,
                                placeHolder: "請輸入背景顏色",
                                callback: (text: string) => {
                                    widget.data.bgcolor = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "倒圓角",
                                default: widget.data.radius,
                                placeHolder: "請輸入圓角幅度",
                                callback: (text: string) => {
                                    widget.data.radius = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeText({
                                gvc: gvc,
                                title: "標題Style",
                                default: widget.data.titleStyle,
                                placeHolder: "請輸入標題Style",
                                callback: (text: string) => {
                                    widget.data.titleStyle = text
                                    widget.refreshAll()
                                }
                            }),
                            gvc.map(widget.data.rank.map((dd: any, index: number) => {
                                return ClickEvent.editer(gvc, widget, dd, {
                                    option: ['toProductDetail'],
                                    hover: true,
                                    title: "點擊事件-" + (index + 1)
                                })
                            }))
                        ])
                    }
                }
            }
        },
        productItem:    {
            style: "",
            defaultData: {
                "data": {
                    "id": 8837303,
                    "name": "HOVE 雙人床架",
                    "price": 23580,
                    "sale_price": 23580,
                    "preview_image": "https://cdn.store-assets.com/s/349867/i/51305748.png?width=720"
                },
                "clickEvent": {
                    "src": "http://127.0.0.1:3090/test/homee/event.js",
                    "route": "toProductDetail"
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                widget.data.data = widget.data.data ?? {};
                let productID = "d"+widget.data.data.id;

                let images = widget.data.data.images ?? [widget.data.data.preview_image];
                gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css`)
                gvc.addStyle(`
                    .swiper-pagination-bullet {
                        background: #E0E0E0!important;;                    
                    }
                    .swiper-pagination-bullet-active{
                        background: #FE5541!important;;
                    }
                `)
                return {
                    view: () => {
                        const pageID=glitter.getUUID()
                        return `
                            <div class="${widget.data.class ?? ""}p-0 w-100" style="${widget.data.style ?? ""}; 
                                break-inside: avoid;margin-top: 16px;                                
                                height: auto;background: #FBF9F6;border-radius: 16px;" onclick="${gvc.event(() => {
                            console.log(widget.data)
                            ClickEvent.trigger({
                                gvc,
                                widget,
                                clickEvent: widget.data
                            })
                        })}">
                                
                                ${gvc.bindView({
                            bind : pageID,
                            view : ()=>{
                                return `
                                              <!-- Additional required wrapper -->
                                              <div class="swiper-wrapper w-100" style="background-clip: padding-box;">
                                                <!-- Slides -->
                                                ${(() => {
                                    let returnHTML = ``;
                                    for (let i = 0; i < 3 && i < images.length; i++) {
                                        returnHTML += `
                                                    <div class="swiper-slide" style="padding-bottom: 100%;background: 50%/cover no-repeat url('${images[i].url}') , white;"></div>
                                                `
                                    }
                                    return returnHTML
                                })()}                                                                                
                                              </div>
                                              <div class="w-100" style="position:absolute;left:0;top:0;height:100%;border: 4px solid rgba(248, 243, 237, 0.3);background:transparent;z-index: 3;border-radius: 16px;pointer-events:none;" onscroll=""></div>
                                              <!-- If we need pagination -->
                                              <div class="swiper-pagination" id="${pageID}"></div>                                                                                                                                                                          
                                        `
                            },divCreate : {class:`swiper ${pageID} w-100` , style:`border-radius: 16px;position: relative;`},
                            onCreate : ()=>{


                                glitter.addMtScript([{
                                    src: 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js'
                                }], () => {
                                    const Swiper = (window as any).Swiper
                                    const swiper = new Swiper(`.${pageID}`, {
                                        // Optional parameters
                                        slidesPerView: 'auto',
                                        direction: 'horizontal',
                                        loop: false,
                                        // If we need pagination
                                        pagination: {
                                            el: `#${pageID}`,
                                        },
                                    });
                                    // gvc.notifyDataChange(productID);
                                    glitter.share.swiper=glitter.share.swiper ?? []
                                    glitter.share.swiper.push(swiper)
                                }, () => {
                                })
                            }
                        })}
<!--                                <div class="w-100 m-0" style="box-sizing:border-box;border-radius: 16px;padding-bottom: 100%;background: 50%/cover no-repeat url('${widget.data.data.preview_image}'), white;"></div>-->
                                <h3 class="w-100" style="padding:0 8px;font-family: 'Noto Sans TC';font-style: normal;font-weight: 700;font-size: 14px;margin-top: 8px;word-break: break-word;white-space: normal;margin-bottom: 0px;color: #292929;">
                                    ${widget.data.data.name ?? "尚未設定"}
                                </h3>
                                <div class="d-flex align-items-baseline" style="padding:0 8px;margin-top: 8px;padding-bottom: 8px;">
                                    <span style="font-family: 'Noto Sans TC';font-style: normal;font-weight: 400;font-size: 14px;color: #FD6A58;line-height: 150%;">
                                        NT$ ${widget.data.data.sale_price ?? "尚未設定"} ${(()=>{

                            if (widget.data.data.showUp){
                                return "up"
                            }
                            return  ""
                        })()}
                                    </span>
                                    <div class="flex-fill"></div>
                                    <span class="${(widget.data.data.price === widget.data.data.sale_price) ? `d-none` : ``}" style="font-family: 'Noto Sans TC';font-style: normal;font-weight: 400;font-size: 10px;line-height: 14px;text-align: right;text-decoration-line: line-through;color: #858585;" >
                                        NT$ ${widget.data.data.sale_price}
                                    </span>
                                </div>
                            </div>
                        `
                    },
                    editor: () => {
                        return gvc.map([
                            ClickEvent.editer(gvc, widget, widget.data, {
                                option: ['toProductDetail'],
                                hover: true
                            })
                        ])
                    }
                }
            },
        },
        homeTitleBar: {
            defaultData: {
                logo: {
                    src: ``, width: ``, height: ``
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                const shareView = new SharedView(gvc)
                return {
                    view: () => {
                        return shareView.navigationBar({
                            title: `<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 16px;
color: #1E1E1E;
line-height: 150%;">${widget.data.centerText ?? ""}</span>`,
                            leftIcon: `<div class="d-flex align-items-center"><img 
style="
width: ${([undefined, ''].indexOf(widget.data.logo.width) !== -1) ? 'auto' : widget.data.logo.width};
height: ${([undefined, ''].indexOf(widget.data.logo.height) !== -1) ? 'auto' : widget.data.logo.height};
"
src="${(!widget.data.logo.src || widget.data.logo.src === '') ? new URL('./src/home_logo.svg', import.meta.url) : widget.data.logo.src}"><h3 class="p-0 m-0" style="${widget.data.titleStyle ?? ""}">${widget.data.title ?? ""}</h3></div>`,
                            rightIcon: `
                       <div class="d-flex align-items-center" style="gap:15px;">
                       
                       <img src="${rootURL}img/component/scan.svg" onclick="${gvc.event(() => {
                                glitter.runJsInterFace("qrcodeScanner", {}, () => {
                                })
                            })}">
                       <img src="${rootURL}/img/component/bell.svg" onclick="${gvc.event(() => {
                                glitter.runJsInterFace("noticeBell", {}, () => {
                                })
                            })}">
                       <img src="${rootURL}img/component/category.svg" onclick="${gvc.event(() => {
                                appConfig().changePage(gvc, 'category')
                            })}">
                       
</div>
                       `
                        })
                    },
                    editor: () => {
                        return gvc.map(
                            [
                                glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: "置中內容",
                                    default: widget.data.centerText ?? "",
                                    placeHolder: `請輸入置中內容`,
                                    callback: (text: string) => {
                                        widget.data.centerText = text
                                        widget.refreshAll()
                                    }
                                }),
                                `
<h3 style="color:white;font-size: 16px;" class="my-2">左側內容</h3>
<div class="alert alert-warning mt-2" role="alert">
${gvc.map([EditerApi.upload("Logo", widget.data.logo.src ?? "", gvc, (text) => {
                                    widget.data.logo.src = text
                                    widget.refreshAll()
                                }),
                                    `<div class="d-flex align-items-center justify-content-around w-100">
<div class="d-flex align-items-center">
<h3 style="color: white;font-size: 16px;word-break: break-word;white-space: nowrap;" class="m-0 p-0">寬度</h3>
<input class="form-control flex-fill ms-2" style="width: calc(100% - 50px);" value="${widget.data.logo.width ?? ""}" onchange="${gvc.event((e) => {
                                        widget.data.logo.width = e.value
                                        widget.refreshAll()
                                    })}"></input>
</div>
<div class="d-flex align-items-center ms-2">
<h3 style="color: white;font-size: 16px;word-break: break-word;white-space: nowrap; "  class="m-0 p-0">高度</h3>
<input class="form-control flex-fill ms-2" style="width: calc(100% - 50px);" value="${widget.data.logo.height ?? ""}" onchange="${
                                        gvc.event((e) => {
                                            widget.data.logo.height = e.value
                                            widget.refreshAll()
                                        })
                                    }"></input>
</div>
</div>`])}
</div>`
                                ,
                                `<div class="alert alert-warning mt-2" >${gvc.map([glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: "標題",
                                    default: widget.data.title,
                                    placeHolder: ``,
                                    callback: (text: string) => {
                                        widget.data.title = text
                                        widget.refreshAll()
                                    }
                                }),
                                    glitter.htmlGenerate.editeText({
                                        gvc: gvc,
                                        title: "標題Style",
                                        default: widget.data.titleStyle,
                                        placeHolder: ``,
                                        callback: (text: string) => {
                                            widget.data.titleStyle = text
                                            widget.refreshAll()
                                        }
                                    })])}</div>`,
                            ]
                        )
                    }
                }
            }
        },
        footer: {
            defaultData: {
                dataList: [
                    {
                        title: "首頁",
                        icon: new URL('../img/component/footer/home.svg', import.meta.url).href,
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
                        icon: new URL('../img/component/footer/shoopingCart.svg', import.meta.url).href,
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
                glitter.runJsInterFace("getBottomInset", {}, (response) => {
                    var _a;
                    if (((_a = widget.data) === null || _a === void 0 ? void 0 : _a.bottomInset) != response.data) {
                        widget.data.bottomInset = response.data;
                        try{
                            widget.refreshAll();
                        }catch (e) {

                        }
                    }
                }, {
                    webFunction: () => {
                        return {data: 20};
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
                    `);

                return {
                    view: () => {
                        // ClickEvent.trigger({gvc, widget, clickEvent: dd.clickEvent})
                        return `
                        <footer class="d-flex align-items-center justify-content-around    w-100" style="padding-bottom: ${widget.data.bottomInset - 10}px;position: fixed;bottom: 0px;left: 0px;">
                            ${(() => {
                            return gvc.map(widget.data.dataList.map((data: any, index: number) => {
                                data.badge=data.badge??{}
                                return `
                                <div class="d-flex flex-column align-items-center" style="width: 64px;" onclick="${gvc.event((e) => {
                                    ClickEvent.trigger({
                                        gvc, widget, clickEvent: data
                                    });
                                })}">
                                    <img src=${data.icon} style="width: 28px;height: 28px;">
                                    <div class="footerTitle" style="color:${data.color ?? `black`};">${data.title}</div>
                                   ${gvc.bindView(()=>{
                                    let badge=0
                                    const id=gvc.glitter.getUUID()
                                    data.badge.callback=(count:number)=>{
                                        badge=count
                                        gvc.notifyDataChange(id)
                                    }
                                    ClickEvent.trigger({
                                        gvc, widget, clickEvent: data.badge
                                    })
                                    return {
                                        bind:id,
                                        view:()=>{
                                            if(badge===0){return  ``}
                                            return `<div class=" d-flex align-items-center justify-content-center" style="position: absolute;
width: 16px;
height: 16px;
background: #FE5541;
border: 1px solid #FFFFFF;
font-size: 9px;
color: white;
border-radius: 8px;">${badge}</div>`
                                        },
                                        divCreate:{class:`position-relative position-absolute`}
                                    }
                                })}
                                    
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
                            dd.badge=dd.badge??{}
                            return `<div class="alert alert-dark mt-2">
<h3 style="color: white;font-size: 17px;color: orangered;">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                widget.data.dataList.splice(index, 1)
                                widget.refreshComponent()
                            })}"></i>
選項.${index + 1}</h3>
${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `名稱`,
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
                                title: "字體顏色",
                                default: dd.color ?? "black",
                                placeHolder: "請輸入字體顏色",
                                callback: (text) => {
                                    dd.color = text
                                    widget.refreshComponent()
                                }
                            })}
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片</h3>
                                <div class="mt-2"></div>
                                <div class="d-flex align-items-center mb-3">
                                    <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].icon}">
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
                            + ClickEvent.editer(gvc, widget, dd)
                            + ClickEvent.editer(gvc, widget, dd.badge,{hover:false,option:['cartBadge'],title:"數量提示"})
                            }
</div>`;
                        })) + `<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                            gvc.event(() => {
                                widget.data.dataList.push({
                                    title: "標題",
                                    icon: new URL('../img/component/footer/home.svg', import.meta.url).href
                                })
                                widget.refreshComponent()
                            })
                        }">添加按鈕</div>`;
                    }
                };
            }
        },
        navigationBar: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                const sharedView = new SharedView(gvc);
                widget.data.left = widget.data.left ?? []
                widget.data.right = widget.data.right ?? []

                return {
                    view: () => {
                        return sharedView.navigationBar({
                            title: widget.data.title ?? "標題",
                            leftIcon: widget.data.left.map((dd: any) => {
                                dd.type=dd.type ?? 'image'
                                if(dd.type === 'image'){
                                    return  (dd.img && `<img class="" src="${dd.img}" style="height: ${dd.imgHeight||"24px"};width: ${dd.imgWidth||"24px"};" alt="" onclick="${gvc.event(() => {
                                        ClickEvent.trigger({gvc, widget, clickEvent: dd.clickEvent})
                                    })}">`)
                                }else {
                                    return  `<span class="${dd.class ?? ""}" style="${dd.style ?? ""}" onclick="${gvc.event(() => {
                                        ClickEvent.trigger({gvc, widget, clickEvent: dd.clickEvent})
                                    })}">${dd.title ?? ""}</span>`
                                }
                            }).join('<div class="mx-2"></div>'),
                            rightIcon: widget.data.right.map((dd: any) => {
                                dd.badge=dd.badge ?? {}
                                dd.type=dd.type ?? 'image'
                                return `<div class="position-relative">
${(()=>{
                                    if(dd.type === 'image'){
                                        return  (dd.img && `<img class="" src="${dd.img}" style="height: ${dd.imgHeight||"24px"};width: ${dd.imgWidth||"24px"};" alt="" onclick="${gvc.event(() => {
                                            ClickEvent.trigger({gvc, widget, clickEvent: dd.clickEvent})
                                        })}">`)
                                    }else {
                                        return  `<span class="${dd.class ?? ""}" style="${dd.style ?? ""}" onclick="${gvc.event(() => {
                                            ClickEvent.trigger({gvc, widget, clickEvent: dd.clickEvent})
                                        })}">${dd.title ?? ""}</span>`
                                    }
                                })()}
      ${gvc.bindView(()=>{
                                    let badge=0
                                    const id=gvc.glitter.getUUID()
                                    dd.badge.callback=(count:number)=>{
                                        badge=count
                                        gvc.notifyDataChange(id)
                                    }
                                    ClickEvent.trigger({
                                        gvc, widget, clickEvent: dd.badge
                                    })
                                    return {
                                        bind:id,
                                        view:()=>{
                                            if(badge===0){return  ``}
                                            return `<div class=" d-flex align-items-center justify-content-center" style="position: absolute;
width: 16px;
height: 16px;
background: #FE5541;
border: 1px solid #FFFFFF;
font-size: 9px;
color: white;
border-radius: 8px;" >${badge}</div>`
                                        },
                                        divCreate:{class:`position-absolute top-0 right-0`,style:`top:0px;
right: 8px;`}
                                    }
                                })}
</div>`
                            }).join('<div class="mx-2"></div>'),
                            background:widget.data.bgcolor ?? "white"
                        })
                    },
                    editor: () => {
                        function navItemAction(data: any) {

                            return data.map((dd: any, index: number) => {
                                dd.type=dd.type ?? 'image'
                                dd.badge=dd.badge ?? {}
                                dd.clickEvent = dd.clickEvent ?? {}
                                return `
<div class="alert alert-dark">
${
                                    (()=>{
                                        return `
<h3 class="text-white" style="font-size: 16px;">類型</h3>
<select class="form-control form-select mb-3" onchange="${gvc.event((e) => {
                                            dd.type = e.value
                                            widget.refreshComponent()
                                        })}">
<option value="image" ${dd.type === 'image' && 'selected'}>圖片</option>
<option ${dd.type === 'title' && 'selected'} value="title">文字</option>
</select>
${(dd.type === 'image') ? `<div class="d-flex align-items-center mb-3 mt-1 ">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                            data.splice(index, 1)
                                            widget.refreshComponent()
                                        })}"></i>
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${dd.img ?? ""}">
<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                            glitter.ut.chooseMediaCallback({
                                                single: true,
                                                accept: 'image/*',
                                                callback(data: { file: any; data: any; type: string; name: string; extension: string }[]) {
                                                    api.upload(data[0].file, (link) => {
                                                        dd.img = link;
                                                        widget.refreshComponent()
                                                    })
                                                }
                                            })
                                        })}"></i>
</div>
    <div class="d-flex w-100">
        <div class="d-flex align-items-center justify-content-center">圖片寬度</div>
        <input class="flex-fill form-control ms-2" style="width: 100px;" value="${dd.imgWidth ?? "24px"}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                            dd.imgWidth = e.value;
                                            widget.refreshAll();
                                        })}">
    </div>
    <div class="d-flex w-100">
        <div class="d-flex align-items-center justify-content-center">圖片高度</div>
        <input class="flex-fill form-control ms-2" style="width: 100px;" value="${dd.imgHeight ?? "24px"}" onchange="${gvc.event((e:HTMLInputElement)=>{
                                            dd.imgHeight = e.value;
                                            widget.refreshAll();
                                        })}">
    </div>
` : gvc.map([glitter.htmlGenerate.editeInput({
                                            gvc:gvc,
                                            title:'按鈕文字',
                                            default:dd.title ?? '',
                                            placeHolder:`請輸入按鈕文字`,
                                            callback:(text)=>{
                                                dd.title=text
                                                widget.refreshComponent()
                                            }
                                        }),glitter.htmlGenerate.editeText({
                                            gvc:gvc,
                                            title:'Style',
                                            default:dd.style ?? '',
                                            placeHolder:``,
                                            callback:(text)=>{
                                                dd.style=text
                                                widget.refreshComponent()
                                            }
                                        }),glitter.htmlGenerate.editeText({
                                            gvc:gvc,
                                            title:'Class',
                                            default:dd.class ?? '',
                                            placeHolder:``,
                                            callback:(text)=>{
                                                dd.class=text
                                                widget.refreshComponent()
                                            }
                                        })])}
`
                                    })()
                                }
${ClickEvent.editer(gvc, widget, dd.clickEvent)}
${ClickEvent.editer(gvc, widget, dd.badge,{hover:false,option:['cartBadge'],title:"數量提示"})}
</div>
`
                            }).join(`<div class="w-100 my-3" style="background: white;height: 1px;"></div>`)
                        }

                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc,
                                title: "背景",
                                default: widget.data.bgcolor,
                                placeHolder: "請輸入背景色",
                                callback: (text) => {
                                    widget.data.bgcolor = text
                                    widget.refreshComponent()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc,
                                title: "標題",
                                default: widget.data.title,
                                placeHolder: "請輸入標題",
                                callback: (text) => {
                                    widget.data.title = text
                                    widget.refreshComponent()
                                }
                            }),
                            `<div class="w-100 alert-dark alert my-2" >
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">左側按鈕</h3>
${navItemAction(widget.data.left)}
<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                                gvc.event(() => {
                                    widget.data.left.push({})
                                    widget.refreshComponent()
                                })
                            }">添加按鈕</div>
</div>`, `<div class="w-100 alert-dark alert my-2" >
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">右側按鈕</h3>
${navItemAction(widget.data.right)}
<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                                gvc.event(() => {
                                    widget.data.right.push({})
                                    widget.refreshComponent()
                                })
                            }">添加按鈕</div>
</div>`
                        ])
                    }
                }
            }
        }
    }
});