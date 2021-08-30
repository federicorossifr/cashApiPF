const { MongoClient, ObjectId } = require('mongodb');
var Promise = require('promise');
class CashDB {
    constructor() {
        this.url = "mongodb://localhost:5555/";
    }

    insertTransactions(trs,f) {
        MongoClient.connect(this.url, (err,db) => {
            if (err) throw err;
            var dbo = db.db("cashdb");
            dbo.collection("transactions").insertMany(trs,(err,res) => {
                if(err) f(err,{'inserted':0});
                console.log(res)
                f(err,{'inserted':res.insertedCount});
                db.close();
            })
        })
    }

    insertTransaction(tr,f) {
        MongoClient.connect(this.url, (err,db) => {
            if (err) throw err;
            var dbo = db.db("cashdb");
            let accObjId = ObjectId(tr.accountId)
            tr.accountId = accObjId;
            dbo.collection("transactions").insertOne(tr,(err,res) => {
                if(err) f(err,{'inserted':0});
                console.log(res)
                f(err,{'inserted':res.insertedCount});
                db.close();
            })
        })
    }

    getAllSomething(something,filter,f) {
        MongoClient.connect(this.url,(err,db) => {
            if(err) return f(err,[]);
            let dbo = db.db("cashdb");
            dbo.collection(something).find(filter).toArray((err,res) => {
                if(err) return f(err,[]);
                f(err,res);
                db.close();
            });
        })
    }

    getAccountById(accountId,f) {
        this.getAllSomething("accounts",{"_id":ObjectId(accountId)},f)
    }

    getAccountTransactions(accountId,f) {
        this.getAllSomething("transactions",{"accountId":ObjectId(accountId)},f)
    }

    getAllTransactions(f) {
        this.getAllSomething("transactions",{},f);
    }

    getAllAccounts(f) {
        this.getAllSomething("accounts",{},f);
    }    
}

module.exports = CashDB;