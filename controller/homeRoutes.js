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
	Post.findAll({}).then((dbPostData) => {
		const posts = dbPostData.map((post) => post.get({ plain: true }));
		res.render("homepage", { posts });
	});
});

module.exports = router;
