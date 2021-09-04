var express = require("express")
var app = express()
var morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.set('view engine', 'ejs');
app.set('views','./views/')
app.use(express.static(__dirname + '/static'))

app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

var apiV1Router = require("./lib/apiV1Routes")

app.use("/api/v1/",apiV1Router)

app.get("*",function(req,res) {
    res.sendFile(__dirname+"/static/index.html")
})

var server = app.listen(8080,() => {
    var host = server.address().address
    var port = server.address().port
    console.log("API Server started at http://localhost:%s/api/v1", port)
    console.log("Homepage at http://localhost:%s/webapp", port)
})
