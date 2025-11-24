import express from "express";
import { getAllUsers, getAUser, loginUser, myProfile, updateName, verifyUser } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/me", isAuth, myProfile);
router.put("/update-name", isAuth, updateName);
router.get("/all", isAuth, getAllUsers);
router.get("/:id", isAuth, getAUser);

export default router;
