const endpoints = require(`${__dirname}/../endpoints.json`)

function selectEndpoints (){
    return Promise.all([endpoints])
    .then((resolvedPromise)=>{
        return resolvedPromise[0]
    })
}

module.exports = {selectEndpoints}