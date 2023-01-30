"use strict";
(() => {
    const glitter = window.glitter;
    const obj = {
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
