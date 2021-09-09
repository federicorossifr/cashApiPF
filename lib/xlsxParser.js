var fs = require("fs")
var xlsx = require("node-xlsx").default
const { parse } = require('date-fns')
const { categorizeTransactions } = require("./classifier")
function formatDate(dateStr) {
    dateStr = dateStr+' 12'
    let date = parse(dateStr,"dd/MM/yyyy HH", new Date())
    return date
}


/***************************************************
*
* XLSX FORMAT
* Data        Importo	    Tipo	    Descrizione	    Categoria
* dd/MM/yyyy  Number      Text        Text            Text

/**************************************************/

async function parseFinecoXLSXfile(file) {
    const workSheetsFromFile = xlsx.parse(file);
    let movements = workSheetsFromFile[0].data
    let filteredMovs = movements.filter((mov) => mov.length > 0)
    let objMovements = filteredMovs.map((mov) => {
        return {
            "date": formatDate(mov[0]),
            "amountIn":mov[1] > 0 ? mov[1]:0,
            "amountOut":mov[1] < 0 ? mov[1]:0,
            "type":mov[2],
            "description":mov[3],
            "category":mov[4]
        }
    })
    /* Try to auto categorize transactions without category */
    let categorizedTransactions = await categorizeTransactions(objMovements)
    return categorizedTransactions;
}

module.exports = parseFinecoXLSXfile
