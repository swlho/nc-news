const db = require(`${__dirname}/../db/connection.js`)

function selectArticles(id=null){
    let sqlQueryStr = ``
    const queryVals = []

    if(id){
        sqlQueryStr += `SELECT * FROM articles WHERE article_id = $1`
        queryVals.push(id)
    } else {
        sqlQueryStr += `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
        `
    }

    return db.query(sqlQueryStr,queryVals)
    .then((result)=>{
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "not found" });
		}
        if (result.rows.length === 1){
            return result.rows[0]
        }
        return result.rows
    })
}
module.exports = {selectArticles}