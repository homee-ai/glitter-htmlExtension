(() => {
    const glitter = (window as any).glitter

    interface HtmlJson {
        route: string,
        type: string,
        id: string,
        label: string,
        data: any,
        js: string,
        class?: string,
        style?: string,
        refreshAll?: () => void,
        refreshComponent?: () => void,
        refreshComponentParameter?: { view1: () => void, view2: () => void }
        refreshAllParameter?: { view1: () => void, view2: () => void }
    }
    const api={
        upload:(photoFile:any,callback:(link:string)=>void)=>{
            glitter.share.dialog.dataLoading({text:'上傳中',visible:true})
            $.ajax({
                url: glitter.share.apiPrefix+'/api/v1/scene/getSignedUrl',
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
    glitter.share.htmlExtension["Glitter"] = {
        /*****Layout*****/
        container: (gvc: any, widget: HtmlJson, setting: HtmlJson[],hoverID:string[]=[]) => {
            const htmlGenerate = new glitter.htmlGenerate(widget.data.setting,hoverID);
            return {
                view: htmlGenerate.render(gvc, {class:`${widget.data.layout} ${widget.data.class}`,style:`${widget.data.style}`}),
                editor: (() => {
                    return gvc.map([
                        `<div class="my-2"></div>
<span class="w-100 mb-2 fw-500 mt-2 " style="color: orange;">排版方式</span>
<select class="form-select mt-2" onchange="${gvc.event((e:any) => {
                            widget.data.layout=e.value
                            widget.refreshAll!()
                        })}" >
${(() => {
                            const data = [
                                {tit: "d-block", value: `d-block`},
                                {tit: "d-inline-block", value: `d-inline-block`},
                                {tit: "d-inline-flex", value: `d-inline-flex`},
                                {tit: "d-flex", value: `d-flex`},
                                {tit: "row", value: `row`},
                            ]

                            return gvc.map(data.map((it) => {
                                return `<option value="${it.value}" ${(widget.data.layout === it.value) ? `selected`:``} >${it.tit}</option>`
                            }))
                        })()}
</select>
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="form-control" value="${widget.data.class ?? ""}" onchange="${gvc.event((e:any)=>{
                            widget.data.class=e.value
                            widget.refreshAll!()
                        })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="form-control" value="${widget.data.style ?? ""}" onchange="${gvc.event((e:any)=>{
                            widget.data.style=e.value
                            widget.refreshAll!()
                        })}">
`, (() => {
                            if (widget.data.setting.length > 0) {
                                return htmlGenerate.editor(gvc, {
                                    return_: true,
                                    refreshAll: widget.refreshAll!
                                })
                            } else {
                                return ``
                            }
                        })()
                    ])

                })()
            }
        },
        /************/
        image:(gvc: any, widget: HtmlJson, setting: HtmlJson[])=>{
            return {
                view:` <img class="w-100 ${widget.data.layout} ${widget.data.class}" style="${widget.data.style}" src="${widget.data.link ?? `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`}"
 >`,
                editor:`
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="form-control" value="${widget.data.class ?? ""}" onchange="${gvc.event((e:any)=>{
                    widget.data.class=e.value
                    widget.refreshAll!()
                })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="form-control" value="${widget.data.style ?? ""}" onchange="${gvc.event((e:any)=>{
                    widget.data.style=e.value
                    widget.refreshAll!()
                })}">
<div class="mt-2"></div>
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片連結</h3>
<div class="mt-2"></div>
<div class="d-flex align-items-center mb-3">
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.link}">
<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                    glitter.ut.chooseMediaCallback({
                        single:true,
                        accept:'image/*',
                        callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                            api.upload(data[0].file,(link)=>{
                                widget.data.link=link;
                                widget.refreshAll!()
                            })
                        }
                    })
                })}"></i>
</div>
                `
            }
        }
    };

    glitter.share.htmlExtension["Glitter"].document={
        title:"Glitter官方插件",
        doc:{
            container:{
                title:`區塊容器`,
                doc:`test.`
            }
        }
    }
})()

