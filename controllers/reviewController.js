const {fetchReviews, fetchReviewByID, fetchCommentsByID, newCommentPost, newVotePatch} = require('../models/reviewModels')

exports.getReviews = (req, res, next) => {
    fetchReviews().then((reviews) => {
        res.status(200).send(reviews)
    })
    .catch((err) => {
        next(err)
    })
}


exports.getReviewByID = (req, res, next) => {
    const {review_id} = req.params
    fetchReviewByID(review_id).then((review) => {
        res.status(200).send(review[0])
    })
    .catch((err) => {
        next(err)
    })
}

exports.getCommentsByID = (req, res, next) => {
    const {review_id} = req.params

    const validID = fetchReviewByID(review_id)
    const  comment = fetchCommentsByID(review_id)

    Promise.all([validID, comment])
    .then((comments) => {
        res.status(200).send(comments[1])
    })
    .catch((err) => {
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    const body = req.body
    const passableKeys = {username: body.username, body: body.body}
    const {review_id} = req.params
    const validID = fetchReviewByID(review_id)
    const newComment = newCommentPost((passableKeys))

    Promise.all([validID, newComment])
    .then((newPost) => {
        res.status(201).send(newPost[1])
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchReview = (req, res, next) => {
    const body = req.body
    const passableKeysBody ={inc_votes: body.inc_votes}
    const {review_id} = req.params

    const validID = fetchReviewByID(review_id)
    const outgoingPatch = newVotePatch(passableKeysBody, review_id)

    Promise.all([validID, outgoingPatch])
    .then((result) => {
        res.status(200).send(result[1])
    })
    .catch((err) => {
    next(err)
    })
}
