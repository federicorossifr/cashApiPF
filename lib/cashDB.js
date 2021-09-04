const { MongoClient, ObjectId } = require('mongodb');
var Promise = require('promise');
class CashDB {
    constructor() {
        this.url = "mongodb://localhost:27017/";
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

    insertAccountTransactions(trs,accountId,f) {
        let trsId = trs.map( (el) => {
            el.accountId = ObjectId(accountId)
            return el;
        })
        this.insertTransactions(trsId,f)
    }

    insertTransaction(tr,f) {
        MongoClient.connect(this.url, (err,db) => {
            if (err) throw err;
            var dbo = db.db("cashdb");
            let accObjId = ObjectId(tr.accountId)
            tr.accountId = accObjId;
            dbo.collection("transactions").insertOne(tr,(err,res) => {
                if(err) return f(err,{'inserted':0});
                f(err,res);
                db.close();
            })
        })
    }

    insertAccount(account,f) {
        MongoClient.connect(this.url, (err,db) => {
            if (err) throw err;
            var dbo = db.db("cashdb");
            dbo.collection("accounts").insertOne(account,(err,res) => {
                if(err) return f(err,{'inserted':0});
                f(err,res);
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
    
    
    aggregateSomething(aggregationPipeline,collection,f) {
        MongoClient.connect(this.url,(err,db) => {
            let dbo = db.db("cashdb");
            let cursor = dbo.collection(collection).aggregate(aggregationPipeline);
            cursor.toArray((err,res) => {
                if(err) throw err;
                f(err,res)
            })
        })
    }

    aggregateAccountTransactions(accountId,f) {
        const aggregationPipeline = [
            {
                $match:{accountId: ObjectId(accountId)}
            },
            {
                $group:{_id:"$category",totalIn:{$sum:"$amountIn"},totalOut:{$sum:"$amountOut"}}
            }
        ];
        this.aggregateSomething(aggregationPipeline,"transactions",f)
    }

    aggregateAccounts(f) {
        const aggregationPipeline = [
            {
                $group:{_id:"$accountId",totalIn:{$sum:"$amountIn"},totalOut:{$sum:"$amountOut"}}
            },
            {
                $lookup: {from:'accounts',localField:'_id',foreignField:'_id', as: 'account'}
            },
            {
                $project:{ _id:1,'accountDetails':'$account','net':{$add:["$totalIn","$totalOut"]}}
            }
        ];
        this.aggregateSomething(aggregationPipeline,"transactions",f)
    }


    aggregateCategories(f) {
        const aggregationPipeline = [
            {
                $group:{_id:"$category",totalIn:{$sum:"$amountIn"},totalOut:{$sum:"$amountOut"}}
            }
        ];
        this.aggregateSomething(aggregationPipeline,"transactions",f)
    }
}


module.exports = CashDB;