const expect  = require("expect")
const request = require("supertest")

const { buildApp } = require("../src/app")
const app = buildApp({})

describe("GET /static/index.html", () => {
  it("should return HTML", done => {
    request(app)
      .get("/static/index.html")
      .expect(200)
      .expect("Content-Type", /text\/html/)
      .expect(res => expect(res.text).toMatch(/Hoge/))
      .end(done)
  })
})

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

describe("GET /nonlinear-inline", () => {
  it("should return XML", done => {
    request(app)
      .get("/nonlinear-inline")
      .set("Referer", "http://foobar.com/foo/bar")
      .expect(200)
      .expect("Content-Type", /text\/xml/)
      .end(done)
  })
})

describe("GET /nonlinear-wrapper", () => {
  it("should return XML", done => {
    request(app)
      .get("/nonlinear-wrapper")
      .set("Referer", "http://foobar.com/foo/bar")
      .expect(200)
      .expect("Content-Type", /text\/xml/)
      .end(done)
  })
})

describe("POST /bid", () => {
  it("should return 200 with linear ad in JSON when 'linearity: 1'", done => {
    request(app)
      .post("/bid")
      .send({
        id: "some-bid-id",
        imp: [
          {
            id: "some-imp-id",
            tagid: "some-tag-id",
            video: {
              w: 640,
              h: 480,
              linearity: 1
            }
          }
        ]
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect(res => {
        const data = res.body
        expect(data.id).toEqual("some-bid-id")
        expect(data.seatbid[0].bid[0].impid).toEqual("some-tag-id")
        expect(data.seatbid[0].seat).toEqual("/wrapper")
      })
      .end(done)
  })

  it("should return 200 with non-linear ad in JSON when 'linearity: 2'", done => {
    request(app)
      .post("/bid")
      .send({
        id: "some-bid-id",
        imp: [
          {
            id: "some-imp-id",
            tagid: "some-tag-id",
            video: {
              w: 640,
              h: 480,
              linearity: 2
            }
          }
        ]
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect(res => {
        const data = res.body
        expect(data.id).toEqual("some-bid-id")
        expect(data.seatbid[0].bid[0].impid).toEqual("some-tag-id")
        expect(data.seatbid[0].seat).toEqual("/nonlinear-wrapper")
      })
      .end(done)
  })

  it("should return 204 when no 'video' exists", done => {
    request(app)
      .post("/bid")
      .send({
        id: "some-bid-id",
        imp: [
          {
            id: "some-imp-id",
            tagid: "some-tag-id",
          }
        ]
      })
      .expect(204)
      .end(done)
  })
})
