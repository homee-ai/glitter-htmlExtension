'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {Api} from "../homee/api/homee-api.js";
import {ViewModel} from "./view/ideaViewApi.js";
import {Idea, IdeaData} from "./api/idea.js";
import {Dialog} from "../homee/legacy/widget/dialog.js";
import {SharedView} from "../homee/shareView.js";
import {appConfig} from "../config.js";

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
                getCharNumber();
                function initGetData() {
                    vm.loading=true;
                    appConfig().getUserData({
                        callback: (response: any) => {
                            userData = response;
                            gvc.notifyDataChange('mainView')
                        }})
                    gvc.notifyDataChange('mainView')
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
                                                                console.log(iCount);
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