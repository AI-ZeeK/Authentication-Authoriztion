const authValid = {
	ensureAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash("error_msg", "Please login in to view this resource");
		res.redirect("/users/login");
	},
};

export default authValid;
