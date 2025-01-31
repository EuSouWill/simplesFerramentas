function processFile() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];
 

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

        const columnsToRemove = [14]; // Índices das colunas
        const filteredData = jsonData.map(row => {
            return row.filter((_, index) => !columnsToRemove.includes(index));
        });

        displayData(filteredData);
    };
    reader.readAsArrayBuffer(file);
}

function displayData(data) {
    const output = document.getElementById('output');
    let html = '<table><tr>';

    // Headers
    data[0].forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr>';

    // Data rows
    data.slice(1).forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${cell || ''}</td>`;
        });
        html += '</tr>';
    });

    html += '</table>';
    output.innerHTML = html;
}
function displayData(data) {
    const output = document.getElementById('output');
    let html = '<table><tr>';

    // Cabeçalhos
    data[0].forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr>';

    // Linhas de dados
    data.slice(1).forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach((cell, cellIndex) => {
            html += `<td contenteditable="true" onblur="updateData(${rowIndex + 1}, ${cellIndex}, this.innerText)">${cell || ''}</td>`;
        });
        html += '</tr>';
    });

    html += '</table>';
    output.innerHTML = html;
}

// Para armazenar dados atualizados
let updatedData = [];

function updateData(rowIndex, cellIndex, newValue) {
    if (!updatedData[rowIndex]) {
        updatedData[rowIndex] = [];
    }
    updatedData[rowIndex][cellIndex] = newValue;
}

function downloadPDF() {
    const element = document.getElementById('output');
    html2pdf().from(element).set({
        margin: 1,
        filename: 'extrato.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait' }
    }).save();
}

function addColumn() {
    const table = document.querySelector('table');
    if (!table) return;

    const headerRow = table.rows[0];
    const newHeader = document.createElement('th');
    newHeader.textContent = 'Nova Coluna';
    newHeader.contentEditable = 'true';
    newHeader.onblur = function() {
        updateHeader(headerRow.cells.length - 1, this.innerText);
    };
    headerRow.appendChild(newHeader);

    for (let i = 1; i < table.rows.length; i++) {
        const newRow = table.rows[i];
        const newCell = newRow.insertCell(-1);
        newCell.contentEditable = 'true';
        newCell.textContent = '';
        newCell.onblur = function() {
            updateData(i, newRow.cells.length - 1, this.innerText);
        };
    }

    // Adicionar coluna ao updatedData
    if (!updatedData[0]) {
        updatedData[0] = [];
    }
    updatedData[0].push('Nova Coluna');
    for (let i = 1; i < table.rows.length; i++) {
        if (!updatedData[i]) {
            updatedData[i] = [];
        }
        updatedData[i].push('');
    }
}
function displayData(data) {
    const output = document.getElementById('output');
    let html = '<table><tr>';

    // Cabeçalhos
    data[0].forEach((header, index) => {
        html += `<th contenteditable="true" onblur="updateHeader(${index}, this.innerText)">${header}</th>`;
    });
    html += '</tr>';

    // Linhas de dados
    data.slice(1).forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach((cell, cellIndex) => {
            html += `<td contenteditable="true" onblur="updateData(${rowIndex + 1}, ${cellIndex}, this.innerText)">${cell || ''}</td>`;
        });
        html += '</tr>';
    });

    html += '</table>';
    output.innerHTML = html;
}

// Atualizar cabeçalhos
function updateHeader(index, newValue) {
    updatedData[0][index] = newValue;
}

// Atualizar células de dados
function updateData(rowIndex, cellIndex, newValue) {
    if (!updatedData[rowIndex]) {
        updatedData[rowIndex] = [];
    }
    updatedData[rowIndex][cellIndex] = newValue;
}

