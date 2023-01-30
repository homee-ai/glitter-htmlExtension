"use strict";
(() => {
    const glitter = window.glitter;
    const obj = {
        title: {
            defaultData: {
                font: "12345"
            },
            render: (gvc, widget, setting) => {
                var _a, _b, _c;
                return {
                    view: `<h3 style="color: ${(_a = widget.data.color) !== null && _a !== void 0 ? _a : "black"};font-size: ${(_b = widget.data.font) !== null && _b !== void 0 ? _b : ""}px;">${widget.data.title}</h3>`,
                    editor: gvc.map([
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: "標題",
                            default: widget.data.title,
                            placeHolder: "請帶入標題",
                            callback: (text) => {
                                widget.data.title = text;
                                widget.refreshAll();
                            }
                        }),
                        `
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">字型大小</h3>
<input class="form-control" placeholder="" onchange="${gvc.event((e) => {
                            widget.data.font = e.value;
                            widget.refreshAll();
                        })}" value="${(_c = widget.data.font) !== null && _c !== void 0 ? _c : ""}">
                            `,
                        (() => {
                            const option = ['red', 'black', 'yellow', 'blue'];
                            return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">字型顏色</h3>
                            <select class="form-control" onchange="${gvc.event((e) => {
                                widget.data.color = e.value;
                                widget.refreshAll();
                            })}">
                            ${gvc.map(option.map((dd) => {
                                return `<option value="${dd}" ${(dd === widget.data.color) ? `selected` : ``}>${dd}</option>`;
                            }))}
</select>`;
                        })()
                    ])
                };
            }
        },
        banner: {
            defaultData: {},
            render: (gvc, widget, setting) => {
                var _a;
                const a = ['1', '2', '3'];
                return {
                    view: `
                    <img src="${widget.data.link}" class="${(_a = widget.data.class) !== null && _a !== void 0 ? _a : ""}">
                    `,
                    editor: gvc.map([
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: "連結",
                            default: widget.data.link,
                            placeHolder: "請帶入連結",
                            callback: (text) => {
                                widget.data.link = text;
                                widget.refreshAll();
                            }
                        }),
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: "Class",
                            default: widget.data.class,
                            placeHolder: "請帶入Class",
                            callback: (text) => {
                                widget.data.class = text;
                                widget.refreshAll();
                            }
                        }),
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: "Style",
                            default: widget.data.class,
                            placeHolder: "請帶入Class",
                            callback: (text) => {
                                widget.data.class = text;
                                widget.refreshAll();
                            }
                        })
                    ])
                };
            },
        },
    };
    glitter.share.htmlExtension["empty"] = obj;
    glitter.share.htmlExtension["empty"].document = {
        title: "empty",
        doc: {}
    };
})();
