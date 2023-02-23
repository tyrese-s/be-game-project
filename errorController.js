exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    else next(err)
}

exports.psqlErrors = (err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: 'invalid input id'})
    }else if (err.code === '23502'){
        res.status(400).send({msg: 'missing/incorrect fields!'})
    } else if (err.code === '42804'){
        res.status(400).send({msg: 'input id is not a number'})
    }
    else next(err)
}

