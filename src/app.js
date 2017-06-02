const bodyParser = require("body-parser")
const express    = require("express")
const fs         = require("fs")
const morgan     = require("morgan")
const url        = require("url")

const respondXml = (req, res, next) => {
  res.append("Content-Type", "text/xml; charset=utf8")
  next()
}

const respondCorHeaders = (req, res, next) => {
  if (req.headers.referer) {
    const ref = url.parse(req.headers.referer)
    res.append("Access-Control-Allow-Origin", ref.protocol + '//' + ref.host)
  }
  res.append("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.append("Access-Control-Allow-Credentials", "true")
  next()
}

const slurpFile = (filepath, cb) => {
  fs.readFile(filepath, { encoding: "utf8" }, (err, data) => {
    if (err) { throw err }
    cb(data)
  })
}

const buildApp = ({ enableLogging = false }) => {
  const app = express()

  if (enableLogging) {
    app.use(morgan("combined"))
  }

  app.use(respondCorHeaders)
  app.use("/files", express.static("public/files"))

  app.get("/event", (req, res) => {
    res.json({hoge: "fuga"})
  })

  app.get("/inline", respondXml, (req, res) => {
    slurpFile("public/vast-inline.xml", data => res.send(data))
  })

  app.get("/wrapper", respondXml, (req, res) => {
    slurpFile("public/vast-wrapper.xml", data => res.send(data))
  })

  app.post("/bid", bodyParser.json(), (req, res) => {
    const bidData = req.body

    if (enableLogging) {
      console.log(JSON.stringify(bidData, null, 2))
    }

    const bidId = bidData.id
    const imp   = bidData.imp[0]

    if (!imp.video) {
      res.status(204).end()
      return
    }

    const tagId = imp.tagid

    slurpFile("public/vast-wrapper.xml", data => {
      res.json({
        id: bidId,
        cur: "JPY",
        seatbid: [
          {
            seat: "test",
            bid: [
              {
                impid: tagId,
                price: 123,
                adm: data,
                adomain: ["localhost"]
              }
            ]
          }
        ]
      })
    })
  })

  return app
}

module.exports = { buildApp: buildApp }
