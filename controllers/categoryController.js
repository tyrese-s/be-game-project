const {fetchCategories} = require('../models/categoryModel')

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categoryArr) => {
        res.status(200).send( categoryArr)
    })
    .catch((err) => {
        next(err)
    })
}

