document.getElementById("checkButton").addEventListener("click", function() {
    var barcode1 = document.getElementById("barcode1").value;
    var barcode2 = document.getElementById("barcode2").value;
    var result = document.getElementById("result");
    if (barcode1 === barcode2) {
        result.textContent = "Os códigos de barras são iguais.";
        result.style.color = "green";
    } else {
        result.textContent = "Os códigos de barras são diferentes.";
        result.style.color = "red";
    }
});

function cleanBarcode(barcodeId) {
    var barcode = document.getElementById(barcodeId).value;
    var cleanedBarcode = barcode.replace(/[^a-zA-Z0-9]/g, '');
    document.getElementById(barcodeId).value = cleanedBarcode;
}

document.getElementById("cleanButton1").addEventListener("click", function() {
    cleanBarcode("barcode1");
});

document.getElementById("cleanButton2").addEventListener("click", function() {
    cleanBarcode("barcode2");
});
