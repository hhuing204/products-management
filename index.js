const express = require("express")
const moment = require("moment")
const path = require("path")
require('dotenv').config()
const db = require("./config/database")
const systemConfig = require("./config/system")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("express-flash")
const http = require("http")
const {Server} = require("socket.io")
db.connect()
const bodyParser = require("body-parser")
const methodOverride = require("method-override")




const port = process.env.PORT
const app = express()

//socketIo

const server = http.createServer(app)
const io = new Server(server)
io.on('connection', (socket) => {
  console.log('a user connected', socket.id)
})
//end socketIo


//Init flash to get notify
app.use(cookieParser(process.env.FLASH_KEYBOARD))
app.use(session( {cookie: {maxAge: 60000}}))
app.use(flash())

//tinyMCE
app.use(
    '/tinymce', 
    express.static(path.join(__dirname, 'node_modules', 'tinymce'))
)


app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({extended: false}))

const routeAdmin = require("./routes/admin/index.route")
const routeClient = require("./routes/client/index.route")


app.set("views", `${__dirname}/views`)
app.set("view engine", "pug")

app.use(express.static(`${__dirname}/public`))


// const { Cookie } = require("express-session")

routeAdmin(app)
routeClient(app)
try {
    app.get(/.*/, (req, res) => {
      res.render("client/pages/errors/404", {
        title: "404 NOT FOUND"
      });
    });
  } catch (err) {
    console.error("❌ Error in catch:", err);
}

//App locals Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment






// app.get('/', (req, res) => {
//   res.send('Hello World')
// })



server.listen(port , () =>{
    console.log(`App listening on: http://localhost:${port}`)
})