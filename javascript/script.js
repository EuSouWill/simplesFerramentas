// JavaScript Corrigido - PARTE 1/4

// Verificações dos comparadores (mantido igual)
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
document.getElementById("cpf1").addEventListener("input", function() {
    updateCharCount("cpf1");
});
document.getElementById("cpf2").addEventListener("input", function() {
    updateCharCount("cpf2");
});

// Botões de limpeza
document.getElementById("cleanButton1").addEventListener("click", function() {
    cleanBarcode("barcode1");
});
document.getElementById("cleanButton2").addEventListener("click", function() {
    cleanBarcode("barcode2");
});
document.getElementById("cleanButtonCpf1").addEventListener("click", function() {
    cleanInput("cpf1");
});
document.getElementById("cleanButtonCpf2").addEventListener("click", function() {
    cleanInput("cpf2");
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

// ===== PARTE DAS IMAGENS - VARIÁVEIS =====

// Variáveis para imagens selecionadas
let imagemSelecionadaTexto = null;
let imagemSelecionadaCodigo = null;
let ultimaAreaAtiva = 'codigo'; // Default
// JavaScript Corrigido - PARTE 2/4

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado');
    
    // Configurar eventos das áreas de drop
    configurarEventosImagem();
    
    // Configurar drag and drop
    configurarDragAndDrop();
    
    // Configurar colagem
    configurarColagem();
});

function configurarEventosImagem() {
    // Eventos de clique para áreas de drop
    const dropAreaTexto = document.getElementById("dropAreaTexto");
    const dropAreaCodigo = document.getElementById("dropAreaCodigo");
    
    if (dropAreaTexto) {
        dropAreaTexto.addEventListener("click", () => {
            console.log('Clique na área de texto');
            ultimaAreaAtiva = 'texto';
            const input = document.getElementById("inputImagemTexto");
            if (input) {
                input.click();
            }
        });
        
        dropAreaTexto.style.cursor = 'pointer';
        dropAreaTexto.style.border = '2px dashed #ccc';
        dropAreaTexto.style.padding = '20px';
        dropAreaTexto.style.textAlign = 'center';
        dropAreaTexto.style.borderRadius = '5px';
    }
    
    if (dropAreaCodigo) {
        dropAreaCodigo.addEventListener("click", () => {
            console.log('Clique na área de código');
            ultimaAreaAtiva = 'codigo';
            const input = document.getElementById("inputImagemCodigo");
            if (input) {
                input.click();
            }
        });
        
        dropAreaCodigo.style.cursor = 'pointer';
        dropAreaCodigo.style.border = '2px dashed #ccc';
        dropAreaCodigo.style.padding = '20px';
        dropAreaCodigo.style.textAlign = 'center';
        dropAreaCodigo.style.borderRadius = '5px';
    }
    
    // Eventos de mudança para inputs de arquivos
    const inputTexto = document.getElementById("inputImagemTexto");
    const inputCodigo = document.getElementById("inputImagemCodigo");
    
    if (inputTexto) {
        inputTexto.addEventListener("change", (evento) => {
            console.log('Arquivo selecionado para texto');
            const arquivo = evento.target.files[0];
            if (arquivo) {
                carregarImagem(arquivo, 'texto');
            }
        });
    }
    
    if (inputCodigo) {
        inputCodigo.addEventListener("change", (evento) => {
            console.log('Arquivo selecionado para código');
            const arquivo = evento.target.files[0];
            if (arquivo) {
                carregarImagem(arquivo, 'codigo');
            }
        });
    }
}

// Função de carregamento de imagem - CORRIGIDA
function carregarImagem(file, tipo) {
    console.log(`Carregando imagem para: ${tipo}`);
    
    if (!file || !file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        console.log(`Imagem carregada com sucesso para: ${tipo}`);
        
        if (tipo === 'texto') {
            imagemSelecionadaTexto = event.target.result;
            const preview = document.getElementById("previewTexto");
            if (preview) {
                preview.src = imagemSelecionadaTexto;
                preview.style.display = "block";
            }
            console.log('imagemSelecionadaTexto definida:', !!imagemSelecionadaTexto);
        } else if (tipo === 'codigo') {
            imagemSelecionadaCodigo = event.target.result;
            const preview = document.getElementById("previewCodigo");
            if (preview) {
                preview.src = imagemSelecionadaCodigo;
                preview.style.display = "block";
            }
            console.log('imagemSelecionadaCodigo definida:', !!imagemSelecionadaCodigo);
        }
    };
    
    reader.onerror = function(error) {
        console.error('Erro ao carregar imagem:', error);
        alert('Erro ao carregar a imagem!');
    };
    
    reader.readAsDataURL(file);
}
// JavaScript Corrigido - PARTE 3/4

// Configurar drag and drop
function configurarDragAndDrop() {
    const dropAreaTexto = document.getElementById('dropAreaTexto');
    const dropAreaCodigo = document.getElementById('dropAreaCodigo');
    
    if (dropAreaTexto) {
        dropAreaTexto.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            ultimaAreaAtiva = 'texto';
        });
        
        dropAreaTexto.addEventListener('dragleave', (e) => {
            e.currentTarget.style.backgroundColor = '';
        });
        
        dropAreaTexto.addEventListener('drop', (e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = '';
            if (e.dataTransfer.files.length > 0) {
                carregarImagem(e.dataTransfer.files[0], 'texto');
            }
        });
    }
    
    if (dropAreaCodigo) {
        dropAreaCodigo.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            ultimaAreaAtiva = 'codigo';
        });
        
        dropAreaCodigo.addEventListener('dragleave', (e) => {
            e.currentTarget.style.backgroundColor = '';
        });
        
        dropAreaCodigo.addEventListener('drop', (e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = '';
            if (e.dataTransfer.files.length > 0) {
                carregarImagem(e.dataTransfer.files[0], 'codigo');
            }
        });
    }
}

// Configurar colagem
function configurarColagem() {
    document.addEventListener('paste', (e) => {
        console.log('Evento de colagem detectado');
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                console.log('Imagem encontrada na área de transferência');
                const blob = items[i].getAsFile();
                carregarImagem(blob, ultimaAreaAtiva);
                e.preventDefault(); // Impedir comportamento padrão
                break;
            }
        }
    });
}

// Funções de processamento - CORRIGIDAS
function processarImagemTexto() {
    console.log('processarImagemTexto chamada');
    console.log('imagemSelecionadaTexto:', !!imagemSelecionadaTexto);
    
    if (!imagemSelecionadaTexto) {
        alert("Selecione ou arraste uma imagem antes de processar!");
        return;
    }
    
    // Corrigido: usar o ID correto do HTML
    const spanTexto = document.getElementById("textoExtraido");
    if (spanTexto) {
        spanTexto.textContent = "Processando...";
    }
    
    Tesseract.recognize(
        imagemSelecionadaTexto,
        'por',
        { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
        console.log('Texto extraído:', text);
        if (spanTexto) {
            spanTexto.textContent = text.trim() || "Nenhum texto detectado!";
        }
    }).catch(err => {
        console.error('Erro no Tesseract:', err);
        if (spanTexto) {
            spanTexto.textContent = "Erro ao processar!";
        }
    });
}

function processarImagemCodigo() {
    console.log('processarImagemCodigo chamada');
    console.log('imagemSelecionadaCodigo:', !!imagemSelecionadaCodigo);
    
    if (!imagemSelecionadaCodigo) {
        alert("Selecione ou arraste uma imagem antes de processar!");
        return;
    }
    
    // Corrigido: usar o ID correto do HTML
    const spanCodigo = document.getElementById("codigoExtraido");
    if (spanCodigo) {
        spanCodigo.textContent = "Processando...";
    }
    
    Tesseract.recognize(
        imagemSelecionadaCodigo,
        'eng',
        { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
        console.log('Texto bruto extraído:', text);
        const numerosExtraidos = text.replace(/[^0-9]/g, '');
        console.log('Números extraídos:', numerosExtraidos);
        
        if (spanCodigo) {
            if (numerosExtraidos) {
                spanCodigo.textContent = numerosExtraidos;
            } else {
                spanCodigo.textContent = "Nenhum número detectado!";
            }
        }
    }).catch(err => {
        console.error('Erro no Tesseract:', err);
        if (spanCodigo) {
            spanCodigo.textContent = "Erro ao processar imagem!";
        }
    });
}
// JavaScript Corrigido - PARTE 4/4

// Funções para copiar dados extraídos - CORRIGIDAS
function copiarTextoExtraido(id) {
    const elemento = document.getElementById(id);
    if (!elemento) {
        alert("Elemento não encontrado!");
        return;
    }
    
    const texto = elemento.textContent;
    if (texto !== "Processando..." && texto !== "Nenhum texto detectado!" && texto !== "-" && texto.trim()) {
        navigator.clipboard.writeText(texto).then(() => {
            alert("Texto copiado para a área de transferência!");
        }).catch(err => {
            console.error("Erro ao copiar:", err);
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = texto;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert("Texto copiado!");
        });
    } else {
        alert("Não há texto extraído para copiar.");
    }
}

