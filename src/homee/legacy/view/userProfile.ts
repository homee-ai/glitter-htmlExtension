import {GVC} from '../glitterBundle/GVController.js';



export class ViewModel{
    public gvc:GVC
    constructor(gvc: GVC) {
        this.gvc=gvc;
    }
    inputRow=(data:any ,readonly=""  )=>{
        const gvc=this.gvc;

        const glitter=this.gvc.glitter;
        //屬性
        //客戶的我的空間那列的資訊 記得問一下這個是不是該放這 以及中間icon部分應該跟圖檔做連結 要怎麼搞
        gvc.addStyle(`
             select{
               color:black!important;
               border: none;
               background-color: transparent;
               font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 23px;
             }
            .input-row{
                margin-bottom : 28px;
            }
            .left{
                width : 21%;
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 26px;
                /* identical to box height */
                
                
                /* HOMEE black */
                
                color: #292929;
            }
            .right{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 23px;
                
                /* HOMEE black */
                
                color: #292929;
                
                border-bottom: 1px solid #E0E0E0;
            }
            .city{
                height : 28px;
                width : 45%;
                margin-right:12px;
                border:0;
                border-bottom: 1px solid #E0E0E0;
                
            }
            .town{
                height : 28px;
                width : 45%;
                border:0;
                border-bottom: 1px solid #E0E0E0;
            }
            .pwInput::placeholder {
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
                display: flex;
                align-items: center;

                color: #E0E0E0;
            }
            .pwCheck{
                height: 17px;
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;
                color: #FD6A58;
                position: absolute;
                right:0;
                bottom:calc(50% - 8.5px);
            }

            }   
        `)
        // //方法
        //
        // //畫面
        //
        function changeInputData(){

        }
        switch (data.type){
            case "name" :
                return `
                    ${gvc.bindView({
                        bind : `${data.name}-inputRow`,
                        view : ()=>{
                            return `                            
                                <div class="left" style="">${data.left}</div>
                                <div class="right" style="width: calc(39% - 12px);margin-right: 12px;">
                                    <input class="w-100 border-0" name="lastName" type="text" value="${data.placehold.last}" ${readonly} 
                                    onblur="${gvc.event((e:HTMLInputElement)=>{ data.placehold.last = e.value;})}">                                                                        
                                </div>
                                <div class="right" style="width: 39%">
                                    <input class="w-100 border-0" name="firstName" type="text" value="${data.placehold.first}" ${readonly}                                    
                                    onblur="${gvc.event((e:HTMLInputElement)=>{ data.placehold.first = e.value;})}">
                                </div>
                                
                            `
                        },
                        divCreate : {style : `` , class : `d-flex align-items-center input-row`}
                    })}
                
                `
            case "password" :
                return `
                    ${gvc.bindView({
                    bind : `${data.name}-inputRow`,
                    view : ()=>{
                        
                        return `                            
                                <div class="left" style="">${data.left}</div>
                                <div class="right" style="width: 78%;position: relative">
                                    <input class="w-100 border-0 pwInput" name="password" type="password" placeholder="輸入新密碼" ${readonly} onchange="${gvc.event((e:HTMLInputElement)=>{
                                        data.placehold=e.value      
                                    })}">                               
                                </div>                               
                                
                            `
                    },
                    divCreate : {style : `` , class : `d-flex align-items-center input-row`}
                })}
                `
            case "address" :
                return `
                    ${gvc.bindView({
                    bind : `${data.name}-inputRow`,
                    view : ()=>{
                        return `                            
                        <div class="left" style="">${data.left}</div>
                        <div class="right"  style="width: 78%;margin-right: 12px;">
                            <div id="zipcode">
                                                              
                            </div>   
                            <input class="w-100 border-0 areaData" name="address" style="margin-top: 27px;" ${readonly} onchange="${gvc.event((e:HTMLInputElement)=>{
                                // @ts-ignore
                                let county = $("#zipcode").twzipcode('get', 'county,district,zipcode');
                                data.placehold = `${county[0]} ${county[2]} ${county[1]} ${e.value}`
                            })}">                             
                        </div>
                            
                               
                        `
                    },
                    divCreate : {style : `` , class : `w-100 d-flex align-items-center input-row`},
                    onCreate : ()=>{
                        if (data.type == "address"){
                            gvc.addMtScript([{
                                src: 'https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js'
                            } , {src:`https://cdn.jsdelivr.net/npm/jquery-twzipcode@1.7.14/jquery.twzipcode.min.js`}
                            ], () => {
                                let dataArray = data.placehold.split(" ");
                                if(data.placehold){
                                    (document.querySelector('.areaData') as HTMLInputElement).value = dataArray[3];    
                                }
                                
                                // @ts-ignore
                                $("#zipcode").twzipcode({
                                    zipcodeIntoDistrict: true,
                                    css: ["city ", "town"],
                                    countyName: "city", // 指定城市 select name
                                    districtName: "town", // 指定地區 select name
                                    countySel: dataArray[0],
                                    districtSel : dataArray[2],
                                    onCountySelect:()=>{
                                    //    避免先填下方資料 最後選區導致的資料抓取不完全
                                        let areaData = document.querySelector(".areaData") as HTMLInputElement;
                                        // @ts-ignore
                                        let county = $("#zipcode").twzipcode('get', 'county,district,zipcode');
                                        data.placehold = `${county[0]} ${county[2]} ${county[1]} ${areaData.value}`
                                    },
                                    onDistrictSelect:()=>{
                                    //    避免先填下方資料 最後選區導致的資料抓取不完全
                                        let areaData = document.querySelector(".areaData") as HTMLInputElement;
                                        // @ts-ignore
                                        let county = $("#zipcode").twzipcode('get', 'county,district,zipcode');
                                        data.placehold = `${county[0]} ${county[2]} ${county[1]} ${areaData.value}`
                                    }
                                });
                                
                                
                            }, () => {
                            })
                            
                            
                        }
                    }
                })}
                
                `

            default : return `
                ${gvc.bindView({
                    bind : `${data.name}-inputRow`,
                    view : ()=>{
                        return `                            
                            <div class="left" style="">${data.left}</div>
                            <div class="right" style="width: 78%;">
                                <input class="w-100 border-0" name="${data.name}" type="${data.type}" ${readonly} value="${data.placehold}"
                                onchange="${gvc.event((e:HTMLInputElement)=>{ data.placehold = e.value;})}">
                            </div>
                            
                        `
                    },
                    divCreate : {style : `` , class : `d-flex align-items-center input-row`}
                })}
                
            
            `;
        }

    }
}




