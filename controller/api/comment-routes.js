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

// create comment
// /api/comments
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

// delete comment
// /api/comments
router.delete("/:id", (req, res) => {
	Comment.destroy({
		where: {
			id: req.params.id,
		},
	})
		.then((dbCommentData) => {
			if (!dbCommentData) {
				res.status(400).json({ message: "No comment with this ID found." });
				return;
			}
			res.status(200).json(dbCommentData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
