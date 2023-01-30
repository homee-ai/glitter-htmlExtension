const glitter = (window as any).glitter
class ApiModel{
    public showAlert(){
        alert(12345)
    }
    constructor() {
    }

}
glitter.share.apiModel=new ApiModel()
