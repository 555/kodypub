function updateAccent () {
    accentHEX = $("#accent").val()
    $("#preview-circle").attr("style","fill: "+  accentHEX + "; transition: fill .2s ease")
    $("#color-display").html(accentHEX);

    accentTwoHex = hslToHex(hexToHsl(accentHEX).h, hexToHsl(accentHEX).s, 0.9)
    $("#pen-on-table-circle").attr("fill", accentTwoHex)
}

$("#accent").on("change", function() {
    updateAccent()
});

function updateDarkMode() {
    const isDarkMode = $("#darkMode").is(":checked")
    // id="preview-powered-by-kodypay" src="images/Group-8784.svg"
    bgColour = isDarkMode ? "#212121" : "#ffffff"
    textColour = isDarkMode ? "#ffffff" : "#212121"
    styleString = "background-color: " + bgColour + "; transition: background-color .2s ease"
    $("#preview-wrapper").attr("style", styleString)
    $("#preview-table-number").css("color", textColour)
    $("#preview-headline").css("color", textColour)
    $("#preview-subhead").css("color", textColour)
    $("#preview-powered-by-kodypay").attr("src", isDarkMode ? "images/Group-8783.svg" : "images/Group-8784.svg")
}

$("#darkMode").on("change", function() {
    updateDarkMode()
});

function updateFont() {
    const font = $("#font")[0].options[ $("#font")[0].selectedIndex ].text
    WebFont.load({
        google: {
            families: [font + ":regular,500,700"]
        }
    })
    $("#preview-table-number").css("font-family", font)
    $("#preview-headline").css("font-family", font)
    $("#preview-subhead").css("font-family", font)
    $("#pen-on-table-text").css("font-family", font)
    $("#preview-headline").html(font === "Oswald" ? "SCAN, ORDER & PAY" : "Scan, Order & Pay")
}

$("#font").on("change", function() {
    updateFont()
})

function updateType(typeString) {
    qrType = typeString
    $("#type-tables").removeClass("focus")
    $("#type-select-table").removeClass("focus")
    $("#type-counter-only").removeClass("focus")
    $("#type-" + typeString).addClass("focus")
    const tableNumberField = $("#table-number-field")
    const batchCode = $("#batchCode")
    const penOnTable = $("#pen-on-table")
    const previewTableNo = $("#preview-table-number")
    switch(typeString) {
        case "tables":
            tableNumberField.show()
            batchCode.attr("maxlength", "5")
            penOnTable.css("opacity", "0")
            penOnTable.hide()
            previewTableNo.show()
            previewTableNo.css("opacity", "1")
            break;
        case "select-table":
            tableNumberField.hide()
            $("#tableNumbers").val("")
            $("#tableNumberDisplay").html("0")
            batchCode.attr("maxlength", "5")
            previewTableNo.css("opacity", "0")
            previewTableNo.hide()
            penOnTable.show()
            penOnTable.css("opacity", "1")
            break;
        default:
            tableNumberField.hide()
            $("#tableNumbers").val("")
            $("#tableNumberDisplay").html("0")
            batchCode.attr("maxlength", "6")
            penOnTable.css("opacity", "0")
            penOnTable.hide()
            previewTableNo.show()
            previewTableNo.css("opacity", "0")
    }
}

$("#type-tables").on("click", function() {
    updateType("tables")
})

$("#type-select-table").on("click", function() {
    updateType("select-table")
})

$("#type-counter-only").on("click", function() {
    updateType("counter-only")
})

$("#hasBack").on("change", function(){
    $("#preview-subhead").css("opacity", $("#hasBack").prop("checked") ? "1" : "0")
})