const db = require(`${__dirname}/../db/connection.js`);

function selectArticles(topic=null) {
    const queryVals = []

	let sqlQueryStr = "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id"

    if(topic){
        sqlQueryStr += " WHERE topic = $1"
        queryVals.push(`${topic}`)
    }
    
    sqlQueryStr += " GROUP BY articles.article_id ORDER BY articles.created_at DESC"

	return db.query(sqlQueryStr, queryVals).then((result) => {
		return result.rows;
	});
}

function selectArticlesByColumn(sort_by=null, order='desc', limit=null, p=null) {
    const validSortByColumns = ["author","title","article_id,","topic","created_at","votes","comment_count"]

    if(sort_by === null || sort_by.length ===0){
        sort_by = 'created_at'
    }
    
    if (!validSortByColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "bad request" });
    }
    
    if (!["asc", "desc"].includes(order)) {
        return Promise.reject({ status: 400, msg: "bad request" });
	}
    
	let sqlQueryStr = "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id"
    
    sqlQueryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`
    
    if(limit!==null){
        sqlQueryStr += ` LIMIT ${limit}`
    }

    if(p!==null && p > 1){
        sqlQueryStr += ` OFFSET ${limit}`
    }

	return db.query(sqlQueryStr).then((result) => {
		return result.rows;
	});
}

function selectArticlesByTopicQueried(topic, sort_by, order='asc'){
    const validSortByColumns = ["topic","created_at","votes","comment_count"]

    if (!validSortByColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "bad request" });
    }
    
    if (!["asc", "desc"].includes(order)) {
        return Promise.reject({ status: 400, msg: "bad request" });
	}
    
	let sqlQueryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE topic='${topic}'`
    
    sqlQueryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`

	return db.query(sqlQueryStr).then((result) => {
		return result.rows;
	});
}

function selectArticlesById(id = null, queryField=null) {
	const queryVals = [];
    const validQueryFields = ['comment_count']

    if(queryField && Object.keys(queryField).length !== 0){
        if(!validQueryFields.includes(Object.keys(queryField)[0])){
            return Promise.reject({ status: 400, msg: "bad request" });
        }
    }

	let sqlQueryStr = ""
    
	if(id && queryField===null || Object.keys(queryField).length === 0) {
        sqlQueryStr = "SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id"
		sqlQueryStr += " WHERE articles.article_id = $1"
		queryVals.push(id);
	} else if (id && Object.keys(queryField)[0]==='comment_count'){
        sqlQueryStr = "SELECT CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id"
		sqlQueryStr += " WHERE articles.article_id = $1"
		queryVals.push(id);
    }
    
    
    sqlQueryStr += " GROUP BY articles.article_id ORDER BY articles.created_at DESC"
	return db.query(sqlQueryStr, queryVals)
    .then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "not found" });
		}
		return result.rows[0];
	});
}

function selectCommentsByArticleId(id = null, limit=null, p=null) {
	let sqlQueryStr = `SELECT * FROM comments`;
	const queryVals = [];

	if (id) {
		sqlQueryStr += ` WHERE article_id = $1`;
		queryVals.push(id);
	}

	sqlQueryStr += " ORDER BY created_at DESC";

    if(limit!==null){
        sqlQueryStr += ` LIMIT ${limit}`
    }

    if(p!==null && p > 1){
        sqlQueryStr += ` OFFSET ${limit}`
    }

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

function updateArticleVotes(updateVotesValue, article_id){
    const {inc_votes} = updateVotesValue
    const queryVals = [inc_votes, article_id]

    let sqlQueryStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `
    return db.query(sqlQueryStr, queryVals)
    .then(({rows})=>{
        return rows[0]
    })
}

function addArticle(postBody){
    const {author, title, body, topic, article_img_url} = postBody
    const sqlQueryStr = `
    INSERT INTO articles (author, title, body, topic, article_img_url)
    VALUES ($1,$2,$3,$4,$5);`

    const queryVals = [author, title, body, topic, article_img_url]
    return db.query(sqlQueryStr, queryVals)
    .then(()=>{
    const sqlQueryStrSelect = `
    SELECT articles.article_id, articles.author, title, articles.body, topic, article_img_url, articles.created_at, articles.votes, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.article_id DESC
    LIMIT 1;`
    return db.query(sqlQueryStrSelect)
    })
    .then(({rows})=>{
        return rows[0]
    })
}

function removeCommentsByArticleId(article_id){
    return db.query(
        `DELETE FROM comments
        WHERE article_id = $1
        RETURNING *`,[article_id]
    )
    .then((result)=>{
		if (result.rows.length === 1) {
			return result.rows[0];
		}
		return result.rows;
	});
}

function removeArticleById(article_id){
    return db.query(
        `DELETE FROM articles
        WHERE article_id = $1
        RETURNING *`,[article_id]
    )
    .then((result)=>{
        if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "not found" });
		}
        return result.rows[0]
    })
}

module.exports = {
	selectArticles,
	selectArticlesById,
	selectCommentsByArticleId,
    addCommentByArticleId,
    updateArticleVotes,
    selectArticlesByColumn,
    addArticle,
    removeArticleById,
    removeCommentsByArticleId,
    selectArticlesByTopicQueried
};
