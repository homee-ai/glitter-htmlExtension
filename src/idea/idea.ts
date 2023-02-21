'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {Api} from "../homee/api/homee-api.js";
import {ViewModel} from "./view/ideaViewApi.js";
import {Idea, IdeaData} from "./api/idea.js";
import {Dialog} from "../homee/legacy/widget/dialog.js";
import {SharedView} from "../homee/shareView.js";
import {appConfig} from "../config.js";
function getDateDiff(a:any){return ``}
function detectIMG(a:any){return ``}
Plugin.create(import.meta.url,(glitter)=>{
    const api={
        upload:(photoFile:any,callback:(link:string)=>void)=>{
            // glitter.share.dialog.dataLoading({text:'上傳中',visible:true})
            $.ajax({
                url: Api.serverURL+'/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name:`${new Date().getTime()}`}),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.getCookieByName('token') },
                success: (data1: { url: string; fullUrl: string }) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2: any) => {
                            glitter.share.dialog.dataLoading({visible:false})
                            glitter.share.dialog.successMessage({text:"上傳成功"})
                            callback(data1.fullUrl)
                        },
                        error: (err: any) => {
                            glitter.share.dialog.successMessage({text:"上傳失敗"})
                        },
                    });
                },
                error: (err: any) => {
                    glitter.share.dialog.successMessage({text:"上傳失敗"})
                },
            });
        }
    }
    return {
        mainPage: {
            defaultData:{
                ideaPostData:undefined,

            },
            render:(gvc, widget, setting, hoverID) => {
                const vm = {loading: true}
                const viewModel = new ViewModel(gvc)
                const ideaAPI = new Idea(gvc.glitter);
                const dialog=new Dialog(gvc)
                let shareView = new SharedView(gvc)
                let ideaPostData:IdeaData[]
                let charCount = '';
                let noticeOpen = false;
                let viewType = '' //原先是gBundle.user
                let viewLoading = false;
                let userData :any;
                initGetData();
                // getCharNumber();
                function initGetData() {
                    vm.loading=true;
                    appConfig().getUserData({
                        callback: (response: any) => {
                            userData = response;
                            gvc.notifyDataChange('mainView')
                        }})
                    gvc.notifyDataChange('mainView')
                    //todo 判斷進入怎樣的idea主頁的方法沒動
                    ideaAPI.getData((()=>{
                        // switch (gBundle.viewType) {
                        //     case "user":
                        //         const dd=gBundle.data as UserData
                        //         return {
                        //             poster_id: dd.userID,
                        //             idea_id:gBundle.idea_id
                        //         }
                        //     default:
                        //         return {
                        //             poster_id:gBundle.poster_id,
                        //             idea_id:gBundle.idea_id
                        //         }
                        // }
                        //todo 這裡要改回 userData.user_id 這邊先抓測試端的資料
                        return {
                            poster_id:"12052350",
                            idea_id:""
                        }
                    })(),(response) => {
                        vm.loading = false
                        widget.data.ideaPostData = response
                        // ideaPostData = response
                        response.map((data)=>{
                            data.posterPhoto = (data["photo"]) ? data["photo"] : `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${data['last_name']}&txtfont=Helvetica&txtalign=middle,center`
                            data.poster =  data['last_name'] + data['first_name']
                            //判斷是否按讚
                            ideaAPI.detectLike(data.idea_id, (response) => {
                                data.dislike = response
                                gvc.notifyDataChange(`toolBar${data.idea_id}`)
                            })
                            //取得文章留言
                            ideaAPI.getMessage({
                                idea_id: data.idea_id,
                                count: true
                            }, (response) => {
                                data['messageCount'] = response.messageCount;
                                // data['message'] = response.message
                                // gvc.notifyDataChange(`message${data.idea_id}`)
                            })
                            //取得按讚數量
                            ideaAPI.getLikeCount(data.idea_id, (response) => {
                                data.likeCount = response
                                gvc.notifyDataChange(`likeCount${data.idea_id}`)
                            })
                        })
                        gvc.notifyDataChange('mainView')
                    })
                }
                function getCharNumber() {
                    glitter.runJsInterFace("getCharNumber", {}, function (response) {
                        if(response.charNumber){
                            charCount = `
                        <div class="chatCount d-flex justify-content-center align-items-center" style="width: 16px;height: 16px;background: #FD6A58;position: absolute;right:-6px;top: -6px;z-index: 2;border-radius: 50%">
                             ${response.charNumber}
                        </div>`
                        }
                        gvc.notifyDataChange('nav');
                        // console.log(document.querySelector(''))
                        // glitter.setHome('jsPage/idea/idea_post.js',"idea_post",response)
                    }, {
                        webFunction(data: {}): any {
                            return {
                                charNumber: 3
                            }

                        }
                    })
                }
                function changeSearch() {
                    //todo  帶歷史資料
                    glitter.changePage("jsPage/idea/idea_search.js", "idea_search", true, {})
                    // glitter.setHome('jsPage/idea/idea_search.js','idea_search',{})
                }
                function createIdea() {
                    glitter.openDiaLog('component/idea/ideaAdd.js','ideaAdd',{},{animation:glitter.animation.topToBottom})
                }


                return {
                    view: ()=>{

                        gvc.addStyle(`
                        html{
                            margin: 0;
                            box-sizing: border-box;
                        }
                        body{
                         padding:0;
                         margin:0;
                        }
                
                        main{
                           font-family: 'Noto Sans TC';
                        }
                        .chatCount{
                            background: #FD6A58;
                            line-height:100%;
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 500;
                            font-size: 10px;
                            line-height: 14px;
                            color:white;
                       `)
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                var nava=(()=>{
                                    switch (viewType){
                                    case 'user':
                                        // var data=gBundle.data as UserData
                                        //${data.name}的貼文

                                        return shareView.navigationBar({
                                            title: `${userData.name}的貼文`,
                                            leftIcon:`<img class="" src="${new URL!(`../img/component/left-arrow.png`, import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(()=>{
                                                glitter.goBack()
                                            })}">`,
                                            rightIcon:``
                                        })
                                    default:
                                        return shareView.navigationBar({
                                            title: "靈感",
                                            leftIcon:`<div class="me-auto p-0 d-flex align-items-center " style="width: 116px;">
                                                <img class="me-auto my-auto" src="${new URL!(`../img/search-black.svg`, import.meta.url)}" style="width: 20px;height: 20px;" onclick="${gvc.event(() => {
                                                    changeSearch()
                                                })}">
                                            </div>`,
                                            rightIcon:`
                                                <div style="width: 23px;height: 23px; position: relative;margin: 0 16px 0 0;">
                                                    <img src="${new URL!(`../img/plus.svg`, import.meta.url)}" style="width: 23px;height: 23px;" onclick=" ${
                                                        gvc.event(() => {
                                                            createIdea()
                                                    })}">
                                                </div>       
                                                <div style="width: 23px;height: 23px; position: relative;margin: 0 16px 0 0;">
                                                    <div class="redDot d-none" style="width: 10px;height: 10px;background: #FD6A58;position: absolute;right:0;top: 0;z-index: 2;border-radius: 50%"></div>
                                                    <img src="${new URL!(`../img/sample/idea/notify.svg`, import.meta.url)}"   class="w-100 h-100" onclick="${gvc.event(() => {
                                                        glitter.runJsInterFace("noticeBell", {}, () => {
                                                            if (!noticeOpen){
                                                                noticeOpen = true;
                                                                glitter.openDiaLog("jsPage/dialog/noticeBell.js","noticeList" , {},{animation:glitter.animation.fade})
                                                            }else {
                                                                noticeOpen = false;
                                                                glitter.closeDiaLog("noticeList")
                                                            }
        
        
                                                        })
                                                    })}">
                                                </div>
                                                <div style="width: 23px;height: 23px;position:relative;" class="" >                                                 
                                                    <img src="${new URL!(`../img/sample/idea/chat.svg`, import.meta.url)}" style="width: 23px;height: 23px;" onclick="${gvc.event(()=>{
                                                        dialog.showInfo('共同搭配功能即將上線，敬請期待!')
                                                    })}">
                                                </div>`
                                        })
                                }})()
                                if (!vm.loading) {
                                    return  `
                                    ${nava}
                                    <main style="">
                                        ${(() => {
                                            let model = {
                                                loading: true,
                                                data: [],
                                            }
                                            let id = 'postGroup'
                                            //方法
    
                                            //畫面
                                            return gvc.bindView({
                                                bind: id,
                                                view: () => {
                                                    
                                                    if (widget.data.ideaPostData) {
                                                        
                                                        
                                                        return viewModel.postView(widget.data.ideaPostData , userData);
                                                    } else {
                                                        return ``
                                                    }
    
                                                },
                                                divCreate: {
                                                    class: `main`,
                                                    style: `box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);border-radius: 20px;padding-bottom:60px;`
                                                },
                                                onCreate: () => {
                                                    gvc.addMtScript([{
                                                        src: 'https://cdnjs.cloudflare.com/ajax/libs/pulltorefreshjs/0.1.22/index.umd.js'
                                                    }], () => {
                                                        let iCount = 0
                                                        //下拉更新
                                                        // @ts-ignore
                                                        const ptr = PullToRefresh.init({
                                                            mainElement: `.main`,
                                                            triggerElement : `.trigger`,
                                                            onRefresh() {
                                                                iCount++;
                                                                initGetData();
                                                            }
                                                        });
    
                                                    }, () => {
                                                    })
                                                }
                                            })
                                        })()}
                                    </main> `
                                } else {
                                    return `
                                    ${nava}
                                    <div class="w-100 translate-middle-y position-absolute " style="top: 50%;"> ${viewModel.loadingView()}</div>
                                   `
                                }


                            },
                            divCreate: {class: ``, style: ``},
                            onCreate: () => {
                                //
                                // PullToRefresh.init({
                                //     mainElement: '#main',
                                //     onRefresh: function() { alert('refresh') }
                                // });
                            }
                        })

                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        board: {
            defaultData:{

            },
            render:(gvc, widget, setting, hoverID) => {

                return {
                    view: ()=>{
                        gvc.addStyle(`          
                        main{
                            padding-bottom:70px;
                        }
                        .intro{
                            padding:16px;
                            word-break: break-all;
                            white-space:normal;
                        }
                        .posterPhoto{
                            width:36px;
                            height:36px;
                
                        }
                        .introBlock{
                            margin-left:8px;
                        }
                        .intro-text{
                            /* Noto Sans TC - Regular - 12 */
                
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                
                            /* HOMEE black */
                
                            color: #292929;
                        }
                        .intro-text .poster{
                
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 12px;
                            line-height: 17px;
                
                            /* HOMEE black */
                
                            color: #292929;
                        }
                        .intro-date{
                            /* Noto Sans TC - Regular - 12 */
                
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                
                            /* HOMEE grey */
                
                            color: #858585;
                        }
                        .leaveRow{
                                width:100%;
                                /* Noto Sans TC - Regular - 14 */
                
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 150%;
                
                                padding:8px 24px;
                
                
                                background: #FFFFFF;
                                box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);
                                border-radius: 30px 30px 0px 0px;
                                position:fixed;
                                bottom:0px
                
                        }
                        .leaveInput{
                            /* HOMEE light grey */
                
                            border: 1px solid #D6D6D6;
                            border-radius: 20px;
                
                            /* Noto Sans TC - Regular - 12 */
                
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                
                            /* HOMEE light grey */
                
                            color: #292929;
                
                            padding-left:8px;
                        }
                        .leaveBTN{
                            color: #00A3FF;
                            opacity: 0.3;
                            position: absolute;
                            right: 40px;
                            top: calc(50% - 8px)
                        }
                        .leaveEvent{
                            opacity: 1;
                        }
                        .date{
                            /* Noto Sans TC - Regular - 12 */
                
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                
                            /* HOMEE grey */
                
                            color: #858585;
                        }
                        .HOMEE-grey{
                            color: #858585;
                        }
                
                       `)
                        console.log("here")
                        console.log(gvc.parameter.pageConfig?.obj.data.postData)

                        let data = gvc.parameter.pageConfig?.obj.data.postData as IdeaData;
                        let vm = {
                            id: glitter.getUUID(),
                            loading: true,
                            dataList: <any>[],
                        };
                        const dialog=new Dialog(gvc)
                        const ideaApi = new Idea(glitter)
                        const viewModel=new ViewModel(gvc)
                        let shareView = new SharedView(gvc)
                        let topInset: number = 0
                        let bottomInset:number = 0
                        let userData:any;
                        function getData() {
                            vm.loading=true
                            gvc.notifyDataChange('mainView')
                            ideaApi.getMessage({
                                count: false,
                                idea_id: data.idea_id
                            }, (response) => {

                                data.message = response.message
                                vm.loading = false
                                gvc.notifyDataChange('mainView')
                                document.body.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: 'smooth'
                                })
                            })
                        }
                        //輸入的時間必須是 YYYY/MM/DD的格式
                        function getDateDiff(dateTimeStamp: number): string {
                            let minute = 1000 * 60;
                            let hour = minute * 60;
                            let day = hour * 24;
                            let halfamonth = day * 15;
                            let month = day * 30;
                            let now = new Date().getTime();
                            let timestamp = new Date((new Date(dateTimeStamp)).getTime() + 8 * 60 * 60 * 1000).getTime()
                            let diffValue = now - timestamp;
                            if (diffValue < 0) {
                                return "";
                            }
                            let monthC = diffValue / month;
                            let weekC = diffValue / (7 * day);
                            let dayC = diffValue / day;
                            let hourC = diffValue / hour;
                            let minC = diffValue / minute;
                            let result = undefined;

                            if (monthC >= 1) {
                                result = `${parseInt(monthC.toString())}月前`;
                            } else if (weekC >= 1) {
                                result = `${parseInt(weekC.toString())}周前`;
                            } else if (dayC >= 1) {
                                result = `${parseInt(dayC.toString())}天前`;
                            } else if (hourC >= 1) {
                                result = `${parseInt(hourC.toString())}小時前`;
                            } else if (minC >= 1) {
                                result = `${parseInt(minC.toString())}分鐘前`;
                            } else
                                result = "剛剛";
                            return result;
                        }
                        //留言事件
                        function leaveEvent() {
                            let leaveBTN = document.querySelector('.leaveBTN');
                            let input = document.querySelector('.leaveInput') as HTMLInputElement;
                            if (input.value == "") {
                                if (leaveBTN?.classList.contains('leaveEvent')) {
                                    leaveBTN.classList.remove('leaveEvent')
                                }
                            } else {

                                if (!leaveBTN?.classList.contains('leaveEvent')) {

                                    leaveBTN?.classList.add('leaveEvent')
                                }
                            }
                        }
                        //轉換內容至圖片
                        function detectIMG(content: any): string {
                            if (content["appendix"]) {
                                return `
                                <div class="" style="max-width: 320px; background: #292929;border-radius: 20px;background:50% / cover url(${content["appendix"]});width: 100%;
                                padding-bottom: 60%;margin-top: 10px;" onclick="${gvc.event(()=>{
                                    const dd={
                                        config: JSON.stringify(content.config),
                                        scene: content.scene,
                                        userName:data.poster
                                    }
                                    glitter.runJsInterFace("leaveModelToBoard", dd, function (response) {
                                        let jsonData = {
                                            idea_id: data["idea_id"],
                                            messager: glitter.share.userData.user_id,
                                            content: {
                                                appendix: `${response["preview_image"]}`,
                                                scene: response["scene"],
                                                config: JSON.parse(response["config"]),
                                            }
                                        }
                                        dialog.dataLoading(true)
                                        $.ajax({
                                            url: `${glitter.share.apiURL}/api/v1/idea/board`,
                                            type: 'POST',
                                            data: JSON.stringify(jsonData),
                                            contentType: 'application/json; charset=utf-8',
                                            headers: {Authorization: glitter.share.userData.AUTH},
                                            success: (resposnse: any) => {
                                                dialog.dataLoading(false)
                                                getData()
                                            },
                                            error: () => {
                                            },
                                        });

                                    }, {
                                        webFunction(data: {}): any {
                                            return {
                                                preview_image: "img/sample/idea/postimg.png",
                                                scene: "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz",
                                                config: JSON.parse(JSON.stringify({
                                                    "id": "E9ED7F76-116D-42A3-B616-C83684F36F01",
                                                    "key": "hhh",
                                                    "data": [{
                                                        "x": -1.5339330434799194,
                                                        "y": -1.2596129179000854,
                                                        "z": -0.35074079036712646,
                                                        "prodult": {
                                                            "id": 7324687,
                                                            "sku": "F010060-1-1",
                                                            "name": "MARSILLY 餐椅",
                                                            "spec": "",
                                                            "price": 4890,
                                                            "multiple": false,
                                                            "is_select": false,
                                                            "model_url": "https://machi-app.com/api/v1/assets/sku/20221027T020021-F010060-1-1.usdz",
                                                            "select_count": 1,
                                                            "preview_image": "https://cdn.store-assets.com/s/349867/i/41820128.png?width=720"
                                                        },
                                                        "rotation": 0
                                                    }],
                                                    "rout": "Documents/MySpace/1668048250482.usdz",
                                                    "time": 689741055.022742,
                                                    "store_time": "2022-11-10 10:44:15",
                                                    "server_rout": "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz"
                                                }))
                                            }
                                        }
                                    })
                                })}">
                                </div>
                            `

                            } else {
                                return content["text"] as string
                            }
                        }
                        getData();

                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                if (!userData){
                                    appConfig().getUserData({
                                        callback: (response: any) => {
                                            userData = response;
                                            gvc.notifyDataChange('mainView')
                                        }})
                                }

                                glitter.runJsInterFace("getTopInset", {}, (response) => {
                                    if (topInset!=response.data){
                                        topInset = (response.data);
                                        gvc.notifyDataChange('mainView');
                                    }

                                }, {
                                    webFunction: () => {
                                        return {data: 10}
                                    }
                                })
                                glitter.runJsInterFace("getBottomInset", {}, (response) => {
                                    if (bottomInset != response.data){
                                        bottomInset = (response.data)
                                        gvc.notifyDataChange('mainView')
                                    }

                                }, {
                                    webFunction: () => {
                                        return {data: 10}
                                    }
                                })
                                if (topInset !== undefined  && bottomInset !== undefined) {
                                    console.log("OKK")
                                    return `

                                    ${shareView.navigationBar({
                                        title: "留言",
                                        leftIcon:`<img class="" src="${new URL!(`../img/component/left-arrow.png`, import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                            glitter.goBack("idea")
                                        })}">`,
                                        rightIcon:`
                                            <img src="${new URL!(`../img/component/send.svg`, import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                        `
                                    })}
                                    <main class="d-flex flex-column" style="">
                                        <div class="intro d-flex" style="border-bottom: 1px solid #D6D6D6;">
                                            <div class="posterPhoto rounded-circle" style="width: 48px;height: 48px;background: 50% / cover url('${data['posterPhoto']}') no-repeat;" onclick="${gvc.event(()=>{
                                                // glitter.changePage("jsPage/idea/idea_profile.js", "idea_profile", true, {
                                                //     poster_id : data['poster_id']
                                                // })
                                            })}"></div>
                                            <div class="introBlock">
                                                <div class="intro-text">
                                                    <span class="poster">${data['poster']}</span>
                                                    ${data?.['content']?.['intro']}
                                                </div>
                                                <div class="intro-date">${getDateDiff(data?.['datetime'])}</div>
                                            </div>
                                        </div>
                                        <div class="w-100" style="margin-bottom:${bottomInset + 100}px;">  
                                            ${(()=>{
                                                if(vm.loading){
                                                    return viewModel.loadingView()
                                                }else{
                                                    let messageArray = data["message"];
                                                    let returnHTML = ``
                    
                                                    messageArray.forEach((item: any) => {
                                                        item.photo = item.photo ?? `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${data['last_name']}&txtfont=Helvetica&txtalign=middle,center"`                                                             
                                                        returnHTML += `
                                                        <div class="intro d-flex" style="">
                                                            <div class="posterPhoto rounded-circle" style="width: 36px;height: 36px;background: 50% / cover url('${item.photo}') no-repeat;" onclick="${gvc.event(()=>{
                                                                glitter.changePage("jsPage/idea/idea_profile.js", "idea_profile", true, {
                                                                    poster_id:item.messager_id
                                                                })
                                                            })}"></div>
                                                            <div class="introBlock" style="width: calc(100% - 50px);">
                                                                <div class="intro-text w-100 d-flex " style="word-break: break-all;white-space: normal;overflow-x: hidden;">
                                                                    <span class="poster" style="margin-right: 8px;white-space: nowrap;">${item['last_name'] + item['first_name']}</span>
                                                                    ${detectIMG(item['content'])} 
                                                                </div>
                                                                <div class="intro-date d-flex align-items-end">${getDateDiff(item['time'])}</div>
                                                            </div>
                                                        </div>
                                                    `
                                                        })
                                                    return returnHTML
                                                }
                                            })()}
                                        </div>
                                         <!--發布-->
                                        ${gvc.bindView(() => {
                                            let message: 
                                            {
                                                idea_id: string,
                                                messager: string,
                                                content: {
                                                    appendix: string,
                                                    text: string
                                                }
                                            } = 
                                            {
                                                idea_id: data.idea_id,
                                                messager: userData.user_id,
                                                content: {
                                                    appendix: '',
                                                    text: ''
                                                }
                                            }
                                            
                                            return {
                                                bind: `senderMessage`,
                                                view: () => {
                                                   
                                                    var sendView=glitter.getUUID()
                                                    return `
                                                    <div id="${sendView}" class="d-flex leaveRow" style="position: fixed;bottom: ${bottomInset + 48}px;">
                                                        <div class="posterPhoto rounded-circle" style="width: 48px;height: 48px;margin-right: 8px;background: 50% / cover url('${userData['photo']}') no-repeat;"></div>
                                                        <div class="flex-fill leaveInput d-flex align-items-center" >
                                                        <!--發佈欄-->
                                                            <div class="w-100 my-auto d-flex align-items-center HOMEE-grey" contenteditable="true" style="line-height: 34px;border: none;background: transparent;margin-right: 50px;word-break: break-word;white-space: normal" onblur="${gvc.event((e) => {
                                                                $(`#${sendView}`).css('bottom',`${bottomInset + 48}px`);
                                                                    message.content.text = e.innerHTML
                                                                    if (message.content.text === '') {
                                                                        $(e).parent().children('.leaveBTN').removeClass('leaveEvent')
                                                                        e.innerHTML = `以${userData.name}新增留言`;
                                                                        e.classList.add("HOMEE-grey")
                                                                    } else {
                                                                        $(e).parent().children('.leaveBTN').addClass('leaveEvent')
                                                                    }
                                                            })}" onfocus="${
                                                                gvc.event((e)=>{
                                                                $(`#${sendView}`).css('bottom',`${0}px`);
                                                                let text = e.innerHTML;
                                                                if (text == `<span>以${userData.name}新增留言</span>`){
                                                                    e.classList.remove("HOMEE-grey");
                                                                }
                                                                $(e).parent().children('.leaveBTN').addClass('leaveEvent')
                                                                setTimeout(()=>{
                                                                    e.innerHTML = ``;
                                                                },100)
                                                        })}" onclick="${gvc.event((e)=>{
                                                            e.innerHTML = ``;
                                                            e.classList.remove("HOMEE-grey");
                                                        })}" style="margin-right: 40px;"><span>以${userData.name}新增留言</span></div>
                                    <!--                       發佈按鍵-->
                                                            <div class="leaveBTN ${(message.content.text === '') ? "" : "leaveEvent"}" style="" onclick="${gvc.event((e, event) => {
                                                                if (message.content.text !== '') {
                                                                    ideaApi.leaveMessage(message, (response) => {
                                                                    })
                                                                     message.content.text = ''
                                                                    data.messageCount = (data.messageCount ?? 0) + 1
                                                                    gvc.notifyDataChange(`senderMessage`)
                                                                    getData()
                                                                }
                                                            })}">發佈</div>
                                                      </div>
                                                    </div>
                                                    `
                                                    },
                                                    divCreate: {}
                                                }
                                        })}
                        
                        
                                    </main>
                                `
                                } else {
                                    return `
                                    ${shareView.navigationBar({
                                        title: "留言",
                                        leftIcon:`<img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                            glitter.goBack("idea")
                                        })}">`,
                                        rightIcon:`
                                            <img src="img/sample/idea/send.svg" alt="" style="width: 24px;height: 24px;">
                                        `
                                    })}
                                    ${viewModel.loadingView()}
                                `
                                }
                            },
                            divCreate: {class: ``, style: ``}
                        })
                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        empty: {
            defaultData:{
                link:[]
            },
            render:(gvc, widget, setting, hoverID) => {
                const data: { link: { img: string,code?:string }[] } = widget.data

                return {
                    view: ()=>{return ``},
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },

    }
});