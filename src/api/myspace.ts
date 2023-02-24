import {appConfig} from "../config.js";

export interface Space {
    id:string,
    key:string,
    data:string,
    rout:string,
    time:number,
    store_time:string,
    server_rout:string,
    space_image:string
}

export class Myspace {
    public static getModelList(callback:(space:Space[]|boolean)=>void) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/scene/myScene`,
                    type: 'get',
                    headers: {Authorization: response.token},
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        console.log(JSON.stringify(response))
                        callback(response.config as Space[])
                        // alert(JSON.stringify(response))
                    },
                    error: (err: any) => {
                        callback(false)
                        // alert(JSON.stringify(response))
                    },
                });
            }
        })
    }
}
