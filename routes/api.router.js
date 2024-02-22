const apiRouter = require('express').Router();
const { getApi } = require(`${__dirname}/../controllers/api.controller.js`);

apiRouter.get('/', getApi)

module.exports = apiRouter