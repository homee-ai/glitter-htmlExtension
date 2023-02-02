'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
Plugin.create(import.meta.url,(glitter)=>{
    function escape (text: string){
        return text.replace(/&/g, '&').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "'");
    }
    return {
        container: {
            defaultData:{
                setting:[]
            },
            render:(gvc, widget, setting, hoverID) => {
                widget.data.setting = widget.data.setting ?? []
                const htmlGenerate = new glitter.htmlGenerate(widget.data.setting,hoverID);
                return {
                    view: ()=>{
                        return htmlGenerate.render(gvc, {class:`m-0 ${widget.data.layout} ${widget.data.class}`,style:`${widget.data.style}`})
                    },
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

                    })
                }
            }
        },
        image:{
            defaultData:{},
            render:(gvc, widget, setting, hoverID)=>{
                widget.data.clickEvent=widget.data.clickEvent ?? {}
                return {
                    view:()=>{
                        return ` <img class="w-100 ${widget.data.layout} ${widget.data.class}" style="${widget.data.style}" src="${widget.data.link ?? `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`}"
                        onclick="">`
                    },
                    editor:()=>{
                        return `
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
                                    glitter.share.publicInterface["glitter"].upload(data[0].file,(link:string)=>{
                                        widget.data.link=link;
                                        widget.refreshAll!()
                                    })
                                }
                            })
                        })}"></i>
</div>
${ClickEvent.editer(gvc,widget,widget.data.clickEvent)}
                `
                    }
                }
            }
        },
        label:{
            defaultData:{},
            render:(gvc, widget, setting, hoverID)=>{
                return {
                    view:()=>{
                        return `<h3 style="${widget.data.style ?? ""}" class="${widget.data.class ?? ""}">${widget.label}</h3>`
                    },
                    editor:()=>{
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc, title: "Class", default: widget.data.class, placeHolder: "請輸入Class", callback: (text:string) => {
                                    widget.data.class=text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeText({
                                gvc: gvc, title: "Style", default: widget.data.style , placeHolder: "請輸入標題Style", callback: (text:string) => {
                                    widget.data.style=text
                                    widget.refreshAll()
                                }
                            })
                        ])
                    }
                }
            }
        }
    }
});



