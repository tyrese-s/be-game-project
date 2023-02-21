const {fetchReviews} = require('../models/reviewModels')

exports.getReviews = (req, res) => {
    fetchReviews().then((reviewArr) => {
        res.status(200).send(reviewArr)
    })
    .catch((err) => {
        next(err)
    })
}