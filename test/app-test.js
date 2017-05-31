const expect  = require("expect")
const request = require("supertest")
const app     = require("../src/app")

describe("GET /inline", () => {
  it("should return XML", done => {
    request(app)
    .get("/inline")
    .set("Referer", "http://foobar.com/foo/bar")
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect("Access-Control-Allow-origin", "http://foobar.com")
    .expect("Access-Control-Allow-Methods", /GET/)
    .expect("Access-Control-Allow-Credentials", "true")
    .end(done)
  })
})

describe("GET /wrapper", () => {
  it("should return XML", done => {
    request(app)
    .get("/inline")
    .set("Referer", "http://foobar.com/foo/bar")
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect("Access-Control-Allow-origin", "http://foobar.com")
    .expect("Access-Control-Allow-Methods", /GET/)
    .expect("Access-Control-Allow-Credentials", "true")
    .end(done)
  })
})

describe("POST /bid", () => {
  it("should return JSON", done => {
    request(app)
    .post("/bid")
    .send({
      id: "some-bid-id",
      imp: [
        {
          id: "some-imp-id",
          tagid: "some-tag-id"
        }
      ]
    })
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .expect(res => {
      const data = res.body
      expect(data.id).toEqual("some-bid-id")
      expect(data.seatbid[0].bid[0].impid).toEqual("some-tag-id")
    })
    .end(done)
  })
})
