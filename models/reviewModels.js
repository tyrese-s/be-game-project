const db = require('../db/connection')

exports.fetchReviews = () => {
    return db.query(`
    ALTER TABLE reviews
    ADD comment_count INT; 
    `)
    .then(() => {
    return db.query(`
        UPDATE reviews 
        SET comment_count = 
        (SELECT  COUNT(*) 
        FROM reviews 
        GROUP BY review_id LIMIT 1);
        `)
    })
    .then(() => {
    return db.query(`
        SELECT * FROM reviews
        ORDER BY created_at DESC;`)
    .then((result) => {
        return result.rows
        })
    })
}

exports.fetchReviewByID = (reviewID) => {
    const id = [reviewID]
    return db.query(`
    SELECT * FROM reviews
    WHERE review_id = $1;`, 
    id)
    .then((result) => {
        return result.rows
    })
}
