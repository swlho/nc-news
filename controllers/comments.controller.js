const {
	removeCommentById
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

module.exports = {deleteCommentById}