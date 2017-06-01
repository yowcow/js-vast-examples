const { buildApp } = require("./src/app")

const port = process.env.PORT || 5000

console.log(`Booting up to listen on port ${port}`)

buildApp({ enableLogging: true }).listen(port)

process.on("SIGINT", () => process.exit())
