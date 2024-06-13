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
