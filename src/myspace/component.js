'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { ClickEvent } from "../glitterBundle/plugins/click-event.js";
import { appConfig } from "../config.js";
import { Dialog } from "../dialog/dialog-mobile.js";
import { Myspace } from "../api/myspace.js";
import { Api } from "../homee/api/homee-api.js";
import { SharedView } from "../homee/shareView.js";
Plugin.create(import.meta.url, (glitter) => {
    return {
        allPage: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            let vm = {
                                loading: true,
                                height: `100vh`,
                                data: [],
                                showMore: true
                            };
                            function getData() {
                                vm.data = [];
                                vm.loading = true;
                                gvc.notifyDataChange(id);
                                Myspace.getModelList((data) => {
                                    vm.loading = false;
                                    if (data) {
                                        vm.data = data;
                                        vm.data = vm.data.sort(function (a, b) {
                                            return b.time - a.time;
                                        });
                                        vm.showMore = vm.data.length >= 4;
                                        vm.data = vm.data.filter((dd, index) => {
                                            return index < 4;
                                        });
                                        spaceData = vm.data.map((dd) => {
                                            return { title: dd.key, date: dd.store_time, img: dd.space_image, config: dd };
                                        });
                                    }
                                    gvc.notifyDataChange(id);
                                });
                            }
                            getData();
                            async function getPageHeight() {
                                let top = await new Promise((resolve, reject) => {
                                    appConfig().getTopInset((number) => {
                                        resolve(number);
                                    });
                                });
                                let bottom = await new Promise((resolve, reject) => {
                                    appConfig().getBottomInset((number) => {
                                        resolve(number);
                                    });
                                });
                                console.log(JSON.stringify({ top: top, bottom: bottom }));
                                vm.height = `calc(100vh - ${63 + top + 63}px)`;
                                gvc.notifyDataChange(id);
                            }
                            getPageHeight();
                            let spaceData = [];
                            let clickEvent = glitter.ut.clock();
                            return {
                                bind: id,
                                view: () => {
                                    if (vm.loading) {
                                        return `<div class="w-100">
            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                <div class="spinner-border" role="status"></div>
            </div>
        </div>`;
                                    }
                                    return `
<div class="w-100 position-fixed  d-flex align-items-center justify-content-center flex-column"
style="background: #F8F3ED;height: ${vm.height};">
<div class="d-flex flex-column align-items-center" style="width: calc(100% - 48px);transform: translateY(-40px);">

${spaceData.length === 0 ? `
<img src="${new URL('../img/noSpace.png', import.meta.url).href}" class="" style="width: calc(100% - 114px);">
` : `
<div class="w-100" style="height: 1px;background: #EAD8C2;width: calc(100% - 94px);margin-bottom: 24px;"></div>
${spaceData.map((dd) => {
                                        return `
<div class="w-100 bg-white d-flex align-items-center position-relative" style="height: 100px;border-radius: 20px;"
onclick="${gvc.event((e, event) => {
                                            if (clickEvent.stop() > 50) {
                                                dd.config.json = JSON.stringify(dd.config)
                                                    .replace(/server_rout/g, 'serverRout')
                                                    .replace(/store_time/g, 'storeTime')
                                                    .replace(/space_image/g, 'spaceImage')
                                                    .replace(/preview_image/g, 'previewImage')
                                                    .replace(/model_url/g, 'modelUrl');
                                                glitter.runJsInterFace("openMySpaceMd", dd.config, () => {
                                                    getData();
                                                });
                                            }
                                        })}">
<div class="h-100 bg-white" style="width: 160px;background: url('${dd.img}')  50% / cover; border-top-left-radius: 20px;border-bottom-left-radius: 20px;"></div>
<div class="d-flex flex-column align-items-baseline" style="margin-left: 24px;margin-right: 14px;">
<h3 style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 23px;
font-feature-settings: 'pnum' on, 'lnum' on;
color: #1E1E1E;">${dd.title}</h3>
<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 17px;
text-align: center;
color: #858585;">儲存時間:${dd.date.substring(0, 16)}</span>
</div>
<img class="position-absolute top-0 right-0" src="${new URL('../img/more.svg', import.meta.url)}" style="width: 32px;height: 32px;right: 6px;" onclick="${gvc.event((e, event) => {
                                            if (clickEvent.stop() > 50) {
                                                clickEvent.zeroing();
                                                glitter.runJsInterFace("showSpaceAction", {
                                                    json: JSON.stringify(dd.config).replace(/server_rout/g, 'serverRout')
                                                        .replace(/store_time/g, 'storeTime')
                                                        .replace(/space_image/g, 'spaceImage')
                                                        .replace(/preview_image/g, 'previewImage')
                                                        .replace(/model_url/g, 'modelUrl')
                                                }, () => {
                                                    getData();
                                                });
                                            }
                                        })}">
</div>`;
                                    }).join('<div style="height: 16px;"></div>')}
<div class="w-100" style="height: 1px;background: #EAD8C2;width: calc(100% - 94px);margin-top: 14px;"></div>
`}

${(() => {
                                        if (vm.showMore) {
                                            return `<div style="font-family: 'Noto Sans TC';
font-style: normal;font-weight: 400;font-size: 15px;margin-top: 14px;line-height: 150%;color: #1E1E1E;
" onclick="${gvc.event(() => {
                                                appConfig().setHome(gvc, 'more_space');
                                            })}">更多空間</div>`;
                                        }
                                        else {
                                            return ``;
                                        }
                                    })()}
</div>
<div id="" class="position-absolute d-flex  flex-column align-items-center justify-content-center p-0" style="
padding: 0;margin: 0 59px;bottom:25px;width:calc(100vw - 108px);height:48px;
background: #FE5541;border-radius: 24px; " onclick="${gvc.event((e) => {
                                        const dialog = new Dialog();
                                        dialog.dataLoading(true);
                                        glitter.runJsInterFace("startScan", {}, () => {
                                            getData();
                                        }, {
                                            webFunction: () => {
                                                dialog.showInfo("僅支援APP版本");
                                            }
                                        });
                                    })}">
