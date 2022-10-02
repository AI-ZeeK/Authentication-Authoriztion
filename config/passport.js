import LocalStrategy from "passport-local";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const passportStrategy = LocalStrategy.Strategy;
// User Model

import User from "../models/user.js";
import passport from "passport";

const xPassport = (passport) => {
	passport.use(
		new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
			// Match User
			const matchUser = async () => {
				const user = await User.findOne({ email: email });
				try {
					if (!user) {
						return done(null, false, {
							message: "That email is not registered",
						});
					}
					// Math password
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) throw err;
						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false, { message: "password incorrect" });
						}
					});
				} catch (err) {
					console.log(err);
				}
			};
			matchUser();
		})
	);
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};

export default xPassport;
