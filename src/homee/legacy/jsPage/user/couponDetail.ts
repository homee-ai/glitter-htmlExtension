'use strict';
import { init } from '../../glitterBundle/GVController.js';
import { ViewModel } from '../../view/coupleView.js';
import { SharedView } from '../../widget/sharedView.js';

init((gvc, glitter, gBundle) => {
    gvc.addStyle(`
        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Bold.otf);
            font-weight: bold;
        }

        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Regular.otf);
            font-weight: normal;
        }

        html {
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        body {
            width: 100%;
            height: 100%;
        }

        main {
            padding: 24px 19px 44px;
            font-family: 'Noto Sans TC';
            font-style: normal;
            margin: 0;
            box-sizing: border-box;
            width: 100%;
        }
    `);

    let viewModel = new ViewModel(gvc);
    let shareView = new SharedView(gvc);
    const data: VoucherModel = gBundle.data;

    return {
        onCreateView: () => {
            if (data === undefined) {
                glitter.changePage('jsPage/user/couponTotal.js', 'couponTotal', true, {});
                return '';
            } else {
                let topInset: number = glitter.share.topInset;
                let botInset: number = 10;
                let vm = {
                    empty: true,
                    model: {
                        couponEnable: {
                            id: '0',
                            icon: data.vendor_icon,
                            company: data.vendor_name,
                            discount: data.title,
                            condition: data.subTitle,
                            date: data.formatEndTime,
                            click: () => {
                                glitter.runJsInterFace('useCoupon', {}, () => {}, { webFunction: () => ({}) });
                            },
                        },
                        text: [
                            {
                                title: '????????????',
                                context: data.name,
                            },
                            {
                                title: '????????????',
                                context: data.endTime === null ? '???????????????' : `${data.startTime} - ${data.endTime}`,
                            },
                            {
                                title: '????????????',
                                context: (() => {
                                    let text = '';
                                    switch (data.config.applicability_product) {
                                        case 'all':
                                            text += '????????????';
                                            break;
                                        case 'categories':
                                            text += '??????????????????';
                                            break;
                                        case 'products':
                                            data.config.app_products.map((a: { name: string }, i: number) => {
                                                text += a.name + (data.config.app_products.length == i + 1 ? '' : ', ');
                                            });
                                            break;
                                    }
                                    return text;
                                })(),
                            },
                            {
                                title: '??????',
                                context: '???????????????????????????',
                            },
                            {
                                title: '??????',
                                context: '???????????????????????????',
                            },
                            {
                                title: '????????????',
                                context:
                                    '??? ??????????????????????????????????????????\n' +
                                    '??? ??????????????????????????????\n' +
                                    '??? ?????????????????????????????????????????????????????????????????????????????????\n' +
                                    '??? ??????????????????????????????????????????????????????????????????????????????????????????????????? 1% ?????????\n' +
                                    '??? HOMEE ?????????????????????????????????????????????????????????????????????',
                            },
                        ],
                    },
                };

                glitter.runJsInterFace(
                    'getBotInset',
                    {},
                    (response) => {
                        botInset = response.data;
                        gvc.notifyDataChange('mainView');
                    },
                    {
                        webFunction: () => ({ data: 10 }),
                    }
                );

                return gvc.bindView({
                    bind: `mainView`,
                    view: () => {
                        return /*html*/ `
                            <div class="w-100 d-flex" style="padding-right: 26px;">
                                ${shareView.navigationBar({
                                    title: '???????????????',
                                    leftIcon: /*html*/ ` <img
                                        class=""
                                        src="img/sample/idea/left-arrow.svg"
                                        style="width: 24px;height: 24px;margin-right: 16px"
                                        alt=""
                                        onclick="${gvc.event(() => glitter.goBack('couponTotal'))}"
                                    />`,
                                    rightIcon: /*html*/ `
                                        <img
                                            class=""
                                            src="img/customerService.png"
                                            style="width: 28px;height: 28px;"
                                            alt=""
                                            onclick="${gvc.event(() => glitter.goBack('main2'))}"
                                        />
                                    `,
                                })}
                            </div>
                            <main style="padding-left: 35px; padding-right: 35px;" class="">
                                ${gvc.bindView({
                                    bind: 'coupon',
                                    // ????????????????????????, ?????? divcreate ????????????
                                    view: () => viewModel.couponRow(vm.model.couponEnable),
                                    divCreate: {
                                        style: `margin-bottom:16px; padding:16px; background: #FFFFFF; border-radius: 20px; box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);`,
                                        class: `d-flex align-items-center`,
                                    },
                                })}
                                ${gvc.bindView({
                                    bind: 'context',
                                    view: () => {
                                        gvc.addStyle(`
                                            .contextTitle {
                                                font-weight: 700;
                                                font-size: 15px;
                                                line-height: 150%;
                                                color: #292929;
                                            }
                                            .contextText {
                                                font-weight: 400;
                                                font-size: 12px;
                                                line-height: 17px;
                                                color: #292929;
                                                line-height: 17px;
                                                word-break: break-all;
                                                white-space: normal;
                                            }
                                        `);
                                        let returnHTML = ``;
                                        vm.model.text.forEach((context) => {
                                            returnHTML += /*html*/ `
                                                ${gvc.bindView({
                                                    bind: context.title,
                                                    view: () => {
                                                        let newContext = context.context.replace(/(\r\n)|(\n)/g, '<br>');
                                                        return /*html*/ `
                                                            <div class="contextTitle">${context.title}</div>
                                                            <div class="contextText">${newContext}</div>
                                                        `;
                                                    },
                                                    divCreate: {
                                                        style: `margin-bottom:16px;`,
                                                        class: `d-flex flex-column align-items-baseline`,
                                                    },
                                                })}
                                            `;
                                        });
                                        return returnHTML;
                                    },
                                    divCreate: { style: ``, class: `` },
                                })}
                            </main>
                        `;
                    },
                    divCreate: { class: ``, style: `height:100vh; position:relative;` },
                });
            }
        },
        onResume: () => {},
        onCreate: () => {},
    };
});
