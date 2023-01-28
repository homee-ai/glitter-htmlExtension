"use strict";
(() => {
    const glitter = window.glitter;
    const api = {
        upload: (photoFile, callback) => {
            glitter.share.dialog.dataLoading({ text: '上傳中', visible: true });
            $.ajax({
                url: glitter.share.apiPrefix + '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name: `${new Date().getTime()}` }),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.getCookieByName('token') },
                success: (data1) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2) => {
                            glitter.share.dialog.dataLoading({ visible: false });
                            glitter.share.dialog.successMessage({ text: "上傳成功" });
                            callback(data1.fullUrl);
                        },
                        error: (err) => {
                            glitter.share.dialog.successMessage({ text: "上傳失敗" });
                        },
                    });
                },
                error: (err) => {
                    glitter.share.dialog.successMessage({ text: "上傳失敗" });
                },
            });
        }
    };
    glitter.share.htmlExtension["Glitter"] = {
        container: (gvc, widget, setting, hoverID = []) => {
            const htmlGenerate = new glitter.htmlGenerate(widget.data.setting, hoverID);
            return {
                view: htmlGenerate.render(gvc, { class: `${widget.data.layout} ${widget.data.class}`, style: `${widget.data.style}` }),
                editor: (() => {
                    var _a, _b;
                    return gvc.map([
                        `<div class="my-2"></div>
<span class="w-100 mb-2 fw-500 mt-2 " style="color: orange;">排版方式</span>
<select class="form-select mt-2" onchange="${gvc.event((e) => {
                            widget.data.layout = e.value;
                            widget.refreshAll();
                        })}" >
${(() => {
                            const data = [
                                { tit: "d-block", value: `d-block` },
                                { tit: "d-inline-block", value: `d-inline-block` },
                                { tit: "d-inline-flex", value: `d-inline-flex` },
                                { tit: "d-flex", value: `d-flex` },
                                { tit: "row", value: `row` },
                            ];
                            return gvc.map(data.map((it) => {
                                return `<option value="${it.value}" ${(widget.data.layout === it.value) ? `selected` : ``} >${it.tit}</option>`;
                            }));
                        })()}
</select>
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="form-control" value="${(_a = widget.data.class) !== null && _a !== void 0 ? _a : ""}" onchange="${gvc.event((e) => {
                            widget.data.class = e.value;
                            widget.refreshAll();
                        })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="form-control" value="${(_b = widget.data.style) !== null && _b !== void 0 ? _b : ""}" onchange="${gvc.event((e) => {
                            widget.data.style = e.value;
                            widget.refreshAll();
                        })}">
`, (() => {
                            if (widget.data.setting.length > 0) {
                                return htmlGenerate.editor(gvc, {
                                    return_: true,
                                    refreshAll: widget.refreshAll
                                });
                            }
                            else {
                                return ``;
                            }
                        })()
                    ]);
                })()
            };
        },
        image: (gvc, widget, setting) => {
            var _a, _b, _c;
            return {
                view: ` <img class="w-100 ${widget.data.layout} ${widget.data.class}" style="${widget.data.style}" src="${(_a = widget.data.link) !== null && _a !== void 0 ? _a : `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`}"
 >`,
                editor: `
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="form-control" value="${(_b = widget.data.class) !== null && _b !== void 0 ? _b : ""}" onchange="${gvc.event((e) => {
                    widget.data.class = e.value;
                    widget.refreshAll();
                })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="form-control" value="${(_c = widget.data.style) !== null && _c !== void 0 ? _c : ""}" onchange="${gvc.event((e) => {
                    widget.data.style = e.value;
                    widget.refreshAll();
                })}">
<div class="mt-2"></div>
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片連結</h3>
<div class="mt-2"></div>
<div class="d-flex align-items-center mb-3">
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.link}">
<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                    glitter.ut.chooseMediaCallback({
                        single: true,
                        accept: 'image/*',
                        callback(data) {
                            api.upload(data[0].file, (link) => {
                                widget.data.link = link;
                                widget.refreshAll();
                            });
                        }
                    });
                })}"></i>
</div>
                `
            };
        }
    };
    glitter.share.htmlExtension["Glitter"].document = {
        title: "Glitter官方插件",
        doc: {
            container: {
                title: `一個區塊`,
                doc: `插入區塊來包覆內容．`
            }
        }
    };
})();
