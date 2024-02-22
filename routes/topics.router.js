const topicsRouter = require('express').Router();
const { getTopics } = require(`${__dirname}/../controllers/topics.controller.js`);

topicsRouter.get('/', getTopics)

module.exports = topicsRouter