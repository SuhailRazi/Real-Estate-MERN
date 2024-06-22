import express from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controller/test.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);

router.get("/should-be-admin", shouldBeAdmin);

export default router;
