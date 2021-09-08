const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// Get all users
// /api/users
router.get("/", (req, res) => {
	User.findAll({
		attributes: { exclude: ["password"] },
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
	User.findOne(
		{
			where: {
				id: req.params.id,
			},
		},
		{
			attributes: { exclude: ["password"] },
		}
	)
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

				res.json(dbUserData);
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// User login
// /api/login
router.post("/login", (req, res) => {
	User.findOne({
		where: {
			email: req.body.email,
		},
	}).then((dbUserData) => {
		if (!dbUserData) {
			res.status(400).json({ message: "No user with that email address" });
			return;
		}

		const validPassword = dbUserData.checkPassword(req.body.password);

		if (!validPassword) {
			res.status(400).json({ message: "Incorrect Password" });
			return;
		}

		req.session.save(() => {
			req.session.user_id = dbUserData.id;
			req.session.username = dbUserData.username;
			req.session.loggedIn = true;

			res.json({ user: dbUserData, message: "You are now logged in!" });
		});
	});
});

// User logout
// /api/logout
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

module.exports = router;
