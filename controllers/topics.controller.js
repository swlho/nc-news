const {selectTopics} = require(`${__dirname}/../models/topics.model.js`)

function getTopics(request, response, next) {
    selectTopics(request)
    .then((topics)=>{
        response.status(200).send({topics})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = {getTopics}