var express = require("express")
var router = express.Router()
var CashDB = require("./cashDB")
var cdb = new CashDB()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const finecoParser = require('./xlsxParser')
const fs = require('fs');
const { ObjectId } = require("mongodb")
const { learnTransactions } = require("./classifier")
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

router.post("/accounts/", (req,res) => {
    cdb.insertAccount(req.body, (err,result) => {
        if(err) throw err;
        console.log(result)
        res.json(result)
    })
})

router.put("/accounts/:accountid", (req,res) => {
    let accId = req.params.accountid;
    cdb.editAccount(accId,req.body,(err,result) => {
        if(err) throw err;
        res.json(result)
    }) 
})

router.delete("/accounts/:accountid", (req,res) => {
    let accId = req.params.accountid;
    cdb.deleteAccount(accId,(err,result) => {
        if(err) throw err;
        res.json(result)
    })    
})

router.get("/accounts/:accountid/transactions", (req,res) => {
    let accId = req.params.accountid;
    cdb.getAccountTransactions(accId,(err,accounts) => {
        if(err) throw err;
        res.json(accounts)
    })
})

router.post("/accounts/:accountid/transactions", (req,res) => {
    let accId = req.params.accountid;
    learnTransactions(req.body)
    cdb.insertAccountTransactions(req.body,accId, (err, result) => {
        if(err) throw err;
        res.json(result)
    })
})

router.post("/accounts/:accountid/transactions/import", upload.single('transactionFile'), async (req,res) => {
    let accId = req.params.accountid;
    let imported = await finecoParser(req.file.path)
    fs.unlink(req.file.path,()=>{})
    res.json(imported)
})


router.get("/accounts/:accountid/transactions/aggregate",(req,res) => {
    let accId = req.params.accountid;
    cdb.aggregateAccountTransactions(accId, (err,aggregates) => {
        res.json(aggregates)
    });
})

router.get("/accounts/aggregate",(req,res) => {
    cdb.aggregateAccounts((err,aggregates) => {
        res.json(aggregates)
    });
})

router.get("/categories/aggregate",(req,res) => {
    cdb.aggregateCategories((err,aggregates) => {
        res.json(aggregates)
    });
})

router.get("/test",(req,res) => {
    cdb.aggregateExpensesByMonthYear((err,result) => {
        res.json(result)
    })
})


module.exports = router