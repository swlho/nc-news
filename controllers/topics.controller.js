const {selectTopics, selectEndpoints, selectArticles } = require(`${__dirname}/../models/topics.model.js`)

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

function getArticles(request, response, next){
    const {id} = request.params
    selectArticles(id)
    .then((articles)=>{
    response.status(200).send({articles})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = {getTopics, getApi, getArticles}