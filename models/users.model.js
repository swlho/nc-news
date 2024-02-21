const db = require(`${__dirname}/../db/connection.js`)

function selectAllUsers(){
	const sqlQueryStr = `SELECT * FROM users;
        `;
	return db.query(sqlQueryStr).then((result) => {
		return result.rows;
	});
}

module.exports = {selectAllUsers}