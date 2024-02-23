const db = require(`${__dirname}/../db/connection.js`)

function selectAllUsers(){
	
	let sqlQueryStr = `SELECT * FROM users`

	return db.query(sqlQueryStr).then((result) => {
		return result.rows;
	});
}

function selectUserByUsername(username){
	
	let sqlQueryStr = `SELECT * FROM users WHERE username = '${username}'`

	return db.query(sqlQueryStr).then((result) => {
		return result.rows[0];
	});
}

module.exports = {selectAllUsers, selectUserByUsername}