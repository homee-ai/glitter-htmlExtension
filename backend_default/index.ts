import * as Glitter from '@jianzhi.wang/glitter';
import path from "path";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
//Glitter FrontEnd Rout
const app = express();
(async () => {
    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    app.use(express.text())
    app.use(express.json())
    app.use(cors(corsOptions));
    await app.listen(3090);
})();

/*
* http://127.0.0.1:3090/test/official.js
* */
app.post("/gb", async function(req:any, res:any) {

    console.log(req.body);
    return res.send(req.body)
})

Glitter.setUP(app, [
    {
        rout: '/test',
        path: path.resolve(__dirname, '../../src'),
        seoManager:()=>{
            return ''
        }
    },
]);
Glitter.setUP(app, [
    {
        rout: '/test2',
        path: path.resolve(__dirname, '../../src'),
        seoManager:()=>{
            return ''
        }
    },
]);