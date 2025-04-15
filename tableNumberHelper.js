// const $batchCode = $('#batchCode');
// let tableParameter = !tableNumber ? "promptTable=true" : "table=" + tableNumber;
// let qrData = "https://q.kpy.io/code/" + batchCode + "?" + tableParameter
let tables = []

//Parse table numbers field
function parseTables(tableNumber) {
    let parsedTables = []
    let commaSeparatedTableNumbers = tableNumber.replace(/\s/g,'').split(",").filter(e =>  e)
    commaSeparatedTableNumbers.forEach(function(element){
        if (element.includes("-")){
            if (/^[a-zA-Z]+$/.test(element.replace("-", ""))) {
                function letterRange(start,stop) {
                    let result=[];
                    for (let idx = start.charCodeAt(0),end = stop.charCodeAt(0); idx <=end; ++idx){
                        result.push(String.fromCharCode(idx));
                    }
                    return result;
                }
                const range = letterRange(element.split("-")[0],element.split("-")[1])
                parsedTables = parsedTables.concat(range)
            }
            else {
                const bottomRange = element.split("-")[0]
                const bottomNumber = parseInt(bottomRange.replace(/\D/g, ''))
                const letterTemplate = bottomRange.replace(bottomNumber, "xox")
                const topRange = element.split("-")[1]
                const topNumber = parseInt(topRange.replace(/\D/g, ''))
                const range = Array.from({length: topNumber + 1 - bottomNumber}, (v, k) => letterTemplate.replace("xox", (k + bottomNumber)))
                parsedTables = parsedTables.concat(range)
            }
        }
        else parsedTables.push(element)
    })
    return parsedTables
}

$("#tableNumbers").on("input", function() {
    tables = parseTables($("#tableNumbers").val())
    $("#tableNumberDisplay").html(+ tables.length)
})