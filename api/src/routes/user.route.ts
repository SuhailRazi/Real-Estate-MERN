import express from "express";
import {
  deleteUser,
  getCurrentUser,
  getUser,
  getUsers,
  updateUser,
} from "../controller/user.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", getUsers);
router.get("/currentUser", verifyToken, getCurrentUser);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
