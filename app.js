const express = require("express");
const app = express();
const apiRouter = require(`${__dirname}/./routes/api.router.js`);
const topicsRouter = require(`${__dirname}/./routes/topics.router.js`);
const articlesRouter = require(`${__dirname}/./routes/articles.router.js`);
const commentsRouter = require(`${__dirname}/./routes/comments.router.js`);
const usersRouter = require(`${__dirname}/./routes/users.router.js`);
const cors = require('cors')

const {
	handlePsqlErrors,
	handleCustomErrors,
	handleServerErrors,
	handleInvalidEndpoints,
} = require(`${__dirname}/error_controller/errors.controller.js`);

app.use(cors());

app.use(express.json())

app.use("/api", apiRouter);

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/comments", commentsRouter)

app.use("/api/users", usersRouter)

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

app.all("/*", handleInvalidEndpoints);

module.exports = app;
