const express = require("express")
const {getTopics, getApi} = require(`${__dirname}/controllers/topics.controller.js`)

const app = express()

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send({ msg: 'Internal Server Error' });
  });

app.all("/*", (request, response)=>{
    response.status(404).send({msg:"Not found"})
})

module.exports = app