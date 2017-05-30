const express = require("express")
const fs      = require("fs")
const url     = require("url")

const app = express()

app.use((req, res, next) => {
  if (req.headers.referer) {
    const ref = url.parse(req.headers.referer)
    res.append("Access-Control-Allow-Origin", ref.protocol + '//' + ref.host)
  }
  res.append("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.append("Access-Control-Allow-Credentials", "true")
  next();
})

app.use("/files", express.static("public/files"))

app.get("/event", (req, res) => {
  console.log((new Date()).toISOString() + `: Event ${req.query.type} triggered. (source: ${req.query.source})`)
  res.send("")
})

app.use((req, res, next) => {
  res.append("Content-Type", "text/xml; charset=utf8")
  next();
})

app.get("/inline", (req, res) => {
  fs.readFile("public/vast-inline.xml", { encoding: "utf8" }, (err, data) => {
    if (err) { throw err }
    res.send(data)
  })
})

app.get("/wrapper", (req, res) => {
  fs.readFile("public/vast-wrapper.xml", { encoding: "utf8" }, (err, data) => {
    if (err) { throw err }
    res.send(data)
  })
})

const port = process.env.PORT || 5000

console.log(`Booting up to listen on port ${port}`)

app.listen(port)
