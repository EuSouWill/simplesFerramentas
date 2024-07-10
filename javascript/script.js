document.getElementById("checkButtonBarcode").addEventListener("click", function() {
    var barcode1 = document.getElementById("barcode1").value;
    var barcode2 = document.getElementById("barcode2").value;
    var result = document.getElementById("resultBarcode");

    if (barcode1 === barcode2) {
        result.textContent = "Os códigos de barras são iguais.";
        result.style.color = "green";
    } else {
        result.textContent = "Os códigos de barras são diferentes.";
        result.style.color = "red";
        highlightDifferences(barcode1, barcode2, "displayBarcode1", "displayBarcode2");
    }
});

document.getElementById("checkButtonPhone").addEventListener("click", function() {
    var phone1 = document.getElementById("phone1").value;
    var phone2 = document.getElementById("phone2").value;
    var result = document.getElementById("resultPhone");

    if (phone1 === phone2) {
        result.textContent = "Os números de telefone são iguais.";
        result.style.color = "green";
    } else {
        result.textContent = "Os números de telefone são diferentes.";
        result.style.color = "red";
        highlightDifferences(phone1, phone2, "displayPhone1", "displayPhone2");
    }
});

document.getElementById("checkButtonCpf").addEventListener("click", function() {
    var cpf1 = document.getElementById("cpf1").value;
    var cpf2 = document.getElementById("cpf2").value;
    var result = document.getElementById("resultCpf");

    if (cpf1 === cpf2) {
        result.textContent = "Os números de CPF/CNPJ são iguais.";
        result.style.color = "green";
    } else {
        result.textContent = "Os números de CPF/CNPJ são diferentes.";
        result.style.color = "red";
        highlightDifferences(cpf1, cpf2, "displayCpf1", "displayCpf2");
    }
});

document.getElementById("checkButtonEmail").addEventListener("click", function() {
    var email1 = document.getElementById("email1").value;
    var email2 = document.getElementById("email2").value;
    var result = document.getElementById("resultEmail");

    if (email1 === email2) {
        result.textContent = "Os e-mails são iguais.";
        result.style.color = "green";
    } else {
        result.textContent = "Os e-mails são diferentes.";
        result.style.color = "red";
        highlightDifferences(email1, email2, "displayEmail1", "displayEmail2");
    }
});

function cleanBarcode(barcodeId) {
    var barcode = document.getElementById(barcodeId).value;
    var cleanedBarcode = barcode.replace(/[^a-zA-Z0-9]/g, '');
    document.getElementById(barcodeId).value = cleanedBarcode;
    updateCharCount(barcodeId);
}

function cleanInput(inputId) {
    var input = document.getElementById(inputId).value;
    var cleanedInput = input.replace(/[^a-zA-Z0-9]/g, '');
    document.getElementById(inputId).value = cleanedInput;
    updateCharCount(inputId);
}

function updateCharCount(inputId) {
    var input = document.getElementById(inputId).value;
    var charCountId = "charCount" + inputId.charAt(0).toUpperCase() + inputId.slice(1);
    document.getElementById(charCountId).textContent = input.length;
}

document.getElementById("barcode1").addEventListener("input", function() {
    updateCharCount("barcode1");
});

document.getElementById("barcode2").addEventListener("input", function() {
    updateCharCount("barcode2");
});

document.getElementById("phone1").addEventListener("input", function() {
    updateCharCount("phone1");
});

document.getElementById("phone2").addEventListener("input", function() {
    updateCharCount("phone2");
});

document.getElementById("cpf1").addEventListener("input", function() {
    updateCharCount("cpf1");
});

document.getElementById("cpf2").addEventListener("input", function() {
    updateCharCount("cpf2");
});

document.getElementById("email1").addEventListener("input", function() {
    updateCharCount("email1");
});

document.getElementById("email2").addEventListener("input", function() {
    updateCharCount("email2");
});

document.getElementById("cleanButton1").addEventListener("click", function() {
    cleanBarcode("barcode1");
});

document.getElementById("cleanButton2").addEventListener("click", function() {
    cleanBarcode("barcode2");
});

document.getElementById("cleanButtonPhone1").addEventListener("click", function() {
    cleanInput("phone1");
});

document.getElementById("cleanButtonPhone2").addEventListener("click", function() {
    cleanInput("phone2");
});

document.getElementById("cleanButtonCpf1").addEventListener("click", function() {
    cleanInput("cpf1");
});

document.getElementById("cleanButtonCpf2").addEventListener("click", function() {
    cleanInput("cpf2");
});

document.getElementById("cleanButtonEmail1").addEventListener("click", function() {
    cleanInput("email1");
});

document.getElementById("cleanButtonEmail2").addEventListener("click", function() {
    cleanInput("email2");
});

function highlightDifferences(text1, text2, displayId1, displayId2) {
    var maxLength = Math.max(text1.length, text2.length);
    var highlightedText1 = '';
    var highlightedText2 = '';

    for (var i = 0; i < maxLength; i++) {
        var char1 = text1[i] || '';
        var char2 = text2[i] || '';
        if (char1 !== char2) {
            highlightedText1 += `<span class="highlight">${char1}</span>`;
            highlightedText2 += `<span class="highlight">${char2}</span>`;
        } else {
            highlightedText1 += char1;
            highlightedText2 += char2;
        }
    }

    document.getElementById(displayId1).innerHTML = highlightedText1;
    document.getElementById(displayId2).innerHTML = highlightedText2;
}
