'use strict';
import { Plugin } from '../test.js';
Plugin.create(import.meta.url, (glitter) => {
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
    return {
        banner: {
            defaultData: {
                link: []
            },
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                function slideControl(pageImgArray, pagination, navigation, scrollbar) {
                    const glitter = gvc.glitter;
                    gvc.addStyle(`
            .swiper-slide{
                width: 100%;
                background-repeat: no-repeat;
            }
        `);
                    let slidePage = ``;
                    pageImgArray.forEach((item, index) => {
                        slidePage += `
                <div class="swiper-slide" style="padding-bottom: 128%; background:50% / cover url(${item.img});" onclick="${gvc.event(() => {
                            eval(item.code);
                        })}">
                </div>
            `;
                    });
                    let id = `${glitter.getUUID()}`;
                    return `
            <!-- Slider main container -->
            ${gvc.bindView({
                        bind: id,
                        view: () => {
                            return `
              <div class="swiper-wrapper">
                  ${slidePage}
              </div>
              ${(() => {
                                if (pagination) {
                                    return `<div class="swiper-pagination"></div>`;
                                }
                                else {
                                    return ``;
                                }
                            })()}
              ${(() => {
                                if (navigation) {
                                    return `
                          <div class="swiper-button-prev"></div>
                          <div class="swiper-button-next"></div>`;
                                }
                                else {
                                    return '';
                                }
                            })()}
              ${(() => {
                                if (scrollbar) {
                                    return `<div class="swiper-scrollbar"></div>`;
                                }
                                else {
                                    return ``;
                                }
                            })()}
              `;
                        },
                        divCreate: { class: `swiper ${id}` },
                        onCreate: () => {
                            glitter.addMtScript([{
                                    src: 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js'
                                }], () => {
                                const Swiper = window.Swiper;
                                console.log(Swiper);
                                const swiper = new Swiper(`.${id}`, {
                                    direction: 'horizontal',
                                    loop: true,
                                    pagination: {
                                        el: `.${id} .swiper-pagination`,
                                    },
                                    navigation: {
                                        nextEl: `.${id} .swiper-button-next`,
                                        prevEl: `.${id} .swiper-button-prev`,
                                    },
                                    scrollbar: {
                                        el: `.${id} .swiper-scrollbar`,
                                    },
                                });
                            }, () => { });
                        }
                    })}
        `;
                }
                gvc.addStyle(`
            .swiper-pagination-bullet{
            background-color: black !important;
            }
              .swiper-pagination-bullet-active{
            width:8px !important;
            background-color: white  !important;
            }
            `);
                gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css`);
                const editorID = glitter.getUUID();
                return {
                    view: slideControl(data.link, true, false, false),
                    editor: gvc.bindView({
                        bind: editorID,
                        view: () => {
                            function swapArr(arr, index1, index2) {
                                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                                return arr;
                            }
                            return `
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片連結</h3>
<div class="mt-2"></div>
${data.link.map((dd, index) => {
                                var _a;
                                return `<div class="d-flex align-items-center mb-3 mt-3">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                    data.link.splice(index, 1);
                                    widget.refreshAll();
                                })}"></i>
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${dd.img}">
<div class="d-flex flex-column mx-2">
<i class="fa-duotone fa-up  text-white ${(index === 0) ? `d-none` : ``}"  style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                    data.link = swapArr(data.link, index, index - 1);
                                    widget.refreshAll();
                                })}"></i>
<i class="fa-regular fa-down  text-white ${(index === data.link.length - 1) ? `d-none` : ``}" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                    data.link = swapArr(data.link, index, index + 1);
                                    widget.refreshAll();
                                })}"></i>
</div>
<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                    glitter.ut.chooseMediaCallback({
                                        single: true,
                                        accept: 'image/*',
                                        callback(data) {
                                            api.upload(data[0].file, (link) => {
                                                dd.img = link;
                                                widget.refreshAll();
                                            });
                                        }
                                    });
                                })}"></i>
</div>
${glitter.htmlGenerate.editeText({
                                    gvc: gvc,
                                    title: "程式碼",
                                    default: (_a = dd.code) !== null && _a !== void 0 ? _a : "",
                                    placeHolder: "程式碼",
                                    callback: (text) => {
                                        dd.code = text;
                                        widget.refreshAll();
                                    }
                                })}
`;
                            }).join(`<div class="w-100 my-3" style="background: white;height: 1px;"></div>`)}
<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${gvc.event(() => {
                                data.link.push({ img: `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg` });
                                widget.refreshAll();
                            })}">添加輪播圖</div>
`;
                        },
                        divCreate: {}
                    })
                };
            },
        },
        rankingBlock: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                var _a;
                widget.data.titleStyle = (_a = widget.data.titleStyle) !== null && _a !== void 0 ? _a : `font-family: 'Noto Sans TC';
font-style: normal;
color: black;
font-size: 16px;
margin-top: 16px;
margin-left: 12px;
font-weight: 700;`;
                return {
                    view: `
                <div class="" style="background-color: ${widget.data.bgcolor};border-radius:${widget.data.radius}px;">
                <h3 style="${widget.data.titleStyle}">${widget.label}</h3>
                   <div class="d-flex align-items-center justify-content-around " style="width:calc(100% -24px);margin-left: 12px;margin-right: 12px;gap: 8px;padding-bottom: 15px;">
               ${gvc.map(['firstRank.svg', 'secondRank.svg', 'thirdRank.svg'].map((dd) => {
                        return ` <div class="d-flex flex-column align-items-center justify-content-center" style="width:calc(100% - 16px);">
 <div class="bg-white flex-fill position-relative" style="width:100%;border-radius: 8px;padding-bottom: calc(100%);
 background:50% / cover , url(${glitter.share.sourcePrefix}/img/homeeExtension/testChair.svg) no-repeat center;">
         <img src="${glitter.share.sourcePrefix}/img/homeeExtension/${dd}" class="position-absolute" style="top: 0px;">       
</div>
<span class="" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 500;
font-size: 10px;
line-height: 14px;
text-align: center;
margin-top: 4px;
color: #FE5541;">$ 3,125</span>
</div>`;
                    }))}
</div>
</div>
                `,
                    editor: gvc.map([
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc, title: "背景顏色", default: widget.data.bgcolor, placeHolder: "請輸入背景顏色", callback: (text) => {
                                widget.data.bgcolor = text;
                                widget.refreshAll();
                            }
                        }),
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc, title: "倒圓角", default: widget.data.radius, placeHolder: "請輸入圓角幅度", callback: (text) => {
                                widget.data.radius = text;
                                widget.refreshAll();
                            }
                        }),
                        glitter.htmlGenerate.editeText({
                            gvc: gvc, title: "標題Style", default: widget.data.titleStyle, placeHolder: "請輸入標題Style", callback: (text) => {
                                widget.data.titleStyle = text;
                                widget.refreshAll();
                            }
                        })
                    ])
                };
            }
        },
        productItem: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                var _a, _b;
                return {
                    view: `<div class="${(_a = widget.data.class) !== null && _a !== void 0 ? _a : ""} p-0" style="${(_b = widget.data.style) !== null && _b !== void 0 ? _b : ""} 
height: auto;background: #FBF9F6;border: 4px solid rgba(248, 243, 237, 0.3);
border-radius: 16px;">
<div class=" w-100 m-0" style="
box-sizing:border-box;
border-radius: 16px;
padding-bottom: 100%;background: 50%/cover no-repeat url('https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1674310792051')"></div>
<h3 style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 14px;
margin-top: 8px;
margin-bottom: 0px;
color: #292929;">MERETA 茶几</h3>
<div class="d-flex align-items-baseline" style="margin-top: 8px;margin-bottom: 8px;">
<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 14px;
color: #FD6A58;
line-height: 150%;">
NT$ 6,900 up
</span>
<div class="flex-fill"></div>
<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 10px;
line-height: 14px;
text-align: right;
text-decoration-line: line-through;
color: #858585;">
 NT$ 12,400
</span>
</div>

</div>`,
                    editor: gvc.map([
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: "Class",
                            default: widget.data.class,
                            placeHolder: "請輸入Class",
                            callback: (text) => {
                                widget.data.class = text;
                                widget.refreshAll();
                            }
                        }),
                        glitter.htmlGenerate.editeText({
                            gvc: gvc,
                            title: "Style",
                            default: widget.data.style,
                            placeHolder: "請輸入Style",
                            callback: (text) => {
                                widget.data.style = text;
                                widget.refreshAll();
                            }
                        })
                    ])
                };
            },
        }
    };
});
