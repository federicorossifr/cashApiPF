var express = require("express")
var router = express.Router()
var CashDB = require("./cashDB")
var cdb = new CashDB()

router.get("/dummy",(req,res) => { res.json({"result":"OK"}) })

router.get("/transactions", (req,res) => {
    cdb.getAllTransactions((err,transactions) => {
        if(err) throw err;
        res.json(transactions)
    })
})

router.get("/accounts/", (req,res) => {
    cdb.getAllAccounts((err,accounts) => {
        if(err) throw err;
        res.json(accounts)
    })
})

router.get("/accounts/:accountid/transactions", (req,res) => {
    let accId = req.params.accountid;
    cdb.getAccountTransactions(accId,(err,accounts) => {
        if(err) throw err;
        res.json(accounts)
    })
})


module.exports = router