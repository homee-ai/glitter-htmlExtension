export class ClickEvent {
    static create(url, event) {
        var _a;
        const glitter = window.glitter;
        glitter.share.clickEvent = (_a = glitter.share.clickEvent) !== null && _a !== void 0 ? _a : {};
        glitter.share.clickEvent[url] = event;
    }
    static trigger(oj) {
        const event = oj.clickEvent.clickEvent;
        async function run() {
            var _a;
            oj.gvc.glitter.share.clickEvent = (_a = oj.gvc.glitter.share.clickEvent) !== null && _a !== void 0 ? _a : {};
            if (!oj.gvc.glitter.share.clickEvent[event.src]) {
                await new Promise((resolve, reject) => {
                    oj.gvc.glitter.addMtScript([
                        { src: `${event.src}`, type: 'module' }
                    ], () => {
                        resolve(true);
                    }, () => {
                        resolve(false);
                    });
                });
            }
            oj.gvc.glitter.share.clickEvent[event.src][event.route].fun(oj.gvc, oj.widget, oj.clickEvent).event();
        }
        run().then();
    }
    static editer(gvc, widget, obj) {
        const glitter = gvc.glitter;
        return `<div class="">
 <h3 class="" style="font-size: 16px;">點擊事件</h3>
 ${gvc.bindView(() => {
            return {
                bind: ``,
                view: () => {
                    var select = false;
                    return `<select class="form-select" onchange="${gvc.event((e) => {
                        if (e.value === 'undefined') {
                            obj.clickEvent = undefined;
                        }
                        else {
                            obj.clickEvent = JSON.parse(e.value);
                        }
                        widget.refreshAll();
                    })}">
${gvc.map(Object.keys(glitter.share.clickEvent).map((key) => {
                        const value = glitter.share.clickEvent[key];
                        return gvc.map(Object.keys(value).map((v2) => {
                            const value2 = value[v2];
                            const selected = JSON.stringify({
                                src: key,
                                route: v2
                            }) === JSON.stringify(obj.clickEvent);
                            select = selected || select;
                            return `<option value='${JSON.stringify({
                                src: key,
                                route: v2
                            })}' ${(selected) ? `selected` : ``}>${value2.title}</option>`;
                        }));
                    }))}
<option value="undefined"  ${(!select) ? `selected` : ``}>未定義</option>
</select>
${gvc.bindView(() => {
                        const id = glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                try {
                                    if (!glitter.share.clickEvent[obj.clickEvent.src]) {
                                        return ``;
                                    }
                                    return glitter.share.clickEvent[obj.clickEvent.src][obj.clickEvent.route].fun(gvc, widget, obj).editor();
                                }
                                catch (e) {
                                    return ``;
                                }
                            },
                            divCreate: {},
                            onCreate: () => {
                                var _a;
                                glitter.share.clickEvent = (_a = glitter.share.clickEvent) !== null && _a !== void 0 ? _a : {};
                                try {
                                    console.log(glitter.share.clickEvent[obj.clickEvent.src]);
                                    if (!glitter.share.clickEvent[obj.clickEvent.src]) {
                                        glitter.addMtScript([
                                            { src: obj.clickEvent.src, type: 'module' }
                                        ], () => {
                                            gvc.notifyDataChange(id);
                                        }, () => {
                                            alert(obj.clickEvent.src);
                                        });
                                    }
                                }
                                catch (e) { }
                            }
                        };
                    })}
`;
                },
                divCreate: {}
            };
        })}
</div> `;
    }
}
