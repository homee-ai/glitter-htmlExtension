'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { appConfig } from "../config.js";
import { Dialog } from "../dialog/dialog-mobile.js";
import { Myspace } from "../api/myspace.js";
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
                                        vm.showMore = vm.data.length > 4;
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
<div class="w-100 position-fixed  d-flex align-items-center justify-content-center flex-column"
style="background: #F8F3ED;height: ${vm.height};">
<div class="d-flex flex-column align-items-center" style="width: calc(100% - 48px);transform: translateY(-40px);">

${spaceData.length === 0 ? `
<img src="${new URL('../img/noSpace.png', import.meta.url).href}" class="" style="width: calc(100% - 114px);">
` : `
<div class="w-100" style="height: 1px;background: #EAD8C2;width: calc(100% - 94px);margin-bottom: 24px;"></div>
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
<div class="h-100 bg-white" style="width: 160px;background: url('${dd.img}')  50% / cover;"></div>
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
font-style: normal;
font-weight: 400;
font-size: 15px;
margin-top: 14px;;
line-height: 150%;
color: #1E1E1E;
">更多空間</div>`;
                                        }
                                        else {
                                            return ``;
                                        }
                                    })()}
</div>
<div id="" class="position-absolute d-flex  flex-column align-items-center justify-content-center p-0" style="
padding: 0;margin: 0 59px;bottom:25px;width:calc(100vw - 108px);height:48px;
background: #FE5541;border-radius: 24px; " onclick="${gvc.event((e) => {
                                        const dialog = new Dialog(gvc);
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
        }
    };
});
