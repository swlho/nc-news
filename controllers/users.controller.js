const { selectAllUsers, selectUserByUsername} = require(`${__dirname}/../models/users.model.js`);

function getUsers(request, response, next) {
	selectAllUsers()
		.then((users) => {
			response.status(200).send({ users });
		})
		.catch((err) => {
			next(err);
		});
}

function getUserByUsername(request, response, next){
	const {username} = request.params
	selectUserByUsername(username)
		.then((user) => {
			response.status(200).send({ user });
		})
		.catch((err) => {
			next(err);
		});
}


module.exports = {getUsers, getUserByUsername};
