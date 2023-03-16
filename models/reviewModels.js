const db = require("../db/connection");

exports.fetchReviews = (sort_by = "created_at", order = "DESC", category) => {
  const validSortBy = [
    "title",
    "designer",
    "owner",
    "category",
    "review_body",
    "created_at",
    "votes",
  ];
  const validOrders = ["ASC", "DESC"];
  // [valid order opts]
  // if sortby/order === elem in passed arr, .includes()
  if (!validSortBy.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid query" });
  }
  // promise.reject() if not included

  const QueryValues = [];
  let baseQueryStr = `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  if (category) {
    QueryValues.push(category);
    baseQueryStr += ` WHERE reviews.category = $1`;
  }

  baseQueryStr += ` GROUP BY reviews.review_id, comments.review_id ORDER BY ${sort_by} ${order};`;

  return db.query(baseQueryStr, QueryValues).then((result) => {
    return result.rows;
  });
};

exports.fetchReviewByID = (reviewID) => {
  const id = [reviewID];
  return db
    .query(
      `
    SELECT * FROM reviews
    WHERE review_id = $1;`,
      id
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review id not found" });
      }
      return result.rows;
    });
};

exports.fetchCommentsByID = (reviewID) => {
  const id = [reviewID];
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;`,
      id
    )
    .then((result) => {
      return result.rows;
    });
};

exports.newCommentPost = (newComment, review_id) => {
  const { username, body } = newComment;
  return db
    .query(
      `
    INSERT INTO comments
    (author, body, review_id)
    VALUES
    ((SELECT username FROM users WHERE username=$1 ),
    $2, $3)
    RETURNING *;`,
      [username, body, review_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.newVotePatch = (incVote, id) => {
  return db
    .query(
      `UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;`,
      [incVote.inc_votes, id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

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
