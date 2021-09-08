const { MongoClient, ObjectId, ISOD } = require('mongodb');
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
            el.date = new Date(el.date)
            return el;
        })
        this.insertTransactions(trsId,f)
    }

    insertTransaction(tr,f) {
        MongoClient.connect(this.url, (err,db) => {
            if (err) throw err;
            var dbo = db.db("cashdb");
            let accObjId = ObjectId(tr.accountId)
            tr.date = new Date(tr.date)
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

    editAccount(accountId,newAccount,f) {
        MongoClient.connect(this.url, (err,db) => {
            if(err) throw err;
            var dbo = db.db("cashdb");
            let qry = {_id:ObjectId(accountId)};
            let nset = { $set: {name: newAccount.name} };
            dbo.collection("accounts").updateOne(qry,nset,(err,result) => {
                if(err) return f(err,[]);
                f(err,result)
                db.close()
            })
        })
    }

    deleteAccount(accountId,f) {
        MongoClient.connect(this.url, (err,db) => {
            if(err) throw err;
            var dbo = db.db("cashdb");
            let qry = {_id:ObjectId(accountId)};
            dbo.collection("accounts").deleteOne(qry,(err,result) => {
                if(err) return f(err,[]);
                f(err,result)
                let tqry = {accountId:ObjectId(accountId)};
                dbo.collection("transactions").deleteMany(tqry,()=>{db.close()})
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

    aggregateExpensesByMonthYear(f) {
        const aggregationPipeline = [
                {
                    $project : {
                        month : {$month : "$date"}, 
                        year : {$year :  "$date"},
                        amountIn: 1,
                        amountOut:1,
                        accountId:1
                    }
                },
                {
                    $group:{_id:{account:"$accountId",m:"$month",y:"$year"},totalIn:{$sum:"$amountIn"},totalOut:{$sum:"$amountOut"}}
                }
        ];
        this.aggregateSomething(aggregationPipeline,"transactions",f)
    }

    testQuery(f) {
        f([],[])
    }
}


module.exports = CashDB;