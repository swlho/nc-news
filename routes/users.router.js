const usersRouter = require('express').Router();
const {
    getUsers, getUserByUsername
} = require(`${__dirname}/../controllers/users.controller.js`);

usersRouter
.route("/")
.get(getUsers)

usersRouter
.route("/:username")
.get(getUserByUsername)

module.exports = usersRouter