var express = require("express")
var mongo = require("mongodb").MongoClient
var url = "mongodb://localhost:27017/";

var app = express()
app.use(express.static("static"))
app.get("/", (req,res) => {
    res.sendFile('static/index.html')
})

app.get("/api/v1/dummy",(req,res) => {
    res.json([
        {
            date: '25/08/2021',
            amountIn: undefined,
            amountOut: -1.58,
            type: 'VISA DEBIT',
            description: 'WWW.MYCICERO.IT',
            category: undefined
        },
        {
            date: '25/08/2021',
            amountIn: undefined,
            amountOut: -0.26,
            type: 'VISA DEBIT',
            description: 'WWW.MYCICERO.IT',
            category: undefined
        },
        {
            date: '24/08/2021',
            amountIn: undefined,
            amountOut: -18,
            type: 'PagoBancomat POS',
            description: 'Pag. del 23/08/21 ora 13:52 presso: IL GIARDINO NASCOSTO S   VIA DELLA LAVORIA 1   PISA   56121        ITA Carta N° *****079 Nessuna Commissione',
            category: 'Hotel Ristoranti e Viaggi'
        },
        {
            date: '24/08/2021',
            amountIn: undefined,
            amountOut: -34,
            type: 'Pagamento Visa Debit',
            description: 'DONZELLA ANDREA        PISA          IT Carta N. ***** 793                      Data operazione 21/08/21',
            category: 'Hotel Ristoranti e Viaggi'
        },
        {
            date: '16/08/2021',
            amountIn: 300,
            amountOut: undefined,
            type: 'Versamento Contanti presso ATM',
            description: 'Versamento Contanti Atm del 15/08/2021  ore 08:46:19 Rif. 0017002470',
            category: 'Altre Entrate'
        }
    ])
})

/*mongo.connect(url,(err,db) => {
    if(err) throw err;
    console.log("Connected to db...")
})*/

var server = app.listen(8080,() => {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
