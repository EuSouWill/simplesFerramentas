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

// Limpeza de inputs
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

// Atualizar contagem de caracteres
function updateCharCount(inputId) {
    var input = document.getElementById(inputId).value;
    var charCountId = "charCount" + inputId.charAt(0).toUpperCase() + inputId.slice(1);
    document.getElementById(charCountId).textContent = input.length;
}

// Eventos de input para atualizar contador
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

// Botões de limpeza
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

// Destaque de diferenças
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
// Variáveis para imagens selecionadas
let imagemSelecionadaTexto = null;
let imagemSelecionadaCodigo = null;
let ultimaAreaAtiva = 'codigo'; // Default

// Eventos de clique para input de imagem
document.getElementById("dropAreaTexto").addEventListener("click", () => {
    ultimaAreaAtiva = 'texto';
    document.getElementById("inputImagemTexto").click();
});
document.getElementById("dropAreaCodigo").addEventListener("click", () => {
    ultimaAreaAtiva = 'codigo';
    document.getElementById("inputImagemCodigo").click();
});

// Eventos de mudança para inputs de arquivos
document.getElementById("inputImagemTexto").addEventListener("change", (evento) => {
    const arquivoTexto = evento.target.files[0];
    if (arquivoTexto) {
        carregarImagem(arquivoTexto, 'texto');
    }
});
document.getElementById("inputImagemCodigo").addEventListener("change", (evento) => {
    const arquivoCodigo = evento.target.files[0];
    if (arquivoCodigo) {
        carregarImagem(arquivoCodigo, 'codigo');
    }
});

// Função de carregamento de imagem
function carregarImagem(file, tipo) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida!');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        if (tipo === 'texto') {
            imagemSelecionadaTexto = event.target.result;
            document.getElementById("previewTexto").src = imagemSelecionadaTexto;
            document.getElementById("previewTexto").style.display = "block";
        } else if (tipo === 'codigo') {
            imagemSelecionadaCodigo = event.target.result;
            document.getElementById("previewCodigo").src = imagemSelecionadaCodigo;
            document.getElementById("previewCodigo").style.display = "block";
        }
    };
    reader.readAsDataURL(file);
}

// Eventos de arraste e solta
document.getElementById('dropAreaTexto').addEventListener('dragover', (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('hover');
    ultimaAreaAtiva = 'texto';
});
document.getElementById('dropAreaTexto').addEventListener('dragleave', (e) => {
    e.currentTarget.classList.remove('hover');
});
document.getElementById('dropAreaTexto').addEventListener('drop', (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('hover');
    if (e.dataTransfer.files.length > 0) {
        carregarImagem(e.dataTransfer.files[0], 'texto');
    }
});
document.getElementById('dropAreaCodigo').addEventListener('dragover', (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('hover');
    ultimaAreaAtiva = 'codigo';
});
document.getElementById('dropAreaCodigo').addEventListener('dragleave', (e) => {
    e.currentTarget.classList.remove('hover');
});
document.getElementById('dropAreaCodigo').addEventListener('drop', (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('hover');
    if (e.dataTransfer.files.length > 0) {
        carregarImagem(e.dataTransfer.files[0], 'codigo');
    }
});

// Evento de colagem para imagem
document.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            carregarImagem(blob, ultimaAreaAtiva);
            break;
        }
    }
});

// Funções de processamento
function processarImagemTexto() {
    if (!imagemSelecionadaTexto) {
        alert("Selecione ou arraste uma imagem antes de processar!");
        return;
    }
    document.getElementById("textoExtraido").textContent = "Processando...";
    Tesseract.recognize(
        imagemSelecionadaTexto,
        'por',
        { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
        document.getElementById("textoExtraido").textContent = text.trim() || "Nenhum texto detectado!";
    }).catch(err => {
        console.error(err);
        document.getElementById("textoExtraido").textContent = "Erro ao processar!";
    });
}

function processarImagemCodigo() {
    if (!imagemSelecionadaCodigo) {
        alert("Selecione ou arraste uma imagem antes de processar!");
        return;
    }
    document.querySelector("#codigo span").textContent = "Processando...";
    Tesseract.recognize(
        imagemSelecionadaCodigo,
        'eng',
        { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
        const numerosExtraidos = text.replace(/[^0-9]/g, '');
        if (numerosExtraidos) {
            document.querySelector("#codigo span").textContent = numerosExtraidos;
        } else {
            document.querySelector("#codigo span").textContent = "Nenhum número detectado!";
        }
    }).catch(err => {
        console.error(err);
        document.querySelector("#codigo span").textContent = "Erro ao processar imagem!";
    });
}

// Funções para copiar dados extraídos
function copiarTextoExtraido(id) {
    const texto = document.getElementById(id).textContent;
    if (texto !== "Processando..." && texto !== "Nenhum código detectado!" && texto !== "Nenhum texto detectado!") {
        navigator.clipboard.writeText(texto).then(() => {
            alert("Texto copiado para a área de transferência!");
        }).catch(err => {
            console.error("Erro ao copiar:", err);
        });
    } else {
        alert("Não há texto extraído para copiar.");
    }
}

function copiarCodigoExtraido() {
    var codigoTexto = document.getElementById("codigoExtraido").innerText;
    if (codigoTexto.trim() === "-") {
        alert("Nenhum código extraído para copiar.");
        return;
    }
    navigator.clipboard.writeText(codigoTexto).then(() => {
        var btnCopiar = document.getElementById("btnCopiar");
        btnCopiar.innerText = "Copiado!";
        setTimeout(() => {
            btnCopiar.innerText = "Copiar Código";
        }, 2000);
    }).catch(err => {
        console.error("Erro ao copiar código: ", err);
    });
}