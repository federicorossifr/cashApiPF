var express = require("express")
var CashDB = require("./lib/cashDB")
const cdb = new CashDB()

var app = express()
app.use(express.static("static"))
app.get("/", (req,res) => {
    res.sendFile('static/index.html')
})

app.get("/api/v1/dummy",(req,res) => { })

app.get("/api/v1/transactions", (req,res) => {
    cdb.getAllTransactions((err,transactions) => {
        if(err) throw err;
        res.json(transactions)
    })
})



var server = app.listen(8080,() => {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
