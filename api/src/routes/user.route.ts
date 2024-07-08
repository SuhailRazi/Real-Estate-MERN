import express from "express";
import {
  deleteUser,
  getCurrentUser,
  getUser,
  getUsers,
  profilePosts,
  savePosts,
  updateUser,
} from "../controller/user.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", getUsers);
router.get("/currentUser", verifyToken, getCurrentUser);
// router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePosts);
router.get("/profilePost", verifyToken, profilePosts);

export default router;
