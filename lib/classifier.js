let BayesClassifier = require('bayes-classifier')
var fs = require("fs")

async function learnTransactions(transactions) {
    let classifier = BayesClassifier()
    if(fs.existsSync('classifier.json')) {
        let storedClassifier = JSON.parse(fs.readFileSync('classifier.json'))
        classifier.restore(storedClassifier)
    }
    transactions.forEach(async (element,index) => {
        if(element.category)
            classifier.addDocuments([element.description],element.category)
        transactions[index].guessed = false
    });
    classifier.train()
    console.log("Classifier trained, serializing...")
    fs.writeFileSync('classifier.json',JSON.stringify(classifier))
}


async function categorizeTransactions(transactions) {
    if(!fs.existsSync('classifier.json')) return transactions;
    let storedClassifier = JSON.parse(fs.readFileSync('classifier.json'))
    let classifier = new BayesClassifier()
    classifier.restore(storedClassifier)
    let categorized = transactions.map(el => {
        if(el.category && el.category.length != 0) return el;
        let category = classifier.classify(el.description)
        el.category = category;
        el['guessed'] = true
        return el;
    })
    return categorized;
}



module.exports = {learnTransactions, categorizeTransactions}



