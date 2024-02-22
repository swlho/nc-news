const articlesRouter = require('express').Router();
const {
	getArticles,
	getArticlesById,
	getCommentsByArticleId,
    postCommentsByArticleId,
    patchArticleById
} = require(`${__dirname}/../controllers/articles.controller.js`);

articlesRouter
.route("/")
.get(getArticles);

articlesRouter
.route("/:id")
.get(getArticlesById);

articlesRouter
.route("/?topic")
.get(getArticles)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)

articlesRouter
.route("/:article_id?comment_count")
.get(getArticlesById)

articlesRouter
.route("/articles?sort_by=value&order=value")
.get(getArticles)

articlesRouter
.route("/:article_id/comments")
.post(postCommentsByArticleId)

articlesRouter
.route("/:article_id")
.patch(patchArticleById)

module.exports = articlesRouter