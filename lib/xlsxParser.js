var fs = require("fs")
var xlsx = require("node-xlsx").default
const { parse } = require('date-fns')

function formatDate(dateStr) {
    dateStr = dateStr+' 12'
    let date = parse(dateStr,"dd/MM/yyyy HH", new Date())
    return date
}

function parseFinecoXLSXfile(file) {
    console.log(file)
    const workSheetsFromFile = xlsx.parse(file);
    console.log(workSheetsFromFile)
    let movements = workSheetsFromFile[0].data.slice(8)
    let filteredMovs = movements.filter((mov) => mov.length > 0)
    let objMovements = filteredMovs.map((mov) => {
        console.log(mov)
        return {
            "date": formatDate(mov[0]),
            "amountIn":mov[1],
            "amountOut":mov[2],
            "type":mov[3],
            "description":mov[4],
            "category":mov[6]
        }
    })
    return objMovements;
}

module.exports = parseFinecoXLSXfile
