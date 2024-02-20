const endpoints = require(`${__dirname}/../endpoints.json`)

function selectEndpoints (){
    return Promise.all([endpoints])
}

module.exports = {selectEndpoints}