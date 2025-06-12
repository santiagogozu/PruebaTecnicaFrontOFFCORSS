import express from "express";
// import {login} from "../controller/authController.js";
import {create} from "../controller/userController.js";
const router = express.Router();

// router.post("/login", login);
router.post("/create", create);

export default router;
