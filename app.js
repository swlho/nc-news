const express = require("express")
const {getTopics, getApi, getArticles} = require(`${__dirname}/controllers/topics.controller.js`)

const app = express()

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:id", getArticles)

app.use((err,request,response,next)=>{
    if(err.code==='22P02'){
      response.status(400).send({msg:'bad request'})
    }
    next(err)
  })

app.use((err, request, response, next) => {
	if (err.status && err.msg) {
		response.status(err.status).send({ msg: err.msg });
	} else {
		response.status(500).send({ msg: "Internal Server Error" });
	}
});

app.all("/*", (request, response)=>{
    response.status(404).send({msg:"Not found"})
})

module.exports = app