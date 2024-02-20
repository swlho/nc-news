const express = require("express")
const {getTopics, getApi, getArticles} = require(`${__dirname}/controllers/topics.controller.js`)
const {handlePsqlErrors, handleCustomErrors, handleServerErrors, handleInvalidEndpoints} = require(`${__dirname}/controllers/errors.controller.js`)

const app = express()

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:id", getArticles)

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)

app.all("/*",handleInvalidEndpoints)

module.exports = app