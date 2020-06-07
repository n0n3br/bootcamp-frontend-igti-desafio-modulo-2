import fs from "fs";
import path from "path";
import express, { Application } from "express";
import snakeCase from "lodash/snakeCase";
export default (app: Application) => {
    try {
        fs.readdirSync(path.join(__dirname)).forEach((file) => {
            if (file == "index.ts") return;
            const routePath = snakeCase(file.replace(".ts", ""));
            const router = express.Router();
            const route = require(path.join(__dirname, file))(router);
            app.use("/" + routePath, route);
            console.info(`route ${routePath} initialized`);
        });
    } catch (error) {
        console.error(error);
    }
};