<h3 style="
font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 18px;
text-align: center;
letter-spacing: 0.15em;
color: #FFFFFF;" class="m-0" >開始掃描</h3>
                                    </div>
</div>`;
                                },
                                divCreate: {}
                            };
                        });
                    },
                    editor: () => {
                        return ``;
                    }
                };
            }
        },
        allSpace: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            let vm = {
                                loading: true,
                                height: `100vh`,
                                data: [],
                                showMore: true
                            };
                            function getData() {
                                vm.data = [];
                                vm.loading = true;
                                gvc.notifyDataChange(id);
                                Myspace.getModelList((data) => {
                                    vm.loading = false;
                                    if (data) {
                                        vm.data = data;
                                        vm.data = vm.data.sort(function (a, b) {
                                            return b.time - a.time;
                                        });
                                        spaceData = vm.data.map((dd) => {
                                            return { title: dd.key, date: dd.store_time, img: dd.space_image, config: dd };
                                        });
                                    }
                                    gvc.notifyDataChange(id);
                                });
                            }
                            getData();
                            async function getPageHeight() {
                                let top = await new Promise((resolve, reject) => {
                                    appConfig().getTopInset((number) => {
                                        resolve(number);
                                    });
                                });
                                let bottom = await new Promise((resolve, reject) => {
                                    appConfig().getBottomInset((number) => {
                                        resolve(number);
                                    });
                                });
                                console.log(JSON.stringify({ top: top, bottom: bottom }));
                                vm.height = `calc(100vh - ${63 + top + 73}px)`;
                                gvc.notifyDataChange(id);
                            }
                            getPageHeight();
                            let spaceData = [];
                            let clickEvent = glitter.ut.clock();
                            return {
                                bind: id,
                                view: () => {
                                    if (vm.loading) {
                                        return `<div class="w-100">
            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                <div class="spinner-border" role="status"></div>
            </div>
        </div>`;
                                    }
                                    return `
