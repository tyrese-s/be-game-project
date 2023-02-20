const express = require('express')
const app = express()

const {getCategories} = require('./controllers/categoryController')

app.get('/', (req, res, next) => {
    res.status(200).send({msg: 'root ok'})
})

app.get('/api/categories', getCategories);


app.use((error, req, res, next) => {
    console.log(error);
})

module.exports = app