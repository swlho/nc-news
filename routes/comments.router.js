const commentsRouter = require('express').Router();
const {
    deleteCommentById
} = require(`${__dirname}/../controllers/comments.controller.js`);

commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)

module.exports = commentsRouter