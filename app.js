const express = require("express");
const { getApi } = require(`${__dirname}/controllers/api.controller.js`);
const { getTopics } = require(`${__dirname}/controllers/topics.controller.js`);
const {
	getArticles,
	getArticlesById,
	getCommentsByArticleId,
    postCommentsByArticleId,
    patchArticleById
} = require(`${__dirname}/controllers/articles.controller.js`);
const {
	handlePsqlErrors,
	handleCustomErrors,
	handleServerErrors,
	handleInvalidEndpoints,
} = require(`${__dirname}/error_controller/errors.controller.js`);

const app = express();
app.use(express.json())

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentsByArticleId)

app.patch("/api/articles/:article_id", patchArticleById)

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

app.all("/*", handleInvalidEndpoints);

module.exports = app;
