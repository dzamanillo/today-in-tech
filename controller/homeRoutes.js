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
		order: [["created_at", "DESC"]],
	}).then((dbPostData) => {
		const post = dbPostData.map((post) => post.get({ plain: true }));

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

router.get("/edit/:id", (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id,
		},
	}).then((dbPostData) => {
		const post = dbPostData.get({ plain: true });

		const data = {
			session: req.session,
			post: post,
		};

		res.render("edit-post", data);
	});
});

// Home page
router.get("/", (req, res) => {
	Post.findAll({
		attributes: ["id", "post_content", "title", "created_at"],
		include: [
			{
				model: User,
				attributes: ["username"],
			},
			{
				model: Comment,
				attributes: ["id", "comment_text", "user_id", "post_id"],
			},
		],
		order: [["created_at", "DESC"]],
	})
		.then((dbPostData) => {
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
