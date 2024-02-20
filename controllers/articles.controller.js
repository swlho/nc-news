const {
	selectArticles,
	selectArticlesById,
	selectCommentsByArticleId,
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

function getCommentsByArticleId(request, response, next) {
	const { article_id } = request.params;
	const promises = [selectCommentsByArticleId(article_id)];

	if (article_id) {
		promises.push(selectArticlesById(article_id));
	}

	Promise.all(promises)
		.then((resolvedPromises) => {
			response.status(200).send({ comments: resolvedPromises[0] });
		})
		.catch((err) => {
			next(err);
		});
}

module.exports = { getArticles, getArticlesById, getCommentsByArticleId };
