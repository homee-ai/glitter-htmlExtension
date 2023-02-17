import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {Api} from './api/homee-api.js';
import {LegacyPage} from "./legacy/interface.js";
import {Funnel} from "./funnel.js";
import {DialogHelper} from "../dialog/dialog-helper.js";
import {appConfig} from "../config.js";
ClickEvent.create(import.meta.url, {
    link: {
        title: "連結跳轉",
        fun: (gvc, widget, object) => {return {
                editor: () => {
                    return gvc.glitter.htmlGenerate.editeInput({
                        gvc: gvc,
                        title: "連結跳轉",
                        default: object.link,
                        placeHolder: "輸入跳轉的連結",
                        callback: (text: string) => {
                            object.link = text
                            widget.refreshAll()
                        }
                    })
                },
                event: () => {
                    /**
                     * 網頁直接跳轉連結，如為APP則打開WEBVIEW
                     * */
                    gvc.glitter.runJsInterFace("openWeb", {
                        url: object.link
                    }, (data) => {
                    }, {
                        webFunction(data: any, callback: (data: any) => void): any {
                            gvc.glitter.openNewTab(object.link)
                            // gvc.glitter.location.href=object.link
                        }
                    })

                }
            }}
    },
    pageSwitch: {
        title: "頁面跳轉",
        fun: (gvc, widget, object: { selectPage: { tag?: string, name?: string } }) => {
            return {
                editor: () => {
                    const vm: {
                        loading: boolean,
                        data: { name: string, tag: string }[]
                    } = {
                        loading: true,
                        data: []
                    }
                    const id = gvc.glitter.getUUID()
                    const api = new Api()
                    object.selectPage = object.selectPage ?? {}
                    api.homeeAJAX({
                        api: Api.serverURL,
                        route: '/api/v1/lowCode/pageConfig?query=tag,`group`,name',
                        method: 'get'
                    }, (res) => {
                        vm.data = res.result
                        vm.loading = false
                        gvc.notifyDataChange(id)
                    })
                    return `
<h3 class="m-0 mb-2 mt-2" style="font-size: 16px;">選擇頁面</h3>
${
                        gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    if (vm.loading) {
                                        return `<option value='${JSON.stringify(object.selectPage)}'>${object.selectPage.name ?? "尚未選擇"}</option>`
                                    }
                                    let haveData = false
                                    return gvc.map(vm.data.map((dd) => {
                                        haveData = haveData || object.selectPage.tag === dd.tag
                                        return `<option value='${JSON.stringify(dd)}' ${(object.selectPage.tag === dd.tag) ? `selected` : ``}>${dd.name}</option>`
                                    })) + ((haveData) ? `` : `<option selected>尚未定義</option>`)
                                },
                                divCreate: {
                                    class: `form-control`, elem: `select`, option: [
                                        {
                                            key: 'onChange',
                                            value: gvc.event((e, event) => {
                                                object.selectPage = JSON.parse(e.value)
                                                widget.refreshAll()
                                            })
                                        }
                                    ]
                                }
                            }
                        })
                    }
`
                },
                event: () => {
                    appConfig().changePage(gvc,object.selectPage.tag!)
                }
            }
        }
    },
    category: {
        title: "商品分類",
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    const api = new Api()
                    return `
                    <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">選擇分類</h3>
                    ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID()
                        const vm = {
                            loading: true,
                            colOption: ''
                        }

                        function load() {
                            api.homeeAJAX({route: '/collection', method: 'get'}, (res) => {
                                res.map((x: { id: number; name: string; group: { id: number; name: string }[] }) => {
                                    vm.colOption += /*html*/ `
                                        <option value='${JSON.stringify({
                                        id: x.id,
                                        name: x.name
                                    })}' ${x.name == object.name ? `selected=""` : ``}>
                                            ===== ${x.name} =====
                                        </option>
                                    `;
                                    x.group.map(
                                        (y) =>
                                            (vm.colOption += /*html*/ ` <option
                                                value='${JSON.stringify({
                                                id: y.id,
                                                name: y.name
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
                            bind: id,
                            view: () => {
                                return `<select
                                class="form-select mb-3 "
                                onchange="${gvc.event((e) => {
                                    const val = JSON.parse(e.value)
                                    object.value = val.id;
                                    object.name = val.name;
                                    widget.refreshAll()
                                })}"
                            >
                               ${(vm.colOption === '') ? `<option>${object.name ?? "請稍候..."}</option>` : vm.colOption}
                            </select>`
                            },
                            divCreate: {}
                        }
                    },)}
                    `
                },
                event: () => {
                    DialogHelper.dataLoading({
                        text: "",
                        visible: true
                    })
                    LegacyPage.execute(gvc.glitter, () => {
                        DialogHelper.dataLoading({
                            text: "",
                            visible: false
                        })
                        gvc.glitter.changePage(
                            LegacyPage.getLink("jsPage/category/subCategory.js"),
                            "subCategory",
                            true,
                            {
                                title: object.name,
                                parent_category_id: object.value,
                                category: "sub_category_id",
                                category_id: object.value,
                                index: 0
                            })
                    })

                }
            }
        }
    },
    toProductDetail: {
        title: "商品詳情",
        fun: (gvc, widget, obj) => {
            const api = new Api()
            return {
                editor: () => {
                    const funnel = new Funnel(gvc)
                    return funnel.optionSreach(
                        {
                            path: Api.serverURL + '/api/v1/product?product_name=',
                            key: 'name',
                            def: (obj.data ?? {}).name ?? "",
                            searchData: "product_list"
                        },
                        (res) => {
                            obj.data = res
                            widget.refreshAll()
                        }
                    )
                },
                event: () => {
                    appConfig().changePage(gvc,"product_show",obj.data)
                }
            }
        }
    },
    goBack: {
        title: "返回上一頁",
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    return ``
                },
                event: () => {
                    gvc.glitter.goBack()
                }
            }
        }
    }
})

