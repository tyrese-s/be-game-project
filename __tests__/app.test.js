const request = require('supertest')
const app = require('../app')
const connection = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')

beforeEach(()=> {
    
    return seed(testData)
})
afterAll(()=> {
    connection.end()
})


describe('app', () => {
    describe('GET /api', () => {
        test('200: GET responds with a message of root ok', () => {
            return request(app)
            .get('/')
            .expect(200)
            .then(({body}) => {
               expect(body.msg).toBe('root ok');
            } )
        });
    });
    describe('GET /api/categories', () => {
        test('200: GET responds with status 200 and array of category objects with correct properties', () => {
            return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({body}) => {
                const categories = body
                expect(categories).toBeInstanceOf(Array)
                expect(categories.length).toBe(4)
                categories.forEach((category) => {
                    expect(category).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
        })
    });
    describe('GET /api/reviews', () => {
        test('200: GET responds with status 200 and array of review objects', () => {
            return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({body}) => {
                const reviews = body
                expect(reviews).toBeInstanceOf(Array)
                expect(reviews.length).toBe(13)
                expect(reviews).toBeSorted({descening: true})
                expect(reviews[0].comment_count).toBe(1)
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                })
            })
        });
    });
    describe('server errors', () => {
        test('404: responds with 404 when send valid but non-existent path', () => {
            return request(app)
            .get('/notAPath4004')
            .expect(404)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('Path not found')
            })
        });
    });
    describe('GET /api/reviews/:review_id', () => {
        test('200: GET responds status 200 and a review object', () => {
            return request(app)
            .get('/api/reviews/1')
            .expect(200)
            .then(({body}) => {
                const review = body
                expect(review).toMatchObject({
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    review_id: 1
                });
            });
        })
        describe('Errors for GET/api/reviews/:review_id', () => {
            test('404: responds with 404 when send valid but non-existent path for reviews', () => {
            return request(app)
            .get('/api/reviews/4044444')
            .expect(404)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('review id not found')
            })
        });
        test('400: responds with 400 and msg when incorrect id input', () => {
            return request(app)
            .get('/api/reviews/anything')
            .expect(400)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('invalid input id')
            });
        });
    });
    })
    describe('GET/api/reviews/:review_id/comments', () => {
        test('200: GET responds with empty array if there are no comments with given review_id', () => {
            return request(app)
            .get('/api/reviews/1/comments')
            .expect(200)
            .then(({body}) => {
                const comments = body
                expect(comments.length).toBe(0)
                expect(comments).toEqual([])
            })
        });
        test('200: GET responds with an array of comment for given review_id', () => {
            return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
            .then(({body}) => {
                const comments = body
                expect(comments.length).toBe(3)
                expect(comments).toBeSorted({descening: true})
                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        author: expect.any(String),
                        body: expect.any(String),
                        comment_id: expect.any(Number),
                        review_id: 2,
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                })
            })
        });
        describe('Errors for GET/api/reviews/:review_id/comments', () => {
            test('404: responds with 404 when send valid but non-existent path for reviews', () => {
            return request(app)
            .get('/api/reviews/4044444/comments')
            .expect(404)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('review id not found')
            })
        });
        test('400: responds with 400 and msg when incorrect id input', () => {
            return request(app)
            .get('/api/reviews/anything/comments')
            .expect(400)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('invalid input id')
            });
        });
    })
});
    describe('POST/api/reviews/:review_id/comments', () => {
        test('201: responds with added review ', () => {
            return request(app)
            .post('/api/reviews/2/comments')
            .send(
            {
                username: 'mallionaire',
                body: 'great game!'
            }
            )
            .expect(201)
            .then(({body}) => {
                const review = body[0]
            expect(review.author).toBe('mallionaire')
            expect(review.body).toBe('great game!')
        })
    }); 
    test('201: responds with added review, additional properties in object are ignored', () => {
        return request(app)
        .post('/api/reviews/2/comments')
        .send(
        {
            username: 'mallionaire',
            body: 'great game!',
            age: 23,
            likesGames: true
        }
        )
        .expect(201)
        .then(({body}) => {
            const review = body[0]
        expect(review.author).toBe('mallionaire')
        expect(review.body).toBe('great game!')    
    });
})
    describe('Errors for POST/api/reviews/:review_id/comments', () => {
        test('400: responds with 400 when sending body with missing fields ', () => {
            return request(app)
            .post('/api/reviews/2/comments')
            .send({})
            .expect(400)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('missing/incorrect fields!')
            })
        });
        test('400: responds with 400 when sending body has invalid inputs', () => {
            return request(app)
            .post('/api/reviews/2/comments')
            .send({
                username: 'tyrese',
                body: 'nice'
            })
            .expect(400)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('missing/incorrect fields!')
        });
    });
        test('400: responds with 400 and msg when incorrect id input', () => {
            return request(app)
            .post('/api/reviews/notANum/comments')
            .send({
                username: 'mallionaire',
                body: 'nice game'
            })
            .expect(400)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('invalid input id')
            });
        });
        test('404: responds with 404 when send valid but non-existent path for reviews', () => {
            return request(app)
            .post('/api/reviews/1100110/comments')
            .send({
                username: 'mallionaire',
                body: 'nice game'
            })
            .expect(404)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('review id not found')
    })
})
})
})
    describe('PATCH/api/reviews/:review_id', () => {
        test('200: increment: responds with updated votes in review', () => {
            return request(app)
            .patch('/api/reviews/2')
            .send({inc_votes: 5})
            .expect(200)
            .then(({body}) => {
                const updatedReview = body
                expect (updatedReview.votes).toBe(10)
            })
        });
        test('200: decrement: responds with updated votes in review, decerement', () => {
            return request(app)
            .patch('/api/reviews/4')
            .send({inc_votes: -4})
            .expect(200)
            .then(({body}) => {
                const updatedReview = body
                expect (updatedReview.votes).toBe(3)
            })
        });
        test('200: only a body containing the key of inc_votes can be inputted', () => {
            return request(app)
            .patch('/api/reviews/2')
            .send({
                inc_votes: 5,
                new_name: 'the avatar'
            })
            .expect(200)
            .then(({body}) => {
                const updatedReview = body
                expect (updatedReview.votes).toBe(10)
                expect(updatedReview.new_name).toBe(undefined)
            })
        });
        describe('Errors for PATCH/api/reviews/:review_id', () => {
            test('400: responds with 400 when sending body inc_votes not a number', () => {
                return request(app)
                .patch('/api/reviews/2')
                .send({inc_votes: 'apples'})
                .expect(400)
                .then((response) => {
                    const responseMessage = response.body.msg
                    expect(responseMessage).toBe('not a number')
                })
            })
            test('404: responds with 404 when send valid but non-existent path for reviews', () => {
                return request(app)
                .patch('/api/reviews/1100110')
                .send({inc_votes: 5})
                .expect(404)
                .then((response) => {
                    const responseMessage = response.body.msg
                    expect(responseMessage).toBe('review id not found')
        })
        });
        test('400: responds with 400 and msg when incorrect id input', () => {
            return request(app)
            .patch('/api/reviews/notANum')
            .send({inc_votes: 5})
            .expect(400)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('invalid input id')
            });
        });
    });
})
    describe('GET/api/users', () => {
        test('200: GET repsonds with an array of of username objects', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                const users = body
                expect(users).toBeInstanceOf(Array)
                expect(users.length).toBe(4)
                users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
        });
    });
    describe('GET/api/reviews (queries)', () => {
        test('responds with array of reviews by category ', () => {
            return request(app)
            .get('/api/reviews?category=dexterity')
            .expect(200)
            .then(({body}) => {
                const review = body
                expect(review.length).toBe(1)
                // expect(review[0].category).toBe('dexterity')
            })
        });
        test.only('responds with array of reviews with a sort_by query which sort by any valid column', () => {
            return request(app)
            .get('/api/reviews?sort_by=title')
            .expect(200)
            .then(({body}) => {
                const reviews = body
                expect(reviews).toBeInstanceOf(Array)
                expect(reviews.length).toBe(13)
                expect(reviews).toBeSorted({key: 'title'})
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
            });
        })
    });
        test('responds with array of reviews with a sort_by which defaults to date', () => {
            return request(app)
            .get('/api/reviews?sort_by')
            .expect(200)
            .then(({body}) => {
                const reviews = body
                expect(reviews).toBeInstanceOf(Array)
                expect(reviews.length).toBe(13)
            });
        });
})
})
