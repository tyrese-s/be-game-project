const db = require('../db/connection')


exports.fetchReviews = (sort_by = 'created_at', order = 'DESC' , category) => {
    // const validSortBy = ['title', 'designer', 'owner', 'category', 'review_body', 'created_at', 'votes']
    // const validCategories = ['euro game', 'dexterity', 'social dedction'] 
    // const validOrders = ['ASC', 'DESC']
    // // [valid order opts]
    // // if sortby/order === elem in passed arr, .includes()
    // if(!validCategories.includes(category) || !validSortBy.includes(sort_by) || !validOrders.includes(order)){
    //     return Promise.reject({status: 400, msg: 'invalid query'})
    // }
    // // promise.reject() if not included

    // const QueryValues = []
    // // [query values] 
    // QueryValues.push(category)
    // QueryValues.push(sort_by)
    // QueryValues.push(order)
    
    // console.log(QueryValues);

    // let baseqQueryStr = `SELECT * FROM reviews`
    // let additionalQueryStr =  ` WHERE category = $1 ORDER BY $2 $3;`
    // if(category){
    //     const fullQueryStr = baseqQueryStr += additionalQueryStr
    // }
    
    // base query str select all from reviews with comments
    // conditional checks if review has += WHERE reviews.category = $1
    // += GROUP BY reviews(reviewid) comments(reviewid) ORDER BY (sort_by) (order)
    // db.query basequerystr + queryvalues
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
        console.log(result.rows);
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

exports.newVotePatch = (incVote, id) => {
    return db.query(
    `UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;`,
    [incVote.inc_votes, id])
    .then((result) => {
        return result.rows[0]
    })
}

// exports.fetchReviewsByCategory= (category) => {
//     return db.query(`
//     SELECT * FROM reviews
//     WHERE category = $1;`, 
//     [category])
//     .then((result) => {
//         return result.rows
//     })
// }

// exports.fetchReviewsBySortBy =(sort_by) => {
//     // const {sort_by} = query
//    console.log(sort_by);
//     return db.query(`
//     SELECT * FROM reviews
//     ORDER BY $1;`, [sort_by]
//     )
//     .then((result) => {
//         console.log(result.rows);
//         return result.rows
//     })
// }

