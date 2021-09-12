const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// get all comments
// /api/comments
router.get("/", (req, res) => {
	Comment.findAll({
		include: {
			model: Post,
			attributes: ["title"],
			include: {
				model: User,
				attributes: ["username"],
			},
		},
	})
		.then((dbCommentData) => {
			res.status(200).json(dbCommentData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// TODO get comments by user

// TODO get comments by post

// TODO get single comment

// create comment
router.post("/", (req, res) => {
	Comment.create({
		comment_text: req.body.comment_text,
		user_id: req.session.user_id,
		post_id: req.body.post_id,
	})
		.then((dbCommentData) => {
			res.status(200).json(dbCommentData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
