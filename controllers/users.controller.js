const { selectAllUsers } = require(`${__dirname}/../models/users.model.js`);

function getUsers(request, response, next) {
	selectAllUsers()
		.then((users) => {
			response.status(200).send({ users });
		})
		.catch((err) => {
			next(err);
		});
}

module.exports = {getUsers};
