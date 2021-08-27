const { MongoClient } = require('mongodb');
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
                f(err,{'inserted':res.insertedCount});
                db.close();
            })
        })
    }

    getAllTransactions(f) {
        MongoClient.connect(this.url,(err,db) => {
            if(err) return f(err,[]);
            let dbo = db.db("cashdb");
            dbo.collection("transactions").find({}).toArray((err,res) => {
                if(err) return f(err,[]);
                f(err,res);
                db.close();
            });
        })
    }
}

module.exports = CashDB;