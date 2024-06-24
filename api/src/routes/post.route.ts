import {
  createPost,
  deletePost,
  getAllPost,
  getPost,
  updatePost,
} from "../controller/post.controller";
import { verifyToken } from "../middleware/verifyToken";
import express from "express";

const router = express.Router();

router.get("/", verifyToken, getAllPost);
router.get("/:id", verifyToken, getPost);
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
