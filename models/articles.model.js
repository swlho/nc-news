const db = require(`${__dirname}/../db/connection.js`);

function selectArticles() {
	const sqlQueryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
        `;
	return db.query(sqlQueryStr).then((result) => {
		return result.rows;
	});
}

function selectArticlesById(id = null) {
	let sqlQueryStr = ``;
	const queryVals = [];
	if(id) {
		sqlQueryStr += `SELECT * FROM articles WHERE article_id = $1`;
		queryVals.push(id);
	}
	return db.query(sqlQueryStr, queryVals)
    .then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "not found" });
		}
		return result.rows[0];
	});
}

function selectCommentsByArticleId(id = null) {
	let sqlQueryStr = `SELECT * FROM comments`;
	const queryVals = [];

	if (id) {
		sqlQueryStr += ` WHERE article_id = $1`;
		queryVals.push(id);
	}

	sqlQueryStr += " ORDER BY created_at DESC";

	return db.query(sqlQueryStr, queryVals).then((result) => {
		if (result.rows.length === 1) {
			return result.rows[0];
		}
		return result.rows;
	});
}

function addCommentByArticleId(postBody,id){
    const {body, votes, author} = postBody
    let sqlQueryStr = `
    INSERT INTO comments
    (body, author, votes, article_id)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
    `
    const queryVals = [body, author, votes, id]

    return db.query(sqlQueryStr,queryVals)
    .then(({rows})=>{
        return rows[0]
    })
}

module.exports = {
	selectArticles,
	selectArticlesById,
	selectCommentsByArticleId,
    addCommentByArticleId
};