<div class="d-flex flex-column align-items-center mx-auto pt-2" style="padding-left:24px;padding-right: 24px;min-height: 100vh;
background: #F8F3ED;padding-bottom: 24px;">
${spaceData.length === 0 ? `
<img src="${new URL('../img/noSpace.png', import.meta.url).href}" class="" style="width: calc(100% - 114px);">
` : `
${spaceData.map((dd) => {
                                        return `<div class="w-100 bg-white d-flex align-items-center position-relative" style="height: 100px;border-radius: 20px;"
onclick="${gvc.event((e, event) => {
                                            if (clickEvent.stop() > 50) {
                                                dd.config.json = JSON.stringify(dd.config)
                                                    .replace(/server_rout/g, 'serverRout')
                                                    .replace(/store_time/g, 'storeTime')
                                                    .replace(/space_image/g, 'spaceImage')
                                                    .replace(/preview_image/g, 'previewImage')
                                                    .replace(/model_url/g, 'modelUrl');
                                                glitter.runJsInterFace("openMySpaceMd", dd.config, () => {
                                                    getData();
                                                });
                                            }
                                        })}">
<div class="h-100 bg-white" style="width: 160px;background: url('${dd.img}')  50% / cover;border-top-left-radius: 20px;border-bottom-left-radius: 20px;"></div>
<div class="d-flex flex-column align-items-baseline" style="margin-left: 24px;margin-right: 14px;">
<h3 style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 23px;
font-feature-settings: 'pnum' on, 'lnum' on;
color: #1E1E1E;">${dd.title}</h3>
<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 17px;
text-align: center;
color: #858585;">儲存時間:${dd.date.substring(0, 16)}</span>
</div>
<img class="position-absolute top-0 right-0" src="${new URL('../img/more.svg', import.meta.url)}" style="width: 32px;height: 32px;right: 6px;" onclick="${gvc.event((e, event) => {
                                            if (clickEvent.stop() > 50) {
                                                clickEvent.zeroing();
                                                glitter.runJsInterFace("showSpaceAction", {
                                                    json: JSON.stringify(dd.config).replace(/server_rout/g, 'serverRout')
                                                        .replace(/store_time/g, 'storeTime')
                                                        .replace(/space_image/g, 'spaceImage')
                                                        .replace(/preview_image/g, 'previewImage')
                                                        .replace(/model_url/g, 'modelUrl')
                                                }, () => {
                                                    getData();
                                                });
                                            }
                                        })}">
