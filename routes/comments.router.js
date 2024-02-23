const commentsRouter = require('express').Router();
const {
    deleteCommentById, patchCommentById
} = require(`${__dirname}/../controllers/comments.controller.js`);

commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)
.patch(patchCommentById)

module.exports = commentsRouter