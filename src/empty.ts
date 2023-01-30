(() => {
    const glitter = (window as any).glitter
    //每個元件的屬性
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
                    //對widget.data做初值設定 如下對font做設定
                    font:"16"
                },
                render:(gvc: any, widget: HtmlJson, setting: HtmlJson[])=>{
                    return {
                        //分為二 view決定中間該顯示的樣子
                        //editor決定右方供人輸入的樣子
                        view:`<h3 style="color: ${widget.data.color ?? "black"};font-size: ${widget.data.font ?? ""}px;"
                        onclick="${gvc.event(()=>{
                            glitter.addMtScript(['http://127.0.0.1:3090/test/TEST.js'],()=>{
                                glitter.share.apiModel.showAlert()
                            },()=>{})
                        })}">${widget.data.title}</h3>`,
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
    //這裡決定在插件的函式路徑名稱 檔名則影響測試區 正式區呼叫的路徑
    glitter.share.htmlExtension["empty"] = obj
    glitter.share.htmlExtension["empty"].document = {
        title: "empty",
        doc: {}
    }
})()
