const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
const {getCategories} = require('./controllers/categoryController')
const {getReviews, getReviewByID, getCommentsByID, postComment, patchReview, getReviewsByQuery} = require('./controllers/reviewController')
const {getUsers} = require('./controllers/usersController')
const {handleCustomErrors, psqlErrors} = require('./errorController')
app.use(cors())
app.get('/', (req, res, next) => {
    res.status(200).send({msg: 'root ok'})
})


app.get('/api/categories', getCategories);

// app.get('/api/reviews', getReviewsByQuery)

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewByID)

app.get('/api/reviews/:review_id/comments', getCommentsByID)

app.post('/api/reviews/:review_id/comments', postComment)

app.patch('/api/reviews/:review_id', patchReview)

app.get('/api/users', getUsers)

app.use('*', (req, res, next) => {
    res.status(404).send({msg: 'Path not found'})
})

app.use(handleCustomErrors)
app.use(psqlErrors)

app.use((error, req, res, next) => {
    res.status(500).send('server error!')
})

module.exports = app