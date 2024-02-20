const db = require(`${__dirname}/../db/connection.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const app = require(`${__dirname}/../app.js`);
const request = require("supertest");
const jest_sorted = require("jest-sorted");
// const snapshotJSONData = require(`${__dirname}/../endpoints.json`)

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	db.end();
});

describe("/api", () => {
	describe("GET /api", () => {
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
		test("STATUS 404: Responds with an error and appropriate message if requesting /api as a misspelt endpoint, e.g. /aip", () => {
			return request(app)
				.get("/aip")
				.expect(404)
				.then((err) => {
					expect(err.body.msg).toBe("Not found");
				});
		});
	});
});

describe("/api/topics", () => {
	describe("GET /api/topics", () => {
		test('STATUS 200: Responds with an array of all topic objects with "slug" and "description" properties', () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then((response) => {
					const { topics } = response.body;
					expect(topics.length).toBe(3);
					topics.forEach((topic) => {
						expect(typeof topic.slug).toBe("string");
						expect(typeof topic.description).toBe("string");
					});
				});
		});
	});
});

describe("/api/articles", () => {
	describe("GET /api/articles", () => {
		test("STATUS 200: Responds with an array of article objects sorted by date descending, each having the properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count BUT NOT having a body property", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles.length).toBe(13);
					expect(articles).toBeSorted("created_at", { descending: true });
					articles.forEach((article) => {
						expect(article).toMatchObject({
							author: expect.any(String),
							title: expect.any(String),
							article_id: expect.any(Number),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							article_img_url: expect.any(String),
							comment_count: expect.any(Number),
						});
						expect(article).not.toHaveProperty("body");
					});
				});
		});
	});
	describe("GET /api/articles/:article_id", () => {
		test("STATUS 200: Responds with the requested article object by ID with the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles).toMatchObject({
						article_id: 1,
						title: "Living in the shadow of a great man",
						topic: "mitch",
						author: "butter_bridge",
						body: "I find this existence challenging",
						created_at: expect.any(String),
						votes: 100,
						article_img_url:
							"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
					});
				});
		});
		test("STATUS 404: Responds with an error and appropriate error message if requesting an ID of a valid datatype (number) but does not exist", () => {
			return request(app)
				.get("/api/articles/87987")
				.expect(404)
				.then((response) => {
					const error = response.body;
					expect(error.msg).toBe("not found");
				});
		});
		test("STATUS 400: Responds with an error and appropriate error message if requesting an ID of an invalid datatype (e.g. string)", () => {
			return request(app)
				.get("/api/articles/not_an_id")
				.expect(400)
				.then((response) => {
					const error = response.body;
					expect(error.msg).toBe("bad request");
				});
		});
	});
	describe('GET /api/articles/:article_id/comments', () => { 
		test('STATUS 200: Responds with an array of comments for the given article_id, sorted by most recent comment first', () => {
			return request(app)
			.get("/api/articles/9/comments")
			.expect(200)
			.then(({body})=>{
				const comments = body.comments
				expect(comments).toBeSortedBy("created_at", {descending:true})
				comments.forEach((comment)=>{
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						article_id:expect.any(Number)
					})
				})
			})
		})
		test('STATUS 200: If the requested article only has one comment, returns the comment as an object', () => {
			return request(app)
			.get("/api/articles/6/comments")
			.expect(200)
			.then(({body})=>{
				const comments = body.comments
				expect(comments).toMatchObject({
						body: "This is a bad article name",
						votes: 1,
						author: "butter_bridge",
						article_id: 6,
						created_at: expect.any(String)
				})
			})
		})
		test('STATUS 204: If the requested article_id has no associated comments, returns empty array', () => {
			return request(app)
			.get("/api/articles/13/comments")
			.expect(200)
			.then(({body})=>{
				const comments = body.comments
				expect(comments.length).toBe(0)
				})
			})
		})
		test('STATUS 400: Responds with error message if the requested article_id is of an invalid type', () => {
			return request(app)
			.get("/api/articles/forklift/comments")
			.expect(400)
			.then((response) => {
				const error = response.body;
				expect(error.msg).toBe("bad request");
			});
		})
		test('STATUS 404: Responds with error message if the requested article_id is of a valid type but does not exist', () => {
			return request(app)
			.get("/api/articles/8800/comments")
			.expect(404)
			.then((response) => {
				const error = response.body;
				expect(error.msg).toBe("not found");
			});
		})
});

describe("/api/not_a_valid_endpoint", () => {
	describe("GET /api/not_a_valid_endpoint", () => {
		test("STATUS 404: sends an appropriate status and error message when given a misspelt endpoint", () => {
			return request(app)
				.get("/api/not_a_valid_endpoint")
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe("Not found");
				});
		});
	});
});
