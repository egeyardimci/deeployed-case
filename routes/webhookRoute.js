import express from "express";
import { webhookController } from "../controllers/webhookController";

const router = express.Router();

router.get("", webhookController);

export default router;
