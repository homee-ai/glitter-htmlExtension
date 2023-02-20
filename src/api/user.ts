import {Glitter} from "../glitterBundle/Glitter.js"
import {Plugin} from "../glitterBundle/plugins/plugin-creater.js";
import {appConfig} from "../config.js";
export class User {
    public static getUserData(next: () => void){
        const glitter=Glitter.glitter
        glitter.runJsInterFace("getUserData", {}, function (response) {
            glitter.share.userData = response.data
            Plugin.setAppConfig('HOMEEAppConfig',{
                token:glitter.share.userData.AUTH,
                serverURL:glitter.share.apiURL
            })
            next()
        }, {
            webFunction(data: {}, callback: (data: any) => void): any {
                $.ajax({
                    url: `${glitter.share.apiURL}/api/v1/user/login`,
                    type: 'post',
                    data: JSON.stringify({email: 'sam94074@gmail.com', pwd: `sam12345`}),
                    contentType: 'application/json; charset=utf-8',
                    success: (suss: any) => {
                        console.log(suss)
                        callback({
                            data: {
                                user_id: 12052350,
                                last_name: "Rdtest",
                                first_name: "Rdtes22t",
                                name: "Rdtest Rd",
                                photo: suss.photo,
                                AUTH: suss.token
                            },
                            beta:true
                        })
                    },
                    error: (err: any) => {
                    },
                });
            }
        })
    }

    public static setUserData(userData:any,next: (response:any) => void){
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user`,
            type: 'put',
            data: JSON.stringify(userData),
            headers: {Authorization: userData.token},
            contentType: 'application/json; charset=utf-8',
            success: (suss: any) => {
                next(suss)
            },
            error: (err: any) => {
                next(false)
            },
        });
    }
    public static login({account,pwd,callback}: { account: string, pwd: string, callback: (data: { user_id: number; last_name: string; first_name: string; name: string; photo: string; AUTH: string } | boolean) => void }){
        const glitter=Glitter.glitter
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user/login`,
            type: 'post',
            data: JSON.stringify({email: account, pwd: pwd}),
            contentType: 'application/json; charset=utf-8',
            success: (suss: any) => {
                if(suss){
                    suss.pwd=pwd
                    appConfig().setUserData({
                        value:suss,callback:(response)=>{
                            Plugin.setAppConfig('HOMEEAppConfig',{
                                token:suss.token,
                                serverURL:appConfig().serverURL
                            })
                        }
                    })
                }
                callback(suss)
            },
            error: (err: any) => {
                callback(false)
            },
        });
    }

    public static checkUserExists(account:string,callback:(result:boolean|undefined)=>void){
        const glitter=Glitter.glitter
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user/checkUserExist`,
            type: 'get',
            data: JSON.stringify({email: account, pwd: `sam12345`}),
            contentType: 'application/json; charset=utf-8',
            success: (suss: any) => {
                callback(suss.exists)
            },
            error: (err: any) => {
                callback(false)
            },
        });
    }

    public static checkToken(token:string,callback:(result:boolean)=>void){
        const glitter=Glitter.glitter
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user/checkToken`,
            type: 'get',
            headers: {Authorization: token},
            data: JSON.stringify({token:token}),
            contentType: 'application/json; charset=utf-8',
            success: (suss: any) => {
                callback(suss.result)
            },
            error: (err: any) => {
                callback(false)
            },
        });
    }

}