const db = require(`${__dirname}/../db/connection.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const app = require(`${__dirname}/../app.js`);
const request = require("supertest");
const jest_sorted = require("jest-sorted");

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
					const endpointKeys = Object.keys(response.body);
					expect(typeof response.body).toBe("object");
					for (const [key, value] of Object.entries(response.body)) {
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
					expect(err.body.msg).toBe("not found");
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
	describe('POST /api/topics', () => {
		test('STATUS 201: Should add a new topic and responds with the added topic', () => {
			return request(app)
			.post("/api/topics")
			.send({
				description: 'coding for coders',
				slug: 'coding'
			})
			.expect(201)
			.then(({body})=>{
				expect(body.topic).toMatchObject({
					description: 'coding for coders',
					slug: 'coding'
				})
			})
		})
		test("STATUS 400: sends an error if trying to post a topic with malformed data", () => {
			return request(app)
			.post("/api/topics")
			.send({
				description: 'coding for coders',
			})
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe("bad request");
			});
		});
	})
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
	describe('POST /api/articles', () => {
		test('STATUS 201: Should add a new article and responds with the added article', () => {
			return request(app)
			.post("/api/articles")
			.send({
				author: 'rogersop',
				title:'how to code for cats',
				body:'like this',
				topic:'cats',
				article_img_url:'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
			})
			.expect(201)
			.then(({body})=>{
				expect(body.article).toMatchObject({
					article_id: 14,
					author: 'rogersop',
					title:'how to code for cats',
					body:'like this',
					topic:'cats',
					article_img_url:'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
					created_at: expect.any(String),
					votes: 0,
					comment_count: 0
				})
			})
		})
		test("STATUS 400: sends an error if trying to post an article with malformed data", () => {
			return request(app)
			.post("/api/articles")
			.send({
				title:'how to code for cats',
				article_img_url:'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
			})
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe("bad request");
			});
		});
		test("STATUS 400: sends an error if trying to post an article where author does not exist", () => {
			return request(app)
			.post("/api/articles")
			.send({
				author: 'some_user',
				title:'how to code for cats',
				body:'like this',
				topic:'cats',
				article_img_url:'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
			})
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe("bad request");
			});
		});
		test("STATUS 400: sends an error if trying to post an article where topic does not exist", () => {
			return request(app)
			.post("/api/articles")
			.send({
				author: 'rogersop',
				title:'how to code for cats',
				body:'like this',
				topic:'some topic',
				article_img_url:'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
			})
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe("bad request");
			});
		});
	})
	describe("GET /api/articles/:article_id", () => {
		test("STATUS 200: Responds with the requested article object by ID with the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then(({ body }) => {
					expect(body.article).toMatchObject({
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
	describe('DELETE /api/articles/:article_id', () => {
		test('STATUS 204: Should delete an article based on article_id and its respective comments', () => {
			return request(app)
			.delete("/api/articles/1")
			.expect(204)
		})
		test('STATUS 204: Should delete an article based on article_id even if no associated comments exist', () => {
			return request(app)
			.delete("/api/articles/7")
			.expect(204)
		})
		test('STATUS 404: Responds with error if no such article_id exists', () => {
			return request(app)
			.delete("/api/articles/99")
			.expect(404)
			.then((response) => {
				const error = response.body;
				expect(error.msg).toBe("not found");
			});
		})
		test('STATUS 400: Responds with error if article_id is invalid datatype', () => {
			return request(app)
			.delete("/api/articles/forklift")
			.expect(400)
			.then((response) => {
				const error = response.body;
				expect(error.msg).toBe("bad request");
			});
		})
	})
	describe("GET /api/articles/:article_id/comments", () => {
		test("STATUS 200: Responds with an array of comments for the given article_id, sorted by most recent comment first", () => {
			return request(app)
			.get("/api/articles/9/comments")
			.expect(200)
			.then(({ body }) => {
				const comments = body.comments;
				expect(comments.length).toBe(2)
				expect(comments).toBeSortedBy("created_at", { descending: true });
				comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						article_id: 9
					});
				});
			});
		});
		test("STATUS 200: If the requested article only has one comment, returns the comment as an object", () => {
			return request(app)
			.get("/api/articles/6/comments")
			.expect(200)
			.then(({ body }) => {
				const comments = body.comments;
				expect(comments).toMatchObject({
					body: "This is a bad article name",
					votes: 1,
					author: "butter_bridge",
					article_id: 6,
					created_at: expect.any(String),
				});
			});
		});
		test("STATUS 200: If the requested article_id has no associated comments, returns empty array", () => {
			return request(app)
			.get("/api/articles/13/comments")
			.expect(200)
			.then(({ body }) => {
				const comments = body.comments;
				expect(comments.length).toBe(0);
			});
		});
		test("STATUS 400: Responds with error message if the requested article_id is of an invalid type", () => {
			return request(app)
			.get("/api/articles/forklift/comments")
			.expect(400)
			.then((response) => {
				const error = response.body;
				expect(error.msg).toBe("bad request");
			});
		});
		test("STATUS 404: Responds with error message if the requested article_id is of a valid type but does not exist", () => {
			return request(app)
			.get("/api/articles/8800/comments")
			.expect(404)
			.then((response) => {
				const error = response.body;
				expect(error.msg).toBe("not found");
			});
		});
	});
	describe('GET /api/articles/:article_id?comment_count', () => {
		test("STATUS 200: Responds with article's comment_count, which is the total count of all the comments with this article_id", () => {
			return request(app)
			.get("/api/articles/9?comment_count")
			.expect(200)
			.then(({ body }) => {
				const article = body.article;
				expect(article).toMatchObject({
					comment_count: expect.any(Number)
				})
				expect(article.comment_count).toBe(2)
			})
		})
		test("STATUS 200: If requested article_id has no comments associated with it, responds with comment_count of 0", () => {
			return request(app)
			.get("/api/articles/2?comment_count")
			.expect(200)
			.then(({ body }) => {
				const article = body.article;
				expect(article.comment_count).toBe(0)
			})
		})
		test("STATUS 400: Responds with an error and appropriate error message if requesting an ID of an invalid datatype (e.g. string)", () => {
			return request(app)
			.get("/api/articles/forklift?comment_count")
			.expect(400)
			.then((response) => {
				const error = response.body;
				expect(error.msg).toBe("bad request");
			});
		})
		test("STATUS 404: Responds with an error and appropriate error message if requesting an ID of a valid datatype (number) but does not exist", () => {
			return request(app)
				.get("/api/articles/99?comment_count")
				.expect(404)
				.then((response) => {
					const error = response.body;
					expect(error.msg).toBe("not found");
				});
		});
		test("STATUS 400: Responds with an error and appropriate error message if requesting a valid ID but the query is invalid", () => {
			return request(app)
				.get("/api/articles/1?comment_co")
				.expect(400)
				.then((response) => {
					const error = response.body;
					expect(error.msg).toBe("bad request");
				});
		});
	})
	describe('GET /api/articles?topic', () => { 
		test('STATUS 200: Responds with articles filtered by the topic value specified in the query', () => {
			return request(app)
			.get("/api/articles?topic=mitch")
			.expect(200)
			.then(({body}) => {
				const articles = body.articles
				expect(articles.length).toBe(12)
				articles.forEach((article)=>{
					expect(article.topic).toBe("mitch")
				})
			});
		})
		test('STATUS 200: Responds with all articles if the topic query is omitted', () => {
			return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({body}) => {
				const articles = body.articles
				expect(articles.length).toBe(13)
			});
		})
		test('STATUS 200: Responds with an empty array if articles have no associated valid topic', () => {
			return request(app)
			.get("/api/articles?topic=paper")
			.expect(200)
			.then(({body}) => {
				const articles = body.articles;
				expect(articles.length).toBe(0);
			});
		})
		test('STATUS 404: Responds with an error if queried topic does not exist', () => {
			return request(app)
			.get("/api/articles?topic=forklift")
			.expect(404)
			.then((response) => {
				const error = response.body;
				expect(error.msg).toBe("not found");
			});
		})
	})
	describe('GET /api/articles?sort_by=value&order=value', () => {
		test('STATUS 200: Should return articles sorted by created_at in descending order', () => {
			return request(app)
			.get("/api/articles?sort_by")
			.expect(200)
			.then(({body}) => {
				const articles = body.articles;
				expect(articles.length).toBe(13)
				expect(articles).toBeSortedBy("created_at", { descending: true });
			});
		})
		test('STATUS 200: Should return articles sorted by any other valid column (other than created_at) in descending order', () => {
			return request(app)
			.get("/api/articles?sort_by=title")
			.then(({body}) => {
				const articles = body.articles;
				expect(articles.length).toBe(13)
				expect(articles).toBeSortedBy("title", { descending: true });
			});
		})
		test('STATUS 200: /api/articles?sort_by=author&order=asc should return articles sorted by author in ascending order', () => {
			return request(app)
			.get("/api/articles?sort_by=author&order=asc")
			.then(({body}) => {
				const articles = body.articles;
				expect(articles.length).toBe(13)
				expect(articles).toBeSortedBy("author");
			});
		})
		test("STATUS 400 - responds with an error if request is received to sort by a valid column but an invalid order value", () => {
			return request(app)
				.get("/api/articles?sort_by=author&order=upwards")
				.expect(400)
				.then((response) => {
					const error = response.body;
					expect(error.msg).toBe("bad request");
				});
		});
		test("STATUS 400 - responds with an error if request is received to sort by an invalid column", () => {
			return request(app)
				.get("/api/articles?sort_by=forklift")
				.expect(400)
				.then((response) => {
					const error = response.body;
					expect(error.msg).toBe("bad request");
				});
		});
		test("STATUS 400 - responds with an error if request is received to sort an invalid column by ascending order", () => {
			return request(app)
				.get("/api/articles?sort_by=forklift&order=asc")
				.expect(400)
				.then((response) => {
					const error = response.body;
					expect(error.msg).toBe("bad request");
				});
		});
	})
	describe("POST /api/articles/:article_id/comments", () => {
		test("STATUS 201: adds a comment for an article and responds to client with the added comment", () => {
			const newComment = {
				body: "This is a test comment",
				votes: 0,
				author: "butter_bridge",
			};
			return request(app)
				.post("/api/articles/3/comments")
				.send(newComment)
				.then(({ body }) => {
					expect(body.comment).toEqual({
						comment_id: 19,
						body: "This is a test comment",
						votes: 0,
						author: "butter_bridge",
						created_at: expect.any(String),
						article_id: 3,
					});
				});
		});
		test("STATUS 404: sends an error if trying to post to an article_id of valid data type but does not exist", () => {
			const newComment = {
				body: "This is a test comment",
				votes: 0,
				author: "butter_bridge",
			};
			return request(app)
				.post("/api/articles/257835/comments")
				.send(newComment)
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe("not found");
				});
		});
		test("STATUS 400: sends an error if trying to post a comment with malformed data", () => {
			const newComment = {
				author: "butter_bridge",
			};
			return request(app)
				.post("/api/articles/3/comments")
				.send(newComment)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toBe("bad request");
				});
		});
		test("STATUS 400: sends an error if trying to post a comment with data not meeting table scheme validation", () => {
			const newComment = {
				body: null,
				votes: 0,
				author: null,
			};
			return request(app)
				.post("/api/articles/3/comments")
				.send(newComment)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toBe("bad request");
				});
		});
	});
	describe("PATCH /api/articles/:article_id", () => {
		test("STATUS 200: Updates a given article's votes by the value provided by newVote in the passed object {inc_votes: newVote}", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ inc_votes: 100 })
				.expect(200)
				.then(({ body }) => {
					expect(body.article).toEqual({
						article_id: 1,
						title: "Living in the shadow of a great man",
						topic: "mitch",
						author: "butter_bridge",
						body: "I find this existence challenging",
						created_at: expect.any(String),
						votes: 200,
						article_img_url:
							"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
					});
				});
		});
		test('STATUS 400: sends an appropriate status and error message when given a PATCH body not meeting validation schema', () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ inc_votes: "one hundred" })
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toBe("bad request");
				});
		})
	});
});

describe('/api/comments', () => {
	describe('/api/comments/:comment_id', () => {
		describe('DELETE /api/comments/:comment_id', () => { 
			test('STATUS 204: Deletes comment by comment_id', () => {
				return request(app)
				.delete("/api/comments/1")
				.expect(204)
			})
			test('STATUS 404: Responds with error if no such comment_id exists', () => {
				return request(app)
				.delete("/api/comments/899456")
				.expect(404)
				.then((response) => {
					const error = response.body;
					expect(error.msg).toBe("not found");
				});
			})
			test('STATUS 400: Responds with error if comment_id is invalid datatype', () => {
				return request(app)
				.delete("/api/comments/forklift")
				.expect(400)
				.then((response) => {
					const error = response.body;
					expect(error.msg).toBe("bad request");
				});
			})
		})
		describe('PATCH /api/comments/:comment_id', () => {
			test('STATUS 200: Updates the votes by plus 1 on a comment for the given comment_id', () => {
				return request(app)
				.patch("/api/comments/1")
				.send({inc_votes:1})
				.expect(200)
				.then(({ body }) => {
					expect(body.comment).toMatchObject({
						comment_id:1,
						body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
						votes: 17,
						author: "butter_bridge",
						article_id: 9,
						created_at: expect.any(String)
					});
				});
			})
			test('STATUS 200: Updates the votes by minus 1 on a comment for the given comment_id', () => {
				return request(app)
				.patch("/api/comments/1")
				.send({inc_votes:-1})
				.expect(200)
				.then(({ body }) => {
					expect(body.comment).toMatchObject({
						comment_id:1,
						body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
						votes: 15,
						author: "butter_bridge",
						article_id: 9,
						created_at: expect.any(String)
					});
				});
			})
			test('STATUS 400: sends an appropriate status and error message when given a PATCH body not meeting validation schema', () => {
				return request(app)
					.patch("/api/comments/1")
					.send({ inc_votes: "one hundred" })
					.expect(400)
					.then((response) => {
						expect(response.body.msg).toBe("bad request");
					});
			})
		})
	})
})

describe('/api/users', () => { 
	describe('GET /api/users', () => { 
		test("STATUS 200: Responds with an array of all users, each having at least the properties: username, name, avatar_url", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(({ body: { users } }) => {
					expect(users.length).toBe(4);
					users.forEach((user) => {
						expect(user).toMatchObject({
							username: expect.any(String),
							name: expect.any(String),
							avatar_url: expect.any(String),
						});
					});
				});
		});
	})
	describe('GET /api/users/:username', () => {
		test('STATUS 200: Responds with a user requesed by username', () => {
			return request(app)
			.get("/api/users/rogersop")
			.expect(200)
			.then(({body})=>{
				const user = body.user
				expect(user).toMatchObject({
					username: 'rogersop',
					name: 'paul',
					avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
				})
			})
		})
	})
	test('STATUS 404: Responds with error if no such username exists', () => {
		return request(app)
		.get("/api/username/not_a_username")
		.expect(404)
		.then((response) => {
			const error = response.body;
			expect(error.msg).toBe("not found");
		});
	})
})

describe("/api/not_a_valid_endpoint", () => {
	describe("GET /api/not_a_valid_endpoint", () => {
		test("STATUS 404: sends an appropriate status and error message when given a misspelt endpoint", () => {
			return request(app)
				.get("/api/not_a_valid_endpoint")
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe("not found");
				});
		});
	});
});
