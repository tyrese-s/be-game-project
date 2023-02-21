const {fetchReviews} = require('../models/reviewModels')

exports.getReviews = (req, res) => {
    fetchReviews().then((reviews) => {
        res.status(200).send(reviews)
    })
    .catch((err) => {
        next(err)
    })
}