const articlesRouter = require('express').Router();
const {
	getArticles,
	getArticlesById,
	getCommentsByArticleId,
    postCommentsByArticleId,
    patchArticleById,
	postArticle,
	deleteArticleById,
	getArticlesByTopicQueried
} = require(`${__dirname}/../controllers/articles.controller.js`);

articlesRouter
.route("/")
.get(getArticles)
.post(postArticle);

articlesRouter
.route("/:article_id")
.get(getArticlesById)
.delete(deleteArticleById);

articlesRouter
.route("/?topic")
.get(getArticles)

articlesRouter
.route("/?topic=value&sort_by=value&order=value")
.get(getArticlesByTopicQueried)

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
.route("/articles?limit=value&p=value")
.get(getArticles)

articlesRouter
.route("/:article_id/comments")
.post(postCommentsByArticleId)

articlesRouter
.route("/:article_id")
.patch(patchArticleById)

module.exports = articlesRouter