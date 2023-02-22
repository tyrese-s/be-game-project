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
    describe('Errors for GET/api/reviews/:review_id', () => {
        test('404: responds with 404 when send valid but non-existent path for reviews', () => {
            return request(app)
            .get('/api/reviews/4044444')
            .expect(404)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('review not found')
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
    })
    describe('GET/api/reviews/:review_id/comments', () => {
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
    });
    describe('Errors for GET/api/reviews/:review_id/comments', () => {
        test('404: responds with 404 when send valid but non-existent path for reviews', () => {
            return request(app)
            .get('/api/reviews/4044444/comments')
            .expect(404)
            .then((response) => {
                const responseMessage = response.body.msg
                expect(responseMessage).toBe('comment not found')
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
})