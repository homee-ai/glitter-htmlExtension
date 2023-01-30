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

    const obj:{[name:string]:{defaultData:any,render:(gvc: any, widget: HtmlJson, setting: HtmlJson[],hoverID:string[])=>void}}={
        banner: {
            defaultData:{},
            render:(gvc: any, widget: HtmlJson, setting: HtmlJson[]) => {
                const a=['1','2','3']
                return {
                    view: `
                    <img src="${widget.data.link}" class="${widget.data.class ?? ""}">
                    `,
                    editor: gvc.map([
                        glitter.htmlGenerate.editeInput({
                            gvc:gvc,
                            title:"連結",
                            default:widget.data.link,
                            placeHolder:"請帶入連結",
                            callback:(text:string)=>{
                                widget.data.link=text
                                widget.refreshAll!()
                            }
                        }),
                        glitter.htmlGenerate.editeInput({
                            gvc:gvc,
                            title:"Class",
                            default:widget.data.class,
                            placeHolder:"請帶入Class",
                            callback:(text:string)=>{
                                widget.data.class=text
                                widget.refreshAll!()
                            }
                        }),
                        glitter.htmlGenerate.editeInput({
                            gvc:gvc,
                            title:"Style",
                            default:widget.data.class,
                            placeHolder:"請帶入Class",
                            callback:(text:string)=>{
                                widget.data.class=text
                                widget.refreshAll!()
                            }
                        })
                    ])
                }
            },
        },
    }
    glitter.share.htmlExtension["empty"] = obj
    glitter.share.htmlExtension["empty"].document={
        title:"empty",
        doc:{
        }
    }
})()