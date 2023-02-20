const db = require('../db/connection')

exports.fetchCategories = () => {
    return db.query(`SELECT * FROM categories;`)
    .then((result) => {
        console.log(result, '<--- model res')
        return result.rows
    })
}
// console.log(fetchCategories());

// module.exports = {fetchCategories}