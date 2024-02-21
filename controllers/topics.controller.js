const {
	selectTopics,
	selectEndpoints
} = require(`${__dirname}/../models/topics.model.js`);

function getTopics(request, response, next) {
	selectTopics()
		.then((topics) => {
			response.status(200).send({ topics });
		})
		.catch((err) => {
			next(err);
		});
}

module.exports = { getTopics };
