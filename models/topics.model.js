const db = require(`${__dirname}/../db/connection.js`)

function selectTopics(topic=null){
    const queryVals = []
    let sqlQueryStr = "SELECT * FROM topics"

    if(topic){
        sqlQueryStr += " WHERE slug = $1"
        queryVals.push(`${topic}`)
    }

    return db.query(sqlQueryStr, queryVals)
    .then((result)=>{
        if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "not found" });
		}
		return result.rows;
    })
}

module.exports = {selectTopics}