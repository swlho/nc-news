const db = require(`${__dirname}/../db/connection.js`)
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const app = require(`${__dirname}/../app.js`);
const request = require("supertest");
const snapshotJSONData = require(`${__dirname}/../endpoints.json`)

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	db.end();
});

describe("/api", () => {
	describe("GET /api", () => {
		test("Should match jest snapshot", () => {
			expect(snapshotJSONData).toMatchSnapshot();
		});

		test("STATUS 200: Responds with an object describing all the available endpoints on the NC News API", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then((response) => {
					const endpointKeys = Object.keys(response.body[0]);
					expect(typeof response.body).toBe("object");
					for (const [key, value] of Object.entries(response.body[0])) {
						expect(endpointKeys.includes(key)).toBe(true);
						expect(typeof value).toBe("object");
						expect(value).toHaveProperty("description");
					}
				});
		});
        test('STATUS 404: Responds with an error and appropriate message if requesting a misspelt endpoint, i.e. /aip', () => { 
            return request(app)
            .get("/aip")
            .expect(404)
            .then((err)=>{
                expect(err.body.msg).toBe("Not found")
            })
         })
	});
});


describe('/api/topics', () => { 
    describe('GET /api/topics', () => { 
        test('STATUS 200: Responds with an array of all topic objects with "slug" and "description" properties', () => {
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
    })
})

describe('/api/not_a_valid_endpoint', () => { 
    describe('GET /api/not_a_valid_endpoint', () => { 
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
