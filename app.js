const express = require('express')
const app = express()
app.use(express.json())
const {getCategories} = require('./controllers/categoryController')
const {getReviews, getReviewByID, getCommentsByID, postComment, patchReview} = require('./controllers/reviewController')

const {handleCustomErrors, psqlErrors} = require('./errorController')

app.get('/', (req, res, next) => {
    res.status(200).send({msg: 'root ok'})
})


app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewByID)

app.get('/api/reviews/:review_id/comments', getCommentsByID)

app.post('/api/reviews/:review_id/comments', postComment)

app.patch('/api/reviews/:review_id', patchReview)

app.use('*', (req, res, next) => {
    res.status(404).send({msg: 'Path not found'})
})

app.use(handleCustomErrors)
app.use(psqlErrors)

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('server error!')
})

module.exports = app