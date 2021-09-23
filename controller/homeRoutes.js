const router = require("express").Router();
const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");

router.get("/login", (req, res) => {
	req.session.loggedIn = false;
	Post.findAll({}).then((dbPostData) => {
		const posts = dbPostData.map((post) => post.get({ plain: true }));
		res.render("login");
	});
});

router.get("/signup", (req, res) => {
	Post.findAll({}).then((dbPostData) => {
		const posts = dbPostData.map((post) => post.get({ plain: true }));
		res.render("signup");
	});
});

router.get("/dashboard", (req, res) => {
	Post.findAll({
		where: {
			user_id: req.session.user_id,
		},
	}).then((dbPostData) => {
		console.log("req.session: ", req.session);

		console.log("dbPostData: ", dbPostData);

		const post = dbPostData.map((post) => post.get({ plain: true }));
		console.log("post: ", post);

		if (req.session.loggedIn) {
			const data = {
				session: req.session,
				posts: post,
			};

			res.render("dashboard", data);
		} else {
			res.redirect("/login");
		}
	});
});

router.get("/", (req, res) => {
	console.log("======================");
	Post.findAll({
		attributes: ["id", "post_content", "title"],
		include: {
			model: User,
			attributes: ["username"],
		},
	})
		.then((dbPostData) => {
			console.log(dbPostData);

			const posts = dbPostData.map((post) => post.get({ plain: true }));

			res.render("homepage", {
				posts,
				session: req.session,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