function copiarCodigoExtraido() {
    const codigoElemento = document.getElementById("codigoExtraido");
    if (!codigoElemento) {
        alert("Elemento de código não encontrado!");
        return;
    }
    
    const codigoTexto = codigoElemento.textContent;
    if (codigoTexto.trim() === "-" || codigoTexto === "Processando..." || codigoTexto === "Nenhum número detectado!") {
        alert("Nenhum código extraído para copiar.");
        return;
    }
    
    navigator.clipboard.writeText(codigoTexto).then(() => {
        const btnCopiar = document.getElementById("btnCopiar");
        if (btnCopiar) {
            const textoOriginal = btnCopiar.textContent;
            btnCopiar.textContent = "Copiado!";
            btnCopiar.style.backgroundColor = "#28a745";
            setTimeout(() => {
                btnCopiar.textContent = textoOriginal;
                btnCopiar.style.backgroundColor = "";
            }, 2000);
        }
        console.log("Código copiado:", codigoTexto);
    }).catch(err => {
        console.error("Erro ao copiar código:", err);
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = codigoTexto;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert("Código copiado!");
    });
}

// Função adicional para resetar as áreas de imagem
function resetarAreaImagem(tipo) {
    if (tipo === 'texto') {
        imagemSelecionadaTexto = null;
        const preview = document.getElementById("previewTexto");
        const textoExtraido = document.getElementById("textoExtraido");
        const input = document.getElementById("inputImagemTexto");
        
        if (preview) {
            preview.style.display = "none";
            preview.src = "#";
        }
        if (textoExtraido) {
            textoExtraido.textContent = "-";
        }
        if (input) {
            input.value = "";
        }
    } else if (tipo === 'codigo') {
        imagemSelecionadaCodigo = null;
        const preview = document.getElementById("previewCodigo");
        const codigoExtraido = document.getElementById("codigoExtraido");
        const input = document.getElementById("inputImagemCodigo");
        
        if (preview) {
            preview.style.display = "none";
            preview.src = "#";
        }
        if (codigoExtraido) {
            codigoExtraido.textContent = "-";
        }
        if (input) {
            input.value = "";
        }
    }
}

// Função para adicionar feedback visual durante o processamento
function mostrarProcessando(tipo, mostrar = true) {
    if (tipo === 'texto') {
        const botao = document.querySelector('button[onclick="processarImagemTexto()"]');
        if (botao) {
            botao.disabled = mostrar;
            botao.textContent = mostrar ? "Processando..." : "Processar";
        }
    } else if (tipo === 'codigo') {
        const botao = document.querySelector('button[onclick="processarImagemCodigo()"]');
        if (botao) {
            botao.disabled = mostrar;
            botao.textContent = mostrar ? "Processando..." : "Processar";
        }
    }
}

// Melhorar as funções de processamento com feedback visual
function processarImagemTextoMelhorada() {
    console.log('processarImagemTexto chamada');
    console.log('imagemSelecionadaTexto:', !!imagemSelecionadaTexto);
    
    if (!imagemSelecionadaTexto) {
        alert("Selecione ou arraste uma imagem antes de processar!");
        return;
    }
    
    const spanTexto = document.getElementById("textoExtraido");
    if (spanTexto) {
        spanTexto.textContent = "Processando...";
    }
    
    mostrarProcessando('texto', true);
    
    Tesseract.recognize(
        imagemSelecionadaTexto,
        'por',
        { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
        console.log('Texto extraído:', text);
        if (spanTexto) {
            spanTexto.textContent = text.trim() || "Nenhum texto detectado!";
        }
    }).catch(err => {
        console.error('Erro no Tesseract:', err);
        if (spanTexto) {
            spanTexto.textContent = "Erro ao processar!";
        }
    }).finally(() => {
        mostrarProcessando('texto', false);
    });
}

function processarImagemCodigoMelhorada() {
    console.log('processarImagemCodigo chamada');
    console.log('imagemSelecionadaCodigo:', !!imagemSelecionadaCodigo);
    
    if (!imagemSelecionadaCodigo) {
        alert("Selecione ou arraste uma imagem antes de processar!");
        return;
    }
    
    const spanCodigo = document.getElementById("codigoExtraido");
    if (spanCodigo) {
        spanCodigo.textContent = "Processando...";
    }
    
    mostrarProcessando('codigo', true);
    
    Tesseract.recognize(
        imagemSelecionadaCodigo,
        'eng',
        { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
        console.log('Texto bruto extraído:', text);
        const numerosExtraidos = text.replace(/[^0-9]/g, '');
        console.log('Números extraídos:', numerosExtraidos);
        
        if (spanCodigo) {
            if (numerosExtraidos) {
                spanCodigo.textContent = numerosExtraidos;
            } else {
                spanCodigo.textContent = "Nenhum número detectado!";
            }
        }
    }).catch(err => {
        console.error('Erro no Tesseract:', err);
        if (spanCodigo) {
            spanCodigo.textContent = "Erro ao processar imagem!";
        }
    }).finally(() => {
        mostrarProcessando('codigo', false);
    });
}

// Log para debug - remover em produção
console.log('Script carregado completamente!');