const { selectTopics } = require("../models/topics.model");

const {
	selectArticles,
	selectArticlesById,
	selectCommentsByArticleId,
	addCommentByArticleId,
	updateArticleVotes
} = require(`${__dirname}/../models/articles.model.js`);

function getArticles(request, response, next) {
	const {topic} = request.query
	const promises = [selectArticles(topic)]

	if(topic){
		promises.push(selectTopics(topic))
	}
	Promise.all(promises)
		.then((resolvedPromises) => {
			response.status(200).send({ articles: resolvedPromises[0] });
		})
		.catch((err) => {
			next(err);
		});
}

function getArticlesById(request, response, next) {
	const { id } = request.params;
	const queryField = request.query

	selectArticlesById(id, queryField)
		.then((article) => {
			response.status(200).send({ article });
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

function postCommentsByArticleId(request, response, next){
	const postBody = request.body
	const { article_id } = request.params

	selectArticlesById(article_id)
	.then(()=>{
		return addCommentByArticleId(postBody,article_id)
	})
	.then((postedComment)=>{
		response.status(201).send({comment: postedComment})
	})
	.catch((err)=>{
		next(err)
	})
}

function patchArticleById(request, response, next){
	const {article_id} = request.params
	const updateVotesValue = request.body
	updateArticleVotes(updateVotesValue,article_id)
	.then((patchedArticle)=>{
		response.status(200).send({article:patchedArticle})
	})
	.catch((err)=>{
		next(err)
	})
}

module.exports = { getArticles, getArticlesById, getCommentsByArticleId, postCommentsByArticleId, patchArticleById };
