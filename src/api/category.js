import { appConfig } from "../config.js";
export class Category {
    constructor(glitter) {
        this.glitter = glitter;
    }
    getSubcategoryList(parCategoryID, callback) {
        const glitter = this.glitter;
        const that = this;
        let jsonData;
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/category`,
            type: 'get',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            success: (resposnse) => {
                let allCategoryList = resposnse["category_list"];
                let returnData;
                allCategoryList.forEach((categoryData) => {
                    if (categoryData["store_id"] == parCategoryID) {
                        returnData = categoryData.sub_category;
                    }
                });
                callback(returnData);
            },
            error: (e) => {
                setTimeout(() => {
                }, 1000);
            },
        });
    }
    getCategoryData(parameter, value, callback) {
        const glitter = this.glitter;
        const that = this;
        let jsonData;
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/product?easy_id=1&${parameter}=${value}`,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            success: (response) => {
                console.log(response);
                callback(response["product_list"]);
            },
            error: (e) => {
                setTimeout(() => {
                }, 1000);
            },
        });
    }
    getCategoryAllList(callback) {
        const glitter = this.glitter;
        const that = this;
        let jsonData;
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/category`,
            type: 'get',
            data: '',
            contentType: 'application/json; charset=utf-8',
            success: (response) => {
                callback(response['category_list']);
            },
            error: (e) => {
                setTimeout(() => {
                }, 1000);
            },
        });
    }
}
