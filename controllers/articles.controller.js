const {
	selectArticles,
} = require(`${__dirname}/../models/articles.model.js`);

function getArticles(request, response, next) {
	const { id } = request.params;
	selectArticles(id)
		.then((articles) => {
			response.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
}

module.exports = {getArticles}