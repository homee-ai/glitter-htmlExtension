import { init } from '../../glitterBundle/GVController.js';
init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            var _a;
            let viewModel = {
                title: "SORIA 雙抽玻璃移門電視櫃",
                price: "11,520",
            };
            function productKindDom(index, sizeType) {
                return `
                    ${gvc.bindView({
                    bind: `type${index}`,
                    view: () => {
                        return `
                            <div class="sizeSelectTitle">
                                ${sizeType.attribute_key}
                            </div>
                            <div class="d-flex flex-wrap" style="overflow: scroll;">
                                ${gvc.map(sizeType.attribute_values.map((data, index) => {
                            let className = "kindUnselected";
                            if (data.selected) {
                                className += " kindSelected";
                            }
                            return `
                                        <div class="${className}" style="margin-top: 8px;">
                                            ${data.value}
                                        </div>
                                    `;
                        }))}
                            </div>      
                        `;
                    }, divCreate: { class: ``, style: `margin-bottom:8px;` },
                })}
                                        
                                    `;
            }
            console.log((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj);
            return `
                <div class="position-relative h-100" style="width:100vw;padding: 0 31px;;top: 50%;z-index: 99999;">
                    <div class="d-flex flex-column" style="width: 100%;padding: 16px 24px;background: #FFFFFF;border-radius: 24px;font-family: 'Noto Sans TC';font-style: normal;">
                        <div style="font-weight: 700;font-size: 24px;line-height: 35px;font-feature-settings: 'pnum' on, 'lnum' on;color: #1E1E1E;">
                            ${viewModel.title}
                        </div>
                        <div style="font-weight: 500;font-size: 20px;line-height: 29px;font-feature-settings: 'pnum' on, 'lnum' on;color: #FE5541;">
                            NT$ ${viewModel.price}
                        </div>
                        <div style="width: 40px;height: 2px;background: #1E1E1E;margin-top:24px;margin-bottom: 16px; "></div>
                        <div style=""></div>
                        <div style="padding: 0 24px;">
                            <div class="w-100 d-flex align-items-center justify-content-center" style="padding:7px 0;background: #FE5541;border-radius: 24px;font-weight: 700;font-size: 18px;line-height: 26px;text-align: center;letter-spacing: 0.15em;font-feature-settings: 'pnum' on, 'lnum' on;color: #FFFFFF;" onclick="${gvc.event(() => {
                glitter.closeDiaLog("changeSku");
            })}">
                                確認
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    };
});
