import express from "express";

const router = express.Router();
import bcrypt from "bcryptjs";
import passport from "passport";

// USER MODEl
import User from "../models/user.js";

// Login Page
router.get("/login", (req, res) => {
	res.render("login");
});

// Register Page
router.get("/register", (req, res) => {
	res.render("register");
});

// Register Handle
router.post("/register", (req, res) => {
	const { name, email, password, password2 } = req.body;
	let errors = [];
	//  check required fields
	if (!name || !email || !password || !password2) {
		errors.push({ msg: "Please fill in all fields" });
	}
	//  Check passwords match
	if (password !== password2) {
		errors.push({ msg: "Passwords do not match " });
	}

	// Check pass length
	if (password.length < 6) {
		errors.push({ msg: "Password should be at least 6 characters" });
	}

	if (errors.length > 0) {
		res.render("register", {
			errors,
			name,
			email,
			password,
			password2,
		});
	} else {
		const searchUser = async () => {
			const user = await User.findOne({ email: email });
			try {
				if (user) {
					// User exists
					errors.push({ msg: "Email is already registered" });
					res.render("register", {
						errors,
						name,
						email,
						password,
						password2,
					});
				} else {
					const newUser = new User({ name, email, password });
					// Hash password
					bcrypt.genSalt(10, (err, salt) =>
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;
							// Set password to hashed
							newUser.password = hash;
							// Save user
							const saveUser = async () => {
								await newUser.save();

								try {
									req.flash(
										"success_msg",
										"You are now registered and can log in"
									);
									res.redirect("/users/login");
								} catch (err) {
									console.log(err);
								}
							};
							saveUser();
						})
					);
				}
			} catch (err) {
				console.log(err);
			}
		};
		searchUser();
	}
});

// login handle
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
});

router.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success_msg", "You are logged out");
		res.redirect("/users/login");
	});
});

export default router;
