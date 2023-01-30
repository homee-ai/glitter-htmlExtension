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
            title:{
                defaultData:{
                    font:"12345"
                },
                render:(gvc: any, widget: HtmlJson, setting: HtmlJson[])=>{
                    return {
                        view:`<h3 style="color: ${widget.data.color ?? "black"};font-size: ${widget.data.font ?? ""}px;">${widget.data.title}</h3>`,
                        editor:gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "標題",
                                default: widget.data.title,
                                placeHolder: "請帶入標題",
                                callback: (text: string) => {
                                    widget.data.title= text
                                    widget.refreshAll!()
                                }
                            }),
                            `
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">字型大小</h3>
<input class="form-control" placeholder="" onchange="${gvc.event((e:any)=>{
                                widget.data.font=e.value
                                widget.refreshAll!()
                            })}" value="${widget.data.font ?? ""}">
                            `,
                            (()=>{
                                const option=['red','black','yellow','blue']
                                return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">字型顏色</h3>
                            <select class="form-control" onchange="${gvc.event((e:any)=>{
                                    widget.data.color=e.value
                                    widget.refreshAll!()
                                })}">
                            ${gvc.map(option.map((dd)=>{
                                return `<option value="${dd}" ${(dd === widget.data.color) ? `selected`:``}>${dd}</option>`
                                }))}
</select>`
                            })()
                        ])
                    }
                }
            },
            banner: {
                defaultData: {},
                render: (gvc: any, widget: HtmlJson, setting: HtmlJson[]) => {
                    const a = ['1', '2', '3']
                    return {
                        view: `
                    <img src="${widget.data.link}" class="${widget.data.class ?? ""}">
                    `,
                        editor: gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "連結",
                                default: widget.data.link,
                                placeHolder: "請帶入連結",
                                callback: (text: string) => {
                                    widget.data.link = text
                                    widget.refreshAll!()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "Class",
                                default: widget.data.class,
                                placeHolder: "請帶入Class",
                                callback: (text: string) => {
                                    widget.data.class = text
                                    widget.refreshAll!()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "Style",
                                default: widget.data.class,
                                placeHolder: "請帶入Class",
                                callback: (text: string) => {
                                    widget.data.class = text
                                    widget.refreshAll!()
                                }
                            })
                        ])
                    }
                },
            },
        }
    glitter.share.htmlExtension["empty"] = obj
    glitter.share.htmlExtension["empty"].document = {
        title: "empty",
        doc: {}
    }
})()
