"use strict";
(() => {
    const glitter = window.glitter;
    class ApiModel {
        showAlert() {
            alert(12345);
        }
        constructor() {
        }
    }
    glitter.share.apiModel = new ApiModel();
})();
