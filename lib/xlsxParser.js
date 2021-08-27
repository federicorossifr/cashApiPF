var fs = require("fs")
var xlsx = require("node-xlsx").default


function parseFinecoXLSX(path) {
    const workSheetsFromFile = xlsx.parse(path);
    let movements = workSheetsFromFile[0].data.slice(8)
    let objMovements = movements.map((mov) => {
        return {
            "date":mov[0],
            "amountIn":mov[1],
            "amountOut":mov[2],
            "type":mov[3],
            "description":mov[4],
            "category":mov[6]
        }
    })
    return objMovements;
}

console.log(parseFinecoXLSX("C:\\Users\\federico\\Downloads\\Download.xlsx"))

