const router = require("express").Router();
const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");

router.get("/login", (req, res) => {
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
				loggedIn: req.session.loggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
