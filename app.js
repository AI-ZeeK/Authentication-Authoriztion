import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import routerIndex from "./routes/index.js";
import routerUsers from "./routes/users.js";
import valid from "./config/keys.js";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import xPassport from "./config/passport.js";

const app = express();

// Passport config
xPassport(passport);
// DB CONFIG
const db = valid.MONGO_URI;

//connect to mongo
const mongoCon = async () => {
	await mongoose.connect(db, { useNewUrlParser: true });
	try {
		console.log("Mongodb connected");
	} catch (err) {
		console.log(err);
	}
};
mongoCon();

// EJS
app.use(express.static("public")); /* Static Folder */
app.use(expressEjsLayouts);
app.set("view engine", "ejs");

// BodyParser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
	session({
		secret: "Secret",
		resave: true,
		saveUninitialized: true,
	})
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//  Connect flash
app.use(flash());

//  Global Variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

// Routes
app.use("/", routerIndex);
app.use("/users", routerUsers);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
