const db = require(`${__dirname}/../db/connection.js`)

function removeCommentById(comment_id){
    return db.query(
        `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`,[comment_id]
    )
    .then((result)=>{
        if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "not found" });
		}
        return result.rows[0]
    })
}

function updateCommentById(updateVotesValue,comment_id){
    const {inc_votes} = updateVotesValue
    const queryVals = [inc_votes,comment_id]

    const sqlQueryStr = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`

    return db.query(sqlQueryStr, queryVals)
    .then(({rows})=>{
        return rows[0]
    })
}

module.exports = {removeCommentById, updateCommentById}