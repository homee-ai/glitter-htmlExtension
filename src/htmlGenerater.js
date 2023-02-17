import { init } from "./glitterBundle/GVController.js";
import { HtmlGenerate } from "./glitterBundle/module/Html_generate.js";
init(function (gvc, glitter, gBundle) {
    const htmlGenerate = new HtmlGenerate(gBundle.config, []);
    return {
        onCreateView: () => {
            return htmlGenerate.render(gvc);
        }
    };
});
