const {
	selectArticles, selectArticlesById
} = require(`${__dirname}/../models/articles.model.js`);

function getArticles(request, response, next) {
	selectArticles()
		.then((articles) => {
			response.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
}

function getArticlesById(request, response, next) {
	const { id } = request.params;
	selectArticlesById(id)
		.then((articles) => {
			response.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
}

module.exports = {getArticles, getArticlesById}