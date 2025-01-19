import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/send/:id", protectRoute,sendMessage);  
// protectRoute is a middleware to protect the route so that we can use req.user._id in the controller

export default router;