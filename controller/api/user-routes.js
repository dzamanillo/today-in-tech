const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// Get all users
// /api/users
router.get("/", (req, res) => {
	User.findAll({
		attributes: { exclude: ["password"] },

		include: {
			model: Post,
			attributes: ["title"],
		},
	})
		.then((dbUserData) => {
			res.json(dbUserData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// Get single user
// /api/users/:id
router.get("/:id", (req, res) => {
	User.findOne({
		where: {
			id: req.params.id,
		},

		attributes: { exclude: ["password"] },

		include: {
			model: Post,
			attributes: ["title"],
		},
	})
		.then((dbUserData) => {
			if (!dbUserData) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}

			res.json(dbUserData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// Create user
// /api/users
router.post("/", (req, res) => {
	User.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
	})
		.then((dbUserData) => {
			req.session.save(() => {
				req.session.user_id = dbUserData.id;
				req.session.username = dbUserData.username;
				req.session.loggedIn = true;

				res.redirect("/");
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// User login
// /api/users/login
router.post("/login", (req, res) => {
	User.findOne({
		where: {
			username: req.body.username,
		},
	}).then((dbUserData) => {
		if (!dbUserData) {
			const data = {
				error: true,
			};

			res.status(400).render("login", data);
			return;
		}

		const validPassword = dbUserData.checkPassword(req.body.password);

		if (!validPassword) {
			const data = {
				error: true,
			};
			res.status(400).render("login", data);
			return;
		}

		req.session.save(() => {
			req.session.user_id = dbUserData.id;
			req.session.username = dbUserData.username;
			req.session.loggedIn = true;
			error = false;

			res.redirect("/");
		});
	});
});

// User logout
// /api/users/logout
router.post("/logout", (res, req) => {
	if (req.session.loggedIn) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

// Update User
// /api/users/id
router.put("/:id", (req, res) => {
	User.update(req.body, {
		individualHooks: true,
		where: {
			id: req.params.id,
		},
	})
		.then((dbUserData) => {
			if (!dbUserData[0]) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}
			res.json(dbUserData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// delete user
// /api/users/id
router.delete("/:id", (req, res) => {
	User.destroy({
		where: {
			id: req.params.id,
		},
	})
		.then((dbUserData) => {
			if (!dbUserData) {
				res.status(400).json({ message: "No user with that ID found." });
				return;
			}
			res.json(dbUserData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
