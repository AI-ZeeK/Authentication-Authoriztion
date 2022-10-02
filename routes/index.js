import express from "express";
const router = express.Router();
import authValid from "../config/auth.js";

const { ensureAuthenticated } = authValid;

// Welcome page
router.get("/", (req, res) => {
	res.render("welcome");
});

// Dashboard page
router.get("/dashboard", ensureAuthenticated, (req, res) => {
	res.render("dashboard", {
		name: req.user.name,
	});
});
export default router;