</div>`;
                                    }).join('<div style="height: 16px;"></div>')}
`}
</div>
`;
                                },
                                divCreate: {}
                            };
                        });
                    },
                    editor: () => {
                        return ``;
                    }
                };
            }
        },
        footer: {
            defaultData: {
                dataList: [
                    {
                        title: "首頁",
                        icon: new URL('../img/component/footer/home.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "靈感",
                        icon: new URL('../img/component/footer/idea.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "我的空間",
                        icon: new URL('../img/component/footer/myspace.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "購物車",
                        icon: new URL('../img/component/footer/shoopingCart.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "會員",
                        icon: new URL('../img/component/footer/user.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                ],
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                        footer{
                            background:white;
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
                    `);
                return {
                    view: () => {
                        return `
                        <footer class="d-flex align-items-center justify-content-around w-100" style="padding-bottom: ${widget.data.bottomInset}px;position: fixed;top: 0px;left: 0px;">
                            ${(() => {
                            return gvc.map(widget.data.dataList.map((data, index) => {
                                var _a;
                                return `
                                <div class="d-flex flex-column align-items-center" onclick="${gvc.event((e) => {
                                    glitter.runJsInterFace("setSpaceHome", {
                                        page: data.selectPage.tag
                                    }, () => {
                                    });
                                })}">
                                    <img src=${data.icon} style="width: 28px;height: 28px;">
                                    <div class="footerTitle" style="color:${(_a = data.color) !== null && _a !== void 0 ? _a : `black`};">${data.title}</div>
                                </div>
                                `;
                            }));
                        })()}
                        </footer>
                    `;
                    },
                    editor: () => {
                        return `
` + gvc.map(widget.data.dataList.map((dd, index) => {
                            var _a;
                            return `<div class="alert alert-dark mt-2">
<h3 style="color: white;font-size: 17px;color: orangered;">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                widget.data.dataList.splice(index, 1);
                                widget.refreshComponent();
                            })}"></i>
選項.${index + 1}</h3>
${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `名稱`,
                                default: dd.title,
                                placeHolder: dd.title,
                                callback: (text) => {
                                    widget.data.dataList[index].title = text;
                                    widget.refreshAll();
                                }
                            }) +
                                `
 ${glitter.htmlGenerate.editeInput({
                                    gvc,
                                    title: "字體顏色",
                                    default: (_a = dd.color) !== null && _a !== void 0 ? _a : "black",
                                    placeHolder: "請輸入字體顏色",
                                    callback: (text) => {
                                        dd.color = text;
                                        widget.refreshComponent();
                                    }
                                })}
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片</h3>
                                <div class="mt-2"></div>
                                <div class="d-flex align-items-center mb-3">
                                    <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].icon}">
                                    <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                    <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                    glitter.ut.chooseMediaCallback({
                                        single: true,
                                        accept: 'image/*',
                                        callback(data) {
                                            appConfig().uploadImage(data[0].file, (link) => {
                                                widget.data.dataList[index].icon = link;
                                                widget.refreshAll();
                                            });
                                        }
                                    });
                                })}"></i>
                                </div>
                            `
                                + ClickEvent.editer(gvc, widget, dd, {
                                    option: ['mySpaceSetHome'], hover: false
                                })}
</div>`;
                        })) + `<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${gvc.event(() => {
                            widget.data.dataList.push({
                                title: "標題",
                                icon: new URL('../img/component/footer/home.svg', import.meta.url).href
                            });
                            widget.refreshComponent();
                        })}">添加按鈕</div>`;
                    }
                };
            }
        },
        productDetail: {
            defaultData: {
                title: ``
            },
            render: (gvc, widget, setting, hoverID) => {
                const sharedView = new SharedView(gvc);
                return {
                    view: () => {
                        return `
                        ${(() => {
                            return sharedView.navigationBar({
                                title: `${widget.data.title}`,
                                leftIcon: `<img class="" src="${new URL('../img/component/left-arrow.svg', import.meta.url).href}" style="width: 28px;height: 28px;" alt="" onclick="${gvc.event(() => {
                                    if (gvc.glitter.pageConfig.length <= 1) {
                                        appConfig().setHome(gvc, "home", {});
                                    }
                                    else {
                                        gvc.glitter.goBack();
                                    }
                                })}">`,
                                rightIcon: `
                                <img class="" src="${new URL('../img/component/service2.svg', import.meta.url).href}" style="width: 28px;height: 28px;" alt="" onclick="${gvc.event(() => {
                                })}">
                            `
                            });
                        })()}
                          
                        `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        empty: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => { return ``; },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
    };
});
ClickEvent.create(import.meta.url, {
    mySpaceSetHome: {
        title: "首頁設定",
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    var _a;
                    const vm = {
                        loading: true,
                        data: []
                    };
                    const id = gvc.glitter.getUUID();
                    const api = new Api();
                    object.selectPage = (_a = object.selectPage) !== null && _a !== void 0 ? _a : {};
                    api.homeeAJAX({
                        api: Api.serverURL,
                        route: '/api/v1/lowCode/pageConfig?query=tag,`group`,name',
                        method: 'get'
                    }, (res) => {
                        vm.data = res.result;
                        vm.loading = false;
                        gvc.notifyDataChange(id);
                    });
                    return `
<h3 class="m-0 mb-2 mt-2" style="font-size: 16px;">選擇頁面</h3>
${gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                if (vm.loading) {
                                    return `<option value='${JSON.stringify(object.selectPage)}'>${(_a = object.selectPage.name) !== null && _a !== void 0 ? _a : "尚未選擇"}</option>`;
                                }
                                let haveData = false;
                                return gvc.map(vm.data.map((dd) => {
                                    haveData = haveData || object.selectPage.tag === dd.tag;
                                    return `<option value='${JSON.stringify(dd)}' ${(object.selectPage.tag === dd.tag) ? `selected` : ``}>${dd.name}</option>`;
                                })) + ((haveData) ? `` : `<option selected>尚未定義</option>`);
                            },
                            divCreate: {
                                class: `form-control`, elem: `select`, option: [
                                    {
                                        key: 'onChange',
                                        value: gvc.event((e, event) => {
                                            object.selectPage = JSON.parse(e.value);
                                            widget.refreshAll();
                                        })
                                    }
                                ]
                            }
                        };
                    })}
`;
                },
                event: () => {
                    appConfig().setHome(gvc, object.selectPage.tag);
                }
            };
        }
    },
});
