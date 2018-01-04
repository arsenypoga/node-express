//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   R O U T E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//
const Chance = require("chance");
const chance = Chance();

module.exports = (express, logger) => {
	const router = express.Router();

	//
	// ─── GET USER ───────────────────────────────────────────────────────────────────
	//

	router.get("/user", (req, res) => {
		res.status(200).json({
			user: {
				email: chance.email(),
				token: chance.guid(),
				username: chance
					.email()
					.split("@", 1)
					.join(""),
				bio: "Mios dio",
				image: null,
			},
		});
	});

	//
	// ─── UPDATE USER ────────────────────────────────────────────────────────────────
	//

	router.put("/user", (req, res) => {
		res.status(200).json({
			user: {
				email: req.body.user.email,
				token: req.body.user.token,
				username: req.body.user.username,
				bio: req.body.user.bio,
				image: req.body.user.image,
			},
		});
	});

	//
	// ─── AUTHENTIFICATION ───────────────────────────────────────────────────────────
	//
	router.post("/users/login", (req, res) => {
		logger.debug("Request body: " + req.body.toString());

		if (!req.body.user.email) {
			return res.status(422).json({
				errors: {
					email: "can't be blank",
				},
			});
		}

		if (!req.body.user.password) {
			return res.status(422).json({
				errors: {
					password: "can't be blank",
				},
			});
		}
		// TODO: Get user from the database
		return res.status(200).json({
			user: {
				email: req.body.user.email,
				token: chance.guid(),
				username: req.body.user.password,
				bio: "Mios dio",
				image: null,
			},
		});
	});

	//
	// ─── REGISTRATION ───────────────────────────────────────────────────────────────
	//
	router.post("/users", (req, res) => {
		logger.debug("Request body: " + req.body);

		if (!req.body.user.password) {
			return res.status(422).json({
				errors: {
					password: "can't be blank",
				},
			});
		}
		if (!req.body.user.username) {
			return res.status(422).json({
				errors: {
					username: "can't be blank",
				},
			});
		}
		if (!req.body.user.email) {
			return res.status(422).json({
				errors: {
					email: "can't be blank",
				},
			});
		}

		return res.status(200).json({
			user: {
				email: req.body.user.email,
				token: chance.guid(),
				username: chance.email().split("@", 0),
				bio: "Mios dio",
				image: null,
			},
		});
	});

	return router;
};
