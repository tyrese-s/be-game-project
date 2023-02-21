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
                expect(review.review_id).toBe(1)
                expect(review).toMatchObject({
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                });
            });
        })
    })
})