import { init } from '../../glitterBundle/GVController.js';
import { Funnel } from '../../glitterBundle/funnel.js';
import { appConfig } from "../../config.js";
init((gvc, glitter, gBundle) => {
    const id = glitter.getUUID();
    let funnel = new Funnel(gvc);
    let botInset = 0;
    glitter.runJsInterFace("getBottom", {}, function (response) {
        botInset = response.data;
        gvc.notifyDataChange(id);
    }, {
        webFunction(data, callback) {
            return { data: 10 };
        }
    });
    return {
        onCreateView: () => {
            return `
                <div class="w-100 d-flex justify-content-center align-items-center" style="position: fixed;top: 25%;">
                    <div style="font-family: 'Noto Sans TC';font-style: normal;font-weight: 700;font-size: 14px;line-height: 150%;text-align: center;background: #D9D9D9;padding-top: 15px;">
                        <div style="padding: 0 50px;">HOMEE</div>
                        <div style="padding: 0 50px;">確定退出教學影片嗎?</div>
                        <div class="d-flex align-items-center" style="margin-top: 17px;padding: 0 50px;">
                            <input style="background: #D9D9D9;" type="checkbox" id="confirm-appear" >不再顯示教學影片
                        </div>
                        <div class="d-flex align-items-center">
                            <div class="w-50" style="padding: 16px 0;" onclick="${gvc.event(() => {
                glitter.closeDiaLog("leaveGuide");
            })}">取消</div>
                            <div class="w-50" style="padding: 16px 0;" onclick="${gvc.event(() => {
                let inputElement = (document.querySelector('#confirm-appear'));
                if (inputElement.checked) {
                    glitter.setPro("reShow", "true", () => {
                        glitter.closeDiaLog("leaveGuide");
                        appConfig().setHome(gvc, "myspace", {});
                    });
                }
                else {
                    glitter.closeDiaLog("leaveGuide");
                    appConfig().setHome(gvc, "myspace", {});
                }
            })}">確認</div>
                        </div>
                    </div>
                </div>
            `;
        }
    };
    function createIdeaByIMG() {
        glitter.runJsInterFace("selectIMG", {}, function (response) {
            glitter.changePage('jsPage/idea/idea_post.js', "idea_post", true, response);
        }, {
            webFunction(data) {
                return {
                    preview_image: ["https://machi-app.com/api/v1/image/sub_category/4.png", "https://machi-app.com/api/v1/image/sub_category/3.png", "https://machi-app.com/api/v1/image/sub_category/2.png", "https://machi-app.com/api/v1/image/sub_category/5.png", "https://machi-app.com/api/v1/image/sub_category/6.png"],
                    scene: "",
                    config: ""
                };
            }
        });
    }
    function createIdea() {
        glitter.runJsInterFace("selectModel", {}, function (response) {
            glitter.changePage('jsPage/idea/idea_selectPostImg.js', "idea_selectPostImg", true, response);
        }, {
            webFunction(data) {
                return {
                    preview_image: ["img/sample/idea/postimg.png", "img/sample/idea/postimg_2.png", "img/sample/idea/postimg.png", "img/sample/idea/postimg_2.png", "img/sample/idea/postimg.png", "img/sample/idea/postimg_2.png"],
                    scene: "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz",
                    config: {
                        "id": "E9ED7F76-116D-42A3-B616-C83684F36F01",
                        "key": "hhh",
                        "data": [{
                                "x": -1.5339330434799194,
                                "y": -1.2596129179000854,
                                "z": -0.35074079036712646,
                                "prodult": {
                                    "id": 7324687,
                                    "sku": "F010060-1-1",
                                    "name": "MARSILLY 餐椅",
                                    "spec": "",
                                    "price": 4890,
                                    "multiple": false,
                                    "is_select": false,
                                    "model_url": "https://machi-app.com/api/v1/assets/sku/20221027T020021-F010060-1-1.usdz",
                                    "select_count": 1,
                                    "preview_image": "https://cdn.store-assets.com/s/349867/i/41820128.png?width=720"
                                },
                                "rotation": 0
                            }],
                        "rout": "Documents/MySpace/1668048250482.usdz",
                        "time": 689741055.022742,
                        "store_time": "2022-11-10 10:44:15",
                        "server_rout": "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz"
                    }
                };
            }
        });
    }
});
