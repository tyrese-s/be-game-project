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
        
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'review id not found'})
        }
        return result.rows
    })
}

exports.fetchCommentsByID = (reviewID) => {
    const id = [reviewID]
    return db.query(`
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;`, 
    id)
    .then((result) => {
        return result.rows 
    })
}

exports.newCommentPost = (newComment) => {
    const {username, body} = newComment
    return  db.query(`
    INSERT INTO comments
    (author, body, review_id)
    VALUES
    ((SELECT username FROM users WHERE username=$1 ),
    $2, (SELECT review_id FROM reviews WHERE title='Jenga'))
    RETURNING *;`,
    [username, body])
    .then((result) => {
        return  result.rows
    })
}