const db = require(`${__dirname}/../db/connection.js`)
const endpoints = require(`${__dirname}/../endpoints.json`)

function selectEndpoints (){
    return Promise.all([endpoints])
}

function selectTopics(){
    const sqlQueryStr = `SELECT * FROM topics;`

    return db.query(sqlQueryStr)
    .then((result)=>{
        return result.rows;
    })
}

function selectArticles(id=null){
    let sqlQueryStr = `SELECT * FROM articles`
    const queryVals = []

    if(id){
        sqlQueryStr += ` WHERE article_id = $1`
        queryVals.push(id)
    }

    return db.query(sqlQueryStr,queryVals)
    .then((result)=>{
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "not found" });
		}
        return result.rows
    })
}


module.exports = {selectTopics, selectEndpoints, selectArticles}