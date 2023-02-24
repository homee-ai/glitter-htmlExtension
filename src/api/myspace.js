import { appConfig } from "../config.js";
export class Myspace {
    static getModelList(callback) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/scene/myScene`,
                    type: 'get',
                    headers: { Authorization: response.token },
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        console.log(JSON.stringify(response));
                        callback(response.config);
                    },
                    error: (err) => {
                        callback(false);
                    },
                });
            }
        });
    }
}
