(() => {
    const glitter = (window as any).glitter

    interface HtmlJson {
        rout: string,
        type: string,
        id: string,
        label: string,
        data: any,
        js: string,
        refreshAll: () => void,
        refreshComponent: () => void
    }

    const obj: { [name: string]: { defaultData: any, render: (gvc: any, widget: HtmlJson, setting: HtmlJson[], hoverID: string[]) => void } }
        =
        {
            nav:{
                defaultData:{
                    searchDefault:"大家都在搜尋:"
                },
                render:(gvc: any, widget: HtmlJson, setting: HtmlJson[])=>{
                    gvc.addStyle(`
                    .search-bar{
                        /* Noto Sans TC - Regular - 14 */
            
                        font-family: 'Noto Sans TC',serif;
                        font-style: normal;
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 40px;
                        /* identical to box height, or 21px */
                        margin-right: 16px;
            
                        /* HOMEE grey */
            
                        color: #858585;
            
                        position: relative;
                        height: 40px;
                    }
                    .search-input{
                        padding-left: 40px;
            
                        background: rgba(51, 51, 51, 0.1);
                        border: 1px solid #FFFFFF;
                        border-radius: 20px;
                    }
                    .search-bar .search-icon{
                        position: absolute;
                        left: 10px;
                        top: 10px;
                        width: 20px;
                        height: 20px;
            
                    }
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
                        //分為二 view決定中間該顯示的樣子
                        //editor決定右方供人輸入的樣子
                        view:`
                            <div class="d-flex align-items-center" style="margin-top: ${widget.data.topInset}px;padding: 0 16px;">
                                <img class="" src="${import.meta.resolve!('../img/component/left-arrow.svg',import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                //    todo
                                })}">
                                <div class="search-bar d-flex " style="width: calc(100vw - 60px);">
                                    <img class="search-icon" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061987473" alt="" >
                                    <input class="w-100 search-input" placeholder="${widget.data.searchDefault}" oninput="${gvc.event((e:any)=>{
                                        
                                    })}">
                                </div>
                                <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061894470" style="width: 28px;height: 28px;margin-right: 16px" alt="" onclick="${gvc.event(() => {

                                })}">
                                <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061418331" style="width: 28px;height: 28px;" alt="" onclick="${gvc.event(() => {

                                })}">
                            </div>
                        `,
                        editor:gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "預設搜尋內容",
                                default: widget.data.title,
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
            banner:{
                defaultData:{
                    dataList:[{title:"精選人氣商品" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063161788"},
                        {title:"岩板餐桌系列" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063296082"},
                        {title:"本週新品（ NEW ）" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063314153"}
                    ],
                },
                render:(gvc: any, widget: HtmlJson, setting: HtmlJson[])=>{

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
                        view:`
                            <div class="w-100 d-flex" style="padding: 16px;">
                                <div class="w-50 banner-card" style="margin-right:7px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[0].img});position: relative">
                                    <div class="bannerTitle">${widget.data.dataList[0].title}</div>
                                </div>
                                <div class="w-50 d-flex flex-column" style="margin-left: 7px;">
                                    <div class="banner-card" style="margin-bottom:6px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[1].img});position: relative;">
                                        <div class="bannerTitle">${widget.data.dataList[1].title}</div>
                                    </div>
                                    <div class="banner-card" style="margin-top:6px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[2].img});position: relative;">
                                        <div class="bannerTitle">${widget.data.dataList[2].title}</div>
                                    </div>
                                </div>
                            </div>
                        `,
                        editor:gvc.map(widget.data.dataList.map((dd:any,index:number)=>{
                            return glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `banner標題${index}`,
                                default: dd.title,
                                placeHolder: dd.title,
                                callback: (text: string) => {
                                    widget.data.dataList[index].title = text
                                    widget.refreshAll!()
                                }
                            })+
                            `
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">banner圖片${index}</h3>
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

                            `
                        }))
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
            category:{
                defaultData:{
                    dataList:[{title:"餐桌" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675071897159"},
                        {title:"椅子" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072457700"},
                        {title:"沙發" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072481671"},
                        {title:"茶几" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072593723"},
                        {title:"TERA\n系統儲物" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072618992"},
                        {title:"BANFF\n系統儲物" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072650712"},
                        {title:"床架" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072676832"},
                        {title:"裝飾畫" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072699256"},
                        {title:"生活用品" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072721565"},
                        {title:"全部" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072765031"},
                    ],
                },
                render:(gvc: any, widget: HtmlJson, setting: HtmlJson[])=>{

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
                        view:`
                            <div class="w-100 d-flex flex-wrap justify-content-between" style="">
                                ${()=>{
                                    gvc.bindView({
                                        bind:"cardGroup",
                                        view:()=>{
                                            gvc.map(widget.data.dataList.map((card:any , index:number)=>{
                                                return `
                                                    <div class="d-flex flex-column">
                                                        <div ></div>
                                                    </div>
                                                `
                                            }))
                                            return ``  
                                        },divCreate:{style : "" , class : ""}
                                    })    
                                }}
                            </div>
                        `,
                        editor:``
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
            footer:{
                defaultData:{
                    dataList:[
                        {
                            title : "首頁",
                            icon : import.meta.resolve!('../img/component/footer/home.svg',import.meta.url),
                            click : ()=>{

                            }
                        },
                        {
                            title : "靈感",
                            icon : import.meta.resolve!('../img/component/footer/idea.svg',import.meta.url),
                            click : ()=>{

                            }
                        },
                        {
                            title : "我的空間",
                            icon : import.meta.resolve!('../img/component/footer/myspace.svg',import.meta.url),
                            click : ()=>{

                            }
                        },
                        {
                            title : "購物車",
                            icon : import.meta.resolve!('../img/component/footer/shoopingCart.svg',import.meta.url),
                            click : ()=>{

                            }
                        },
                        {
                            title : "會員",
                            icon : import.meta.resolve!('../img/component/footer/user.svg',import.meta.url),
                            click : ()=>{

                            }
                        },

                    ],
                },
                render:(gvc: any, widget: HtmlJson, setting: HtmlJson[])=>{
                    glitter.runJsInterFace("getTopInset", {}, (response:any) => {
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

                        view:`
                            <footer class="d-flex align-items-center justify-content-around w-100" style="padding-bottom: ${widget.data.bottomInset}px;position: fixed;bottom: 0px;left: 0px;">
                                ${(() => {
                                    return gvc.map(widget.data.dataList.map((data:any , index:number)=>{
                                        return `
                                            <div class="d-flex flex-column align-items-center">
                                                <img src=${data.icon} style="width: 28px;height: 28px;">
                                                <div class="footerTitle ${(() => {if (index==0) return "selected"})()}">${data.title}</div>
                                            </div>
                                        `
                                    }))
                                })()}
                            </footer>
                        `,
                        editor:gvc.map(widget.data.dataList.map((dd:any,index:number)=>{
                            return glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `footer icon ${index}`,
                                    default: dd.title,
                                    placeHolder: dd.title,
                                    callback: (text: string) => {
                                        widget.data.dataList[index].title = text
                                        widget.refreshAll!()
                                    }
                                })+
                                `
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">icon圖片${index}</h3>
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
                        }))
                    }
                }
            }
        }
    glitter.share.htmlExtension["category"] = obj
    glitter.share.htmlExtension["category"].document = {
        title: "category",
        doc: {}
    }
})()
