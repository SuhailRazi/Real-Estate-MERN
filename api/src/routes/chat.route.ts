import {
  addChat,
  getChats,
  getOneChat,
  readChat,
} from "../controller/chat.controller";
import { verifyToken } from "../middleware/verifyToken";
import express from "express";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getOneChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);

export default router;
