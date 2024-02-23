const {
	removeCommentById, updateCommentById
} = require(`${__dirname}/../models/comments.model.js`);

function deleteCommentById(request, response, next){
    const {comment_id} = request.params
    removeCommentById(comment_id)
    .then(({body})=>{
        response.status(204).send(`Deleted: ${body}`)
    })
    .catch((err)=>{
        next(err)
    })
}

function patchCommentById(request, response, next){
    const {comment_id} = request.params
    const updateVotesValue = request.body
    updateCommentById(updateVotesValue, comment_id)
    .then((patchedComment)=>{
		response.status(200).send({comment:patchedComment})
	})
	.catch((err)=>{
		next(err)
	})
}

module.exports = {deleteCommentById, patchCommentById}