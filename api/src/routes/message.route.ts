import { addMessage } from "../controller/message.controller";
import { verifyToken } from "../middleware/verifyToken";
import express from "express";

const router = express.Router();

router.post("/:id", verifyToken, addMessage);

export default router;
