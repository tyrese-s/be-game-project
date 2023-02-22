const {fetchReviews, fetchReviewByID} = require('../models/reviewModels')

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