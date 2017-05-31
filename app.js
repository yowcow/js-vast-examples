const app = require("./src/app")

const port = process.env.PORT || 5000

console.log(`Booting up to listen on port ${port}`)

app.listen(port)
