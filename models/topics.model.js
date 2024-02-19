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


module.exports = {selectTopics, selectEndpoints}