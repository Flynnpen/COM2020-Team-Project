import { Router } from "express";
import { getCoinBalance, getCoinHistory } from "../controllers/coins.controller.js";

const router = Router();

router.get("/", getCoinBalance); // GET /coins
router.get("/history", getCoinHistory); // GET /coins/history

export default router;