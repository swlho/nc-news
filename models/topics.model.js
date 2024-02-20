const db = require(`${__dirname}/../db/connection.js`)

function selectTopics(){
    const sqlQueryStr = `SELECT * FROM topics;`

    return db.query(sqlQueryStr)
    .then((result)=>{
        return result.rows;
    })
}

module.exports = {selectTopics}