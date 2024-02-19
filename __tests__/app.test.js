const db = require(`${__dirname}/../db/connection.js`)
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const app = require(`${__dirname}/../app.js`);
const request = require("supertest");

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	db.end();
});

describe('/api/topics', () => { 
    describe('GET /api/topics', () => { 
        test('STATUS 200: Responses with an array of all topic objects with "slug" and "description" properties', () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response)=>{
                const {topics} = response.body
                expect(topics.length).toBe(3)
                topics.forEach((topic)=>{
                    expect(typeof topic.slug).toBe("string");
                    expect(typeof topic.description).toBe("string")
                })                
            })
        })
        test('STATUS 200: Responses with an array of all topic objects with "slug" and "description" properties', () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response)=>{
                const {topics} = response.body
                expect(topics.length).toBe(3)
                topics.forEach((topic)=>{
                    expect(typeof topic.slug).toBe("string");
                    expect(typeof topic.description).toBe("string")
                })                
            })
        })
        test("STATUS 404: sends an appropriate status and error message when given a misspelt endpoint", () => {
			return request(app)
				.get("/api/stopics")
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe("Not found");
				});
		});
    })
})
