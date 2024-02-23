const topicsRouter = require('express').Router();
const { getTopics, postTopic } = require(`${__dirname}/../controllers/topics.controller.js`);

topicsRouter
.route('/')
.get(getTopics)
.post(postTopic)

module.exports = topicsRouter