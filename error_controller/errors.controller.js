exports.handlePsqlErrors = ((err,request,response,next)=>{
    if(err.code==='22P02' || err.code === '23502'){
      response.status(400).send({msg:'bad request'})
    }
    next(err)
  })

exports.handleCustomErrors = ((err, request, response, next) => {
	if (err.status && err.msg) {
		response.status(err.status).send({ msg: err.msg });
	} else {
	next(err)
    }
});

exports.handleServerErrors = ((err, request, response, next) => {
    response.status(500).send({ msg: "Internal Server Error" })
});

exports.handleInvalidEndpoints = ((request, response)=>{
    response.status(404).send({msg:"Not found"})
})