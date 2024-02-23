const {
	selectTopics,
	addTopic
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

function postTopic(request, response, next){
	const postBody = request.body
	addTopic(postBody)
	.then((postedTopic)=>{
		response.status(201).send({topic: postedTopic})
	})
	.catch((err)=>{
		next(err)
	})
}

module.exports = { getTopics , postTopic };
