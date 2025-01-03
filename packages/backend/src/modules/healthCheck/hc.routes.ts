import { Router } from "express";
import healthCheckController from "./hc.controller";


const router = Router()

router.get("/", healthCheckController.checkGeneral);
// router.get("/db", healthCheckController.checkDatabase);


export default router
