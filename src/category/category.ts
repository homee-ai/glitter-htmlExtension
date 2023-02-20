'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {SharedView} from "../homee/shareView.js";
import {appConfig} from "../config.js";
import {Dialog} from "../homee/legacy/widget/dialog.js";
import {Category, ProductData} from "../api/category.js";

Plugin.create(import.meta.url,(glitter)=>{
    return {
        nav: {
            defaultData:{
                searchDefault:"大家都在搜尋:沙發"
            },
            render:(gvc, widget, setting, hoverID) => {
                gvc.addStyle(`                    
                    `)
                glitter.runJsInterFace("getTopInset", {}, (response:any) => {
                    if (widget.data?.topInset != response.data){
                        widget.data.topInset = response.data;
                        widget.refreshAll!();
                    }
                }, {
                    webFunction: () => {
                        return {data: 10}
                    }
                })
                return {
                    view:()=>{
                        const sharedView=new SharedView(gvc)
                        return sharedView.navigationBar({
                            title:``,
                            leftIcon:`<img class="" src="${new URL('../img/component/left-arrow.svg',import.meta.url).href}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                              gvc.glitter.goBack()
                            })}">
 <div class="  form-control flex-fill" style="
border-radius: 20px;
font-family: 'Noto Sans TC';
padding-left: 30px;
font-style: normal;
font-weight: 400;
background: url(https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061987473) no-repeat scroll 7px 7px,rgba(41, 41, 41, 0.1);;
background-size: 20px;
font-size: 14px;
line-height: 150%;
color: #858585;
width: calc(100vw - 180px);
" placeholder="${widget.data.searchDefault}" onclick="${gvc.event(()=>{
                               glitter.changePage(new URL('../homee/jspage/search-page.js',import.meta.url).href,'searchPage',true,{},{animation:glitter.animation.fade})
                            })}" >${widget.data.searchDefault}</div>
`,
                            rightIcon:`
                             <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061894470" style="width: 28px;height: 28px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                glitter.runJsInterFace("noticeBell",{},()=>{})
                            })}">
                                <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061418331" style="width: 28px;height: 28px;" alt="" onclick="${gvc.event(() => {
                                glitter.runJsInterFace("qrcodeScanner",{},()=>{})
                            })}">
                            `
                        })
                    },
                    editor:()=>{
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "預設搜尋內容",
                                default: widget.data.searchDefault,
                                placeHolder: "大家都在搜尋:沙發",
                                callback: (text: string) => {
                                    widget.data.searchDefault= text
                                    widget.refreshAll!()
                                }
                            }),
                        ])
                    }

                }
            },
        },
        banner:{
            defaultData:{
                dataList:[
                    {title:"精選人氣商品" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063161788"},
                    {title:"岩板餐桌系列" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063296082"},
                    {title:"本週新品（ NEW ）" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063314153"}
                ],
            },
            render:(gvc, widget, setting, hoverID)=>{
                gvc.addStyle(`
                        .bannerTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 14px;
                            line-height: 20px;
                            color: #292929;
                            
                            position:absolute;
                            top:8px;
                            left:12px;
                            
                        }
                        .banner-card{
                            border-radius: 12px;
                        }
                    `)
                return {
                    //分為二 view決定中間該顯示的樣子
                    //editor決定右方供人輸入的樣子
                    view: ()=>{
                        return `
                        <div class="w-100 d-flex" style="padding: 16px;">
                            <div class="w-50 banner-card" style="margin-right:7px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[0].img});position: relative" onclick="${gvc.event(()=>{
                            ClickEvent.trigger({
                                gvc,widget,clickEvent:widget.data.dataList[0]
                            })
                        })}">
                                <div class="bannerTitle">${widget.data.dataList[0].title}</div>
                            </div>
                            <div class="w-50 d-flex flex-column" style="margin-left: 7px;" >
                                <div class="banner-card" style="margin-bottom:6px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[1].img});position: relative;" onclick="${gvc.event(()=>{
                            ClickEvent.trigger({
                                gvc,widget,clickEvent:widget.data.dataList[1]
                            })
                        })}">
                                    <div class="bannerTitle">${widget.data.dataList[1].title}</div>
                                </div>
                                <div class="banner-card" style="margin-top:6px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[2].img});position: relative;" onclick="${gvc.event(()=>{
                            ClickEvent.trigger({
                                gvc,widget,clickEvent:widget.data.dataList[2]
                            })
                        })}">
                                    <div class="bannerTitle">${widget.data.dataList[2].title}</div>
                                </div>
                            </div>
                        </div>
                    `
                    },
                    editor: ()=>{
                        return gvc.map(widget.data.dataList.map((dd:any,index:number)=>{
                            return `<div class="alert alert-dark mt-2">
${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `banner標題${index+1}`,
                                    default: dd.title,
                                    placeHolder: dd.title,
                                    callback: (text: string) => {
                                        widget.data.dataList[index].title = text
                                        widget.refreshAll!()
                                    }
                                })}
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">banner圖片${index+1}</h3>
                                <div class="mt-2"></div>
                                <div class="d-flex align-items-center mb-3">
                                    <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].img}">
                                    <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                    <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                glitter.ut.chooseMediaCallback({
                                    single:true,
                                    accept:'image/*',
                                    callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                        glitter.share.publicInterface["glitter"].upload(data[0].file,(link:string)=>{
                                            widget.data.dataList[index].img=link;
                                            widget.refreshAll!()
                                        })
                                    }
                                })
                            })}"></i>
                                </div>
${ClickEvent.editer(gvc,widget,dd)}
</div>`
                        }))
                    }

                    // glitter.htmlGenerate.editeInput({
                    //     gvc: gvc,
                    //     title: "banner標題1",
                    //     default: widget.data.title[0],
                    //     placeHolder: "精選人氣商品",
                    //     callback: (text: string) => {
                    //         widget.data.searchDefault= text
                    //         widget.refreshAll!()
                    //     }
                    // }),

                }
            }
        },
        category12:{
            defaultData:{
                dataList:[
                    {title:"餐桌" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675071897159", toPage:""},
                    {title:"椅子" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072457700" , toPage:""},
                    {title:"沙發" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072481671" , toPage:""},
                    {title:"茶几" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072593723" , toPage:""},
                    {title:"TERA\n系統儲物" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072618992" , toPage:""},
                    {title:"BANFF\n系統儲物" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072650712" , toPage:""},
                    {title:"床架" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072676832" , toPage:""},
                    {title:"裝飾畫" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072699256" , toPage:""},
                    {title:"生活用品" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072721565" , toPage:""},
                    {title:"全部" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072765031" , toPage:""},
                ],
            },
            render:(gvc, widget, setting, hoverID)=>{
                gvc.addStyle(`
                        .bannerTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 14px;
                            line-height: 20px;
                            color: #292929;
                            
                            position:absolute;
                            top:8px;
                            left:12px;
                            
                        }
                        .banner-card{
                            border-radius: 12px;
                        }
                    `)
                return {
                    //分為二 view決定中間該顯示的樣子
                    //editor決定右方供人輸入的樣子 https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072765031
                    view: ()=>{
                        return gvc.bindView({
                            bind:"bookcase",
                            view : ()=>{
                                let returnHTML = gvc.map(widget.data.dataList.map((data:any)=>{
                                    return `
                                     <div class="d-flex flex-column " style="width:20%;padding-right: 16px;" onclick="${gvc.event(() => {
                                        ClickEvent.trigger({
                                            gvc,widget,clickEvent:data
                                        })
                                    })}">                                        
                                        <div style="width:64px;height:64px;border-radius: 18px;width:100%;height:auto;padding: 0 4px 100%;background: #FBF9F6 url(${data.img}) no-repeat center;background-size: contain;margin-right: 18px;"></div>
                                        <div class="w-100 d-flex align-items-center justify-content-center" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 100%;
white-space: normal;
word-break: break-all;
display: flex;
align-items: center;
text-align: center;
margin-bottom: 16px;
margin-top: 4px;
color: #1E1E1E;">${data.title}</div>
                                    </div>
                                
                                `
                                }));

                                return `
                            <div style="margin-bottom:12px;padding-left:16px;font-weight: 700;font-size: 18px;line-height: 26px;color: #1E1E1E;">品類</div>
                            <div class="d-flex flex-wrap" style="padding-left:16px;">
                            ${returnHTML}
                            </div>
                        `

                            },
                            divCreate: {class: `d-flex flex-column `, style: `margin-top:16px;`}
                        })
                    },
                    editor: ()=>{
                        return `<div class="d-flex flex-column">                   
                        ${gvc.map(widget.data.dataList.map((dd:any,index:number)=>{
                            return `
                            <div class="d-flex flex-column my-3 alert alert-dark">
                                <div class="d-flex align-items-center">
                                    <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;display: inline-block" onclick="${gvc.event(() => {
                                    widget.data.dataList.splice(index, 1)
                                    widget.refreshAll()
                                })}"></i>區塊${index + 1}
                                </div>
                                ${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `標題${index+1}`,
                                    default: dd.title,
                                    placeHolder: dd.title,
                                    callback: (text: string) => {
                                        widget.data.dataList[index].title = text
                                        widget.refreshAll!()
                                    }
                                })}     
                                 <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片${index+1}</h3>
                                    <div class="mt-2"></div>
                                    <div class="d-flex align-items-center mb-3">
                                        <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].img}">
                                        <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                        <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                glitter.ut.chooseMediaCallback({
                                    single:true,
                                    accept:'image/*',
                                    callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                        appConfig().uploadImage(data[0].file,(link)=>{
                                            widget.data.dataList[index].img=link;
                                            widget.refreshAll()
                                        })
                                    }
                                })
                            })}"></i>
                                    </div>
                                ${ClickEvent.editer(gvc,widget,dd)}  
                            </div>                 
                                `
                        }))}
                        ${(()=>{
                            gvc.addStyle(`
                                    .add-btn:hover{
                                        cursor: pointer;
                                    }
                                `)
                            return `
                                    <div class="add-btn text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                                gvc.event(() => {
                                    widget.data.dataList.push({img: `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg` , title : `` , toPage : ``})
                                    widget.refreshAll()
                                })
                            }">添加目錄區塊</div>
                                `
                        })()}
                    </div>`
                    }

                }
            }
        },
        footer:{
            defaultData:{
                dataList:[
                    {
                        title : "首頁",
                        icon : new URL('../img/component/footer/home.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "靈感",
                        icon : new URL('../img/component/footer/idea.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "我的空間",
                        icon : new URL('../img/component/footer/myspace.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "購物車",
                        icon : new URL('../img/component/footer/shoopingCart.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "會員",
                        icon : new URL('../img/component/footer/user.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },

                ],
            },
            render:(gvc, widget, setting, hoverID)=>{
                glitter.runJsInterFace("getBottomInset", {}, (response:any) => {
                    if (widget.data?.bottomInset != response.data){
                        widget.data.bottomInset = response.data;
                        widget.refreshAll!();
                    }
                }, {
                    webFunction: () => {
                        return {data: 10}
                    }
                })
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
                    `)

                return {
                    view: ()=>{
                        return `
                        <footer class="d-flex align-items-center justify-content-around w-100" style="padding-bottom: ${widget.data.bottomInset}px;position: fixed;bottom: 0px;left: 0px;">
                            ${(() => {
                            return gvc.map(widget.data.dataList.map((data:any , index:number)=>{
                                return `
                                <div class="d-flex flex-column align-items-center" onclick="${gvc.event((e)=>{
                                    ClickEvent.trigger({
                                        gvc,widget,clickEvent:data
                                    })
                                })}">
                                    <img src=${data.icon} style="width: 28px;height: 28px;">
                                    <div class="footerTitle ${(() => {if (index==0) return "selected"})()}">${data.title}</div>
                                </div>
                                `
                            }))
                        })()}
                        </footer>
                    `
                    },
                    editor: ()=>{
                        return gvc.map(widget.data.dataList.map((dd:any,index:number)=>{
                            return glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `footer icon ${index+1}`,
                                    default: dd.title,
                                    placeHolder: dd.title,
                                    callback: (text: string) => {
                                        widget.data.dataList[index].title = text
                                        widget.refreshAll!()
                                    }
                                })+
                                `
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">icon圖片${index+1}</h3>
                                <div class="mt-2"></div>
                                <div class="d-flex align-items-center mb-3">
                                    <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].icon}">
                                    <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                    <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                    glitter.ut.chooseMediaCallback({
                                        single:true,
                                        accept:'image/*',
                                        callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                            glitter.share.publicInterface["glitter"].upload(data[0].file,(link:string)=>{
                                                widget.data.dataList[index].icon=link;
                                                widget.refreshAll!()
                                            })
                                        }
                                    })
                                })}"></i>
                                </div>
                            `
                                +ClickEvent.editer(gvc,widget,dd)
                        }))
                    }


                }
            }
        },
        subCategory:{
            defaultData:{},
            render:(gvc, widget, setting, hoverID)=>{
                return {
                    view:()=>{
                        gvc.addStyle(`
     
        nav{
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
        }

        main {
            padding: 24px 35px 44px;
      
            font-family: 'Noto Sans TC';
            margin: 0;
            box-sizing: border-box;
        }
        .sortRawText{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 13px;
            line-height: 19px;
            /* identical to box height */
            
            display: flex;
            align-items: center;
            text-align: center;
            
            /* HOMEE dark grey */
            
            color: #858585;

        }
        a{
        
        }

        `)
                        const gBundle=(gvc.parameter.pageConfig?.obj.data.object && gvc.parameter.pageConfig?.obj.data) ?? {"title":"本週新品","object":{"link":"https://mitblog.pixnet.net/blog/post/37708222","name":"本週新品","value":"gid://shopify/Collection/435249512748","clickEvent":{"src":"$homee/homee/event.js","route":"category"},"selectPage":{"tag":"product_show","name":"產品展示頁面","group":"產品頁"},"subCategory":[{"name":"銀標福利品","value":"gid://shopify/Collection/435260719404"},{"name":"布沙發 ( 更多商品即將更新 )","value":"gid://shopify/Collection/432946676012"}]},"category":"sub_category_id","index":0}
                        const viewModel:{
                            select:number,
                            setSubCategoryRow:(category: string)=>string,
                            loading:boolean,
                            product:any
                        } = {
                            select:0,
                            setSubCategoryRow:(category: string) => {
                            gvc.addStyle(`
                .subcateTitle{
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 20px;
                    display: flex;
                    align-items: center;
                    text-align: center;
                    /* HOMEE dark grey */
                    margin-left: 16px;
                    color: #858585;
                }
                .selectTitle{
                    /* HOMEE black */
                    color: #292929;
                    font-weight: 700;
                }
            `)
                             return  gvc.bindView({
                                    bind: "subCategoryRow",
                                    view: () => {
                                        return gvc.map([{name:"全部",id:gBundle.object.id}].concat(gBundle.object.subCategory ?? []).map((data: any, index: number)=>{
                                            return `
                            <div class="subcateTitle ${(viewModel.select === index) ? `selectTitle`:``}" style="" onclick="${gvc.event(() => {
                                                viewModel.loading=true
                                                viewModel.select=index
                                                gvc.notifyDataChange('mainView')
                                                gvc.notifyDataChange('cardGroup')
                                                gvc.notifyDataChange('subCategoryRow')
                                            })}">
                                ${data["name"]}
                                
                            </div>
                                `
                                        }))
                                    }, divCreate: {class: `d-flex`, style: `margin-left:8px;overflow-x: scroll;padding-right:8px;`}
                                })

                        },
                            loading:true,
                            product:[]
                        }

                        let sortSelect = 0;
                        //todo get title 父標題
                        let title = gBundle.title ?? "分類頁";
                        let sortPriceOrder = -1;
                        let origData:ProductData[] = [];
                        glitter.share.productData = {};
                        let sortRow = [
                            {
                                text: '綜合', img: '', click: (e:HTMLElement) => {
                                    //reset orderPrice
                                    sortPriceOrder = -1;
                                    sortRow[1].img = glitter.share.getLink('../img/sample/category/sort.svg');
                                    sortSelect = 0;
                                    if (origData.length != 0){
                                        glitter.share.productData = origData;
                                    }
                                    gvc.notifyDataChange('sortBar');
                                    gvc.notifyDataChange('cardGroup');
                                }
                            },
                            // {
                            //     text: '銷量', img: '', click: (e:HTMLElement) => {
                            //         if (!origData){
                            //             origData = glitter.share.productData;
                            //         }
                            //
                            //         //reset orderPrice
                            //         sortPriceOrder = -1;
                            //         sortRow[2].img = 'img/sample/category/sort.svg';
                            //
                            //         sortSelect = 1;
                            //         // todo sort by 銷量 目前沒有
                            //         gvc.notifyDataChange('sortBar');
                            //         gvc.notifyDataChange('cardGroup');
                            //     }
                            // },
                            (()=>{
                                const map={
                                    text: '價格', img: new URL('../img/sample/category/sort.svg',import.meta.url).href, click: (e:HTMLElement) => {
                                        if (!origData){
                                            origData = glitter.share.productData;
                                        }
                                        //
                                        sortSelect = 1;
                                        sortPriceOrder *= -1;
                                        if (sortPriceOrder==1){
                                            map.img = new URL('../img/sample/category/sortSmaller.svg',import.meta.url).href ;
                                        }else if (sortPriceOrder){
                                            map.img = new URL('../img/sample/category/sortHigher.svg',import.meta.url).href ;
                                        }
                                        glitter.share.productData.sort((a:ProductData, b:ProductData)=>(a.sale_price - b.sale_price) * sortPriceOrder);
                                        gvc.notifyDataChange('sortBar');
                                        gvc.notifyDataChange('cardGroup');
                                    }
                                }
                                return map
                            })()
                        ]
                        return (()=>{
                            let topInset: number = 0
                            let bottomInset: number = 0
                            glitter.runJsInterFace("getTopInset", {}, (response) => {
                                topInset=response.data
                                gvc.notifyDataChange(['nav','ddd'])
                            }, {
                                webFunction: () => {
                                    return {data: 0}
                                }
                            })
                            glitter.runJsInterFace("getBottomInset", {}, (response) => {
                                if (bottomInset != response.data){
                                    bottomInset=response.data;
                                    gvc.notifyDataChange("footer")
                                }
                            }, {
                                webFunction: () => {
                                    return {data: 20}
                                }
                            })

                            return gvc.bindView({
                                bind: `mainView`,
                                view: () => {
                                    if (topInset !== undefined && bottomInset !== undefined) {
                                        return /* HTML */ `
                        <nav class="bg-white w-100 position-fixed z-index-99"  style="padding-top: ${topInset - 20}px;width: 100vw;box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);z-index: 9999;">
                            <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0px;height: 63px; padding: 0 16px; background: #FFFFFF;position:relative;">
                                <div class="me-auto p-0 d-flex align-items-center" style="">
                                    <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1676803803897" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                            //todo 回哪裡
                                            glitter.goBack()
                                        })}">
                                </div>
                                <div class=" d-flex align-items-center justify-content-center translate-middle-y translate-middle-x" style="color: #292929;;position: absolute;top: 50%;   font-family: 'Noto Sans TC';font-style: normal;font-size: 16px;font-weight: 700;">
                                    ${title}
                                </div>
                         
                            </div>
                            <banner style="">
                               ${((gBundle.object.subCategory ?? []).length>0) ? viewModel.setSubCategoryRow(gBundle.parent_category_id):``}
    <!--                            todo 之後如果有需要要加東西-->
                                ${gvc.bindView({
                                            bind: 'sortBar',
                                            view: () => {
                                                let returnHTML = ``;
                                                sortRow.forEach((element, index: number) => {
                                                    let style = (index == sortSelect) ? "color: #292929;font-weight: 500;" : ""
                                                    returnHTML += `
                                    <div class="sortRawText" style="padding: 0 24px;${style}" onclick="${gvc.event((e)=>{
                                                        element.click(e);
                                                    })}">
                                        ${element.text}
                                        ${gvc.bindView({
                                                        bind: "",
                                                        view: () => {
                                                            if (element.img) {
                                                                return `<img src="${element.img}" style="height: 16px;width: 16px;">`
                                                            }
                                                            return ``
                                                        }
                                                    })}
                                    </div>
                                    `
                                                    //直槓
                                                    if (index != sortRow.length - 1) {
                                                        returnHTML += `
                                                <div style="background: #858585; height: 5px;width: 1px;"></div>
                                            `
                                                    }
                                                })
                                                return returnHTML
                                            },
                                            divCreate: {style: `margin-top:${(((gBundle.object.subCategory ?? []).length>0) ? 24:0)}px;padding-bottom:9px;`, class: `d-flex align-items-center`}
                                        })}
                            </banner>       
                        </nav>
                        <main style="background: white;padding-top:${topInset - 20 + (((gBundle.object.subCategory ?? []).length>0) ? 150:120)}px;padding-left: 23px;padding-right: 23px;">
                            ${gvc.bindView({
                                            bind: "cardGroup",
                                            view: () => {
                                                if (viewModel.loading) {
                                                    let returnHTML = `<div class="w-100">
            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                <div class="spinner-border" role="status"></div>
            </div>
        </div>`;
                                                    return returnHTML
                                                } else {
                                                    return new glitter.htmlGenerate([
                                                        {
                                                            "id": "s4sas4s0sesbs6s3-sasds2se-4s3scs6-s8s8s1sa-s3sascs6s6s0sds5s3sfs0s7",
                                                            "js": "$homee/official/official.js",
                                                            "data": {
                                                                "class": "m-0 p-0 flex-wrap justify-content-around",
                                                                "style": "gap:10px;",
                                                                "layout": "d-flex",
                                                                "marginB": "86px",
                                                                "marginL": "0px",
                                                                "marginR": "0px",
                                                                "setting": viewModel.product.map((dd:any)=>{
                                                                    return {
                                                                        "id": "sas0sesbs3sds2sa-s7s4s4sf-4s9sesa-sases9sf-sfs3s0s6sfs2s6sasasfscs1",
                                                                        "js": "$homee/homee/homee_home.js",
                                                                        "data": {
                                                                            "data": {
                                                                                "id": dd.id,
                                                                                "name": dd.name,
                                                                                "price": dd.price,
                                                                                "quantity": dd.quantity,
                                                                                "sale_price": dd.sale_price,
                                                                                "preview_image": dd.preview_image
                                                                            },
                                                                            "style": "\n",
                                                                            "paddingL": "",
                                                                            "paddingR": "",
                                                                            "clickEvent": {
                                                                                "src": "$homee/homee/event.js",
                                                                                "route": "toProductDetail"
                                                                            }
                                                                        },
                                                                        "type": "productItem",
                                                                        "label": "商品",
                                                                        "route": "homee_home",
                                                                        "style": "width:calc(50% - 8px);",
                                                                        "expandStyle": false,
                                                                        "refreshAllParameter": {},
                                                                        "refreshComponentParameter": {}
                                                                    }
                                                                }),
                                                                "paddingB": "16px",
                                                                "paddingL": "",
                                                                "paddingR": ""
                                                            },
                                                            "type": "container",
                                                            "class": " ",
                                                            "label": "元件容器",
                                                            "route": "Glitter",
                                                            "style": ""
                                                        }
                                                    ], []).render(gvc);
                                                }

                                            },
                                            divCreate: {style: `padding-top:20px;`, class: ``}
                                        })}
                        </main>                         
                        `
                                    } else {
                                        return `
                            
                        `
                                    }

                                }, divCreate: {class: ``, style: `min-height : 100vh;padding-bottom:100px;`},
                                onCreate: () => {
                                    if(viewModel.loading){
                                        const id=[{name:"全部",id:gBundle.object.value}].concat((gBundle.object.subCategory ?? []).map((dd:any)=>{
                                            return {name:dd.title,id:dd.value}
                                        }))[viewModel.select].id
                                        new Category(glitter).getCategoryData("sub_category_id",id,(response)=>{
                                            viewModel.product=response
                                            viewModel.loading=false
                                            gvc.notifyDataChange('cardGroup')
                                        })
                                    }

                                }
                            })
                        })()
                    },
                    editor:()=>{
                        return ``
                    }
                }
            }
        }
    }
});