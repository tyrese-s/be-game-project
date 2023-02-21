const express = require('express')
const app = express()

const {getCategories} = require('./controllers/categoryController')
const {getReviews} = require('./controllers/reviewController')

app.get('/', (req, res, next) => {
    res.status(200).send({msg: 'root ok'})
})

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews)


app.use((error, req, res, next) => {
    console.log(error);
})

module.exports = app