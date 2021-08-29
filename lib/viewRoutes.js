var express = require("express")
const { ObjectId } = require("mongodb")
var router = express.Router()
var CashDB = require("./cashDB")
var cdb = new CashDB()

const accountsMiddleWare = (req,res,next) => {
    cdb.getAllAccounts( (err,accounts) => {
        req.__accounts = accounts;
        next();
    });
}

router.get("/",accountsMiddleWare, (req,res) => {
    res.render('home.ejs',{accounts:req.__accounts, page:"home"})
})

router.get("/accounts/:accountid",accountsMiddleWare, (req,res) => {
    let accId = req.params.accountid;
    let account = req.__accounts.find((el) => {return el._id == accId})
    res.render('accountDetails.ejs',{account:account,accounts:req.__accounts,page:"details"})
})

router.get("/accounts/:accountid",accountsMiddleWare, (req,res) => {
    let accId = req.params.accountid;
    res.render('accountDetails.ejs',{account:{"_id":accId},accounts:req.__accounts,page:"details"})
})

module.exports = router