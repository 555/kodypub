//Create QR code
function generateQRCodePNG(tableNumber, batchCode) {
    const el = kjua({
        crisp: true,
        minVersion: 4,
        ecLevel: 'M',
        size: 376,
        fill: '#212121',
        text: 'https://q.kpy.io/code/' + batchCode + '?' + (tableNumber === "" ? 'promptTable=true' : 'table=' + tableNumber),
        rounded: 100,
    });
    return el.src
}