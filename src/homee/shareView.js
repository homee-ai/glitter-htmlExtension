export class SharedView {
    constructor(gvc) {
        const glitter = gvc.glitter;
        let topInset = 0;
        let bottomInset = 0;
        glitter.runJsInterFace("getTopInset", {}, (response) => {
            topInset = response.data;
            gvc.notifyDataChange(['nav', 'ddd']);
        }, {
            webFunction: () => {
                return { data: 20 };
            }
        });
        glitter.runJsInterFace("getBottomInset", {}, (response) => {
            if (bottomInset != response.data) {
                bottomInset = response.data;
                gvc.notifyDataChange("footer");
            }
        }, {
            webFunction: () => {
                return { data: 0 };
            }
        });
        this.navigationBar = (item) => {
            return gvc.map([
                gvc.bindView({
                    bind: `nav`,
                    view: () => {
                        let shadow = (item.boxShadow) ? "box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05);" : "";
                        return `
                    <nav class="bg-white w-100" style="position: fixed;z-index: 3;padding-top: ${topInset - 20}px;width: 100vw;">
                        <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0px;height: 63px; padding: 0 26px; background: ${item.background};${shadow} position:relative;">
                            <div class="me-auto p-0 d-flex align-items-center navLeft" style="">
                                ${item.leftIcon}
                            </div>
                            <div class="navTitle" style="font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-size: 16px;
                            font-weight: 700;
                            white-space: nowrap;overflow: hidden;text-overflow: ellipsis;                            
                            " onclick="${gvc.event(() => {
                            let title = document.querySelectorAll('.navTitle');
                            console.log(title);
                        })}">${item.title}</div>
                            ${(() => {
                            if (item.rightIcon) {
                                return `<div class="d-flex ms-auto align-items-center navRight" style="">
                                        ${item.rightIcon}
                                    </div>`;
                            }
                            else
                                return ``;
                        })()}
                        
                        </div>
                    </nav>
                        `;
                    },
                    divCreate: { style: `width:100vw;height:calc(63px + ${topInset - 20}px);` },
                    onCreate: () => {
                        var _a, _b;
                        let left = document.querySelectorAll('.navLeft');
                        let right = document.querySelectorAll('.navRight');
                        let title = document.querySelectorAll('.navTitle');
                        let diff = (((_a = left[left.length - 1]) === null || _a === void 0 ? void 0 : _a.offsetWidth) || 0) - (((_b = right[right.length - 1]) === null || _b === void 0 ? void 0 : _b.offsetWidth) || 0);
                        if (item.title) {
                            if (diff > 0) {
                                title[title.length - 1].style.paddingRight = `${diff}px`;
                            }
                            else {
                                title[title.length - 1].style.paddingLeft = `${diff * -1}px`;
                            }
                        }
                    }
                }),
                gvc.bindView({
                    bind: `ddd`,
                    view: () => {
                        if (item.hideTb) {
                            return ``;
                        }
                        return `<div class="w-100" style="height:calc(${topInset || 20}px);"></div>`;
                    },
                    divCreate: {}
                })
            ]);
        };
        this.biggerTitle = (item) => {
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = (response.data);
                gvc.notifyDataChange('nav');
            }, {
                webFunction: () => {
                    return { data: 50 };
                }
            });
            return gvc.bindView({
                bind: `nav`,
                view: () => {
                    return `
                <nav class="bg-white w-100" style="position: fixed;z-index: 3;padding-top: ${topInset - 20}px;width: 100vw;">
                <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0px;height: 113px; padding: 0 26px; background: #FFFFFF;box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05);position:relative;">
                <div class="me-auto p-0 d-flex align-items-center" style="">
                ${item.leftIcon}
                </div>
                <div class=" d-flex align-items-center justify-content-center translate-middle-y translate-middle-x" style="position: absolute;top: 50%;   font-family: 'Noto Sans TC';
        font-style: normal;
        font-size: 16px;
        font-weight: 700;">${item.title}</div>
                ${(() => {
                        if (item.rightIcon) {
                            return `
                        <div class="d-flex ms-auto align-items-center" style="">
                            ${item.rightIcon}
                        </div>`;
                        }
                        else
                            return ``;
                    })()}
                
                </div>
                </nav>
                    `;
                },
                divCreate: { style: `width:100vw;` },
                onCreate: () => {
                }
            });
        };
    }
}
