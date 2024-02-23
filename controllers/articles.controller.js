const { selectTopics } = require("../models/topics.model");

const {
	selectArticles,
	selectArticlesById,
	selectCommentsByArticleId,
	addCommentByArticleId,
	updateArticleVotes,
	selectArticlesByColumn,
	addArticle, 
	removeArticleById, 
	removeCommentsByArticleId
} = require(`${__dirname}/../models/articles.model.js`);

function getArticles(request, response, next) {
	let {topic, sort_by, order, limit, p} = request.query
	const promises = []

	if(Object.keys(request.query).includes("sort_by") || Object.keys(request.query).includes("limit")){
		promises.push(selectArticlesByColumn(sort_by, order, limit, p))
	} else {
		promises.push(selectArticles(topic))
		if(topic){
			promises.push(selectTopics(topic))
		}
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
	const { article_id } = request.params;
	const queryField = request.query

	selectArticlesById(article_id, queryField)
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

function postArticle(request, response, next){
	const postBody = request.body
	addArticle(postBody)
	.then((postedArticle)=>{
		response.status(201).send({article: postedArticle})
	})
	.catch((err)=>{
		next(err)
	})
}

function deleteArticleById(request, response, next){
	const {article_id} = request.params
	removeCommentsByArticleId(article_id)
	.then(()=>{
		return removeArticleById(article_id)
	})
	.then(({body})=>{
        response.status(204).send(`Deleted: ${body}`)
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = { getArticles, getArticlesById, getCommentsByArticleId, postCommentsByArticleId, patchArticleById, postArticle, deleteArticleById};
