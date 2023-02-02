import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import { Api } from './api/homee-api.js';
import {LegacyPage} from "./legacy/interface.js";
import {Funnel} from "./funnel.js";
ClickEvent.create(import.meta.url,{
    link:{
        title:"連結跳轉",
        fun:(gvc,widget,object)=>{
            return {
                editor:()=>{
                    return gvc.glitter.htmlGenerate.editeInput({
                        gvc:gvc,
                        title:"連結跳轉",
                        default:object.link,
                        placeHolder:"輸入跳轉的連結",
                        callback:(text:string)=>{
                            object.link=text
                            widget.refreshAll()
                        }
                    })
                },
                event:()=>{
                    /**
                    * 網頁直接跳轉連結，如為APP則打開WEBVIEW
                    * */
                    gvc.glitter.runJsInterFace("openWeb",{
                        url:object.link
                    },(data)=>{ },{
                        webFunction(data: any, callback: (data: any) => void): any {
                            gvc.glitter.openNewTab(object.link)
                            // gvc.glitter.location.href=object.link
                        }
                    })

                }
            }
        }
    },
    category:{
        title:"商品分類",
        fun:(gvc,widget,object)=>{
            return {
                editor:()=>{
                    const api=new Api(gvc)
                    return `
                    <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">選擇分類</h3>
                    ${gvc.bindView(()=>{
                        const id=gvc.glitter.getUUID()
                        const vm={
                            loading:true,
                            colOption:''
                        }
                        function load(){
                            api.homeeAJAX({ route: '/collection', method: 'get' }, (res) => {
                                res.map((x: { id: number; name: string; group: { id: number; name: string }[] }) => {
                                    vm.colOption += /*html*/ `
                                        <option value='${JSON.stringify({
                                        id:x.id,
                                        name:x.name
                                    })}' ${x.name == object.name ? `selected=""` : ``}>
                                            ===== ${x.name} =====
                                        </option>
                                    `;
                                    x.group.map(
                                        (y) =>
                                            (vm.colOption += /*html*/ ` <option
                                                value='${JSON.stringify({
                                                id:y.id,
                                                name:y.name
                                            })}'
                                                ${y.name == object.name ? `selected=""` : ``}
                                            >
                                                ${y.name}
                                            </option>`)
                                    );
                                });
                                gvc.notifyDataChange(id)
                            });
                        }
                        load()
                        return {
                            bind:id,
                            view:()=>{
                                return `<select
                                class="form-select mb-3 "
                                onchange="${gvc.event((e) => {
                                    const val=JSON.parse(e.value)
                                    object.value = val.id;
                                    object.name = val.name;
                                    widget.refreshAll()
                                })}"
                            >
                               ${(vm.colOption === '') ? `<option>${object.name ?? "請稍候..."}</option>`:vm.colOption}
                            </select>`
                            },
                            divCreate:{}
                        }
                    },)}
                    `
                },
                event:()=>{
                    alert('test')
                    LegacyPage.execute(gvc.glitter,()=>{
                        gvc.glitter.changePage(
                            LegacyPage.getLink("jsPage/category/subCategory.js"),
                            "subCategory",
                            true,
                            {title:object.name , parent_category_id:object.value , category:"sub_category_id"  , category_id:object.value , index:0})
                    })

                }
            }
        }
    },
    toProductDetail:{
        title:"商品詳情",
        fun:(gvc, widget, obj)=>{
            const api=new Api(gvc)
            return {
                editor:()=>{
                    const funnel=new Funnel(gvc)
                    return funnel.optionSreach(
                        {
                            path: location.origin+'/api/v1/product?product_name=',
                            key: 'name',
                            def: (obj.data ?? {}).name ?? "",
                            searchData:"product_list"
                        },
                        (res) => {
                            obj.data=res
                            widget.refreshAll()
                        }
                    )
                },
                event:()=>{
                  gvc.glitter.runJsInterFace("toProductPage",{
                      id:obj.data.id
                  },(res)=>{

                  },{
                      webFunction(data: any, callback: (data: any) => void): any {
                          alert('APP會跳轉至商品ID:'+obj.data.id+"的頁面")
                      }
                  })
                }
            }
        }
    }
})
