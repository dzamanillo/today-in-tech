const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

//get all posts
// /api/posts
router.get("/", (req, res) => {
	Post.findAll({
		include: {
			model: User,
			attributes: ["username"],
		},
		include: {
			model: Comment,
			attributes: ["comment_text"],
			include: {
				model: User,
				attributes: ["username"],
			},
		},
	})
		.then((dbPostData) => {
			res.status(200).json(dbPostData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// get a post
// /api/posts/id
router.get("/:id", (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id,
		},

		include: [
			{
				model: User,
				attributes: ["username"],
			},
			{
				model: Comment,
				attributes: ["comment_text", "created_at"],
				include: {
					model: User,
					attributes: ["username"],
				},
			},
		],
	})
		.then((dbPostData) => {
			const post = dbPostData.get({ plain: true });

			const { comments } = post;

			const data = {
				session: req.session,
				post: post,
				comments: comments,
			};
			res.render("single-post", data);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// create post
// /api/posts
router.post("/", (req, res) => {
	Post.create({
		title: req.body.title,
		post_content: req.body.post_content,
		user_id: req.session.user_id,
	})
		.then((dbUserData) => {
			res.redirect("/dashboard");
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// api/posts/:id
router.put("/edit", (req, res) => {
	Post.update(
		{
			title: req.body.title,
			post_content: req.body.post_content,
			user_id: req.session.user_id,
		},
		{
			where: {
				id: req.body.id,
			},
		}
	)
		.then((dbPostData) => {
			if (!dbPostData) {
				res.status(400).json({ message: "No user found with that ID." });
				return;
			}
			res.send("you did it");
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// delete post
// /api/posts/:id
router.delete("/:id", (req, res) => {
	Post.destroy({
		where: {
			id: req.params.id,
		},
	})
		.then((dbPostData) => {
			if (!dbPostData) {
				res.status(400).json({ message: "No post with that ID found." });
				return;
			}
			res.json(dbPostData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
