const {selectTopics, selectEndpoints } = require(`${__dirname}/../models/topics.model.js`)

function getApi(request, response, next){
    selectEndpoints()
    .then((endpoints)=>{
        response.status(200).send(endpoints)
    })
    .catch((err)=>{
        next(err)
    })
}

function getTopics(request, response, next) {
    selectTopics(request)
    .then((topics)=>{
        response.status(200).send({topics})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = {getTopics, getApi}