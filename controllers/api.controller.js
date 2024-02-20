const {
	selectEndpoints
} = require(`${__dirname}/../models/api.model.js`);

function getApi(request, response, next) {
	selectEndpoints()
		.then((endpoints) => {
			response.status(200).send(endpoints);
		})
		.catch((err) => {
			next(err);
		});
}

module.exports = { getApi };