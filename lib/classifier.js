var CashDB = require("./lib/cashDB")
let BayesClassifier = require('bayes-classifier')
let cdb = new CashDB()
var fs = require("fs")

async function learn() {
    cdb.getAllTransactions(async (err,res) => {
        let classifier = BayesClassifier()
        res.forEach(async (element,index) => {
            if(element.category) {
                console.log(index, "/",res.length,") Processing: [",element.category," : ",element.description,"]")
                classifier.addDocuments([element.description],element.category)
            }
        });
        classifier.train()
        fs.writeFileSync('classifier.json',JSON.stringify(classifier))
    })    
}


async function proc() {
    var stdin = process.openStdin()
    let storedClassifier = JSON.parse(fs.readFileSync('classifier.json'))
    let classifier = new BayesClassifier()
    classifier.restore(storedClassifier)
    stdin.addListener("data",async (data) => {
        let description = data.toString()
        console.log("Description: ", description)
        let category = classifier.getClassifications(description)
        console.log("Category: ",category)
    })
}

proc()



