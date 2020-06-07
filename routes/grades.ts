import { Router } from "express";
import * as ctrl from "../controller/Grade.controller";
module.exports = (router: Router) => {
    router.get("/", ctrl.index);
    router.get("/total", ctrl.total);
    router.get("/average", ctrl.average);
    router.get("/best", ctrl.best);
    router.get("/:id", ctrl.show);
    router.post("/", ctrl.post);
    router.put("/:id", ctrl.put);
    router.delete("/:id", ctrl.remove);
    return router;
};
