const TAXA_BOLETO = 3.87;
let processedData = [];
let hiddenColumns = new Set();

const COLUMN_CONFIG = [
    { key: 'data', label: 'Data da Operação', required: true },
    { key: 'paciente', label: 'Nome do Paciente', required: false },
    { key: 'metodo', label: 'Método de Pagamento', required: false },
    { key: 'liquido', label: 'Entrada Líquida', required: true },
    { key: 'transacao', label: 'ID da Transação', required: false },
    { key: 'original', label: 'Valor Original', required: true }
];

function formatarMoeda(valor) {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function normalizeHeader(s) {
    if (!s) return '';
    const noBom = String(s).replace(/^\uFEFF/, '');
    const lower = noBom.toLowerCase();
    const normalized = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.replace(/[^a-z0-9\s]/g, ' ').trim();
}

function findHeaderIndex(headers, keywords) {
    for (let i = 0; i < headers.length; i++) {
        const nh = normalizeHeader(headers[i]);
        let ok = true;
        for (const kw of keywords) {
            if (!nh.includes(kw)) { ok = false; break; }
        }
        if (ok) return i;
    }
    for (let i = 0; i < headers.length; i++) {
        const nh = normalizeHeader(headers[i]);
        if (nh.includes(keywords[0])) return i;
    }
    return -1;
}

function parseMonetaryValue(value) {
    if (value === undefined || value === null) return 0;
    let s = String(value).trim();
    if (!s || s === '-' || s.toLowerCase() === 'null' || s.toLowerCase() === 'nan') return 0;
    
    s = s.replace(/^"|"$/g, '').trim();
    let neg = false;
    if (s.startsWith('(') && s.endsWith(')')) { neg = true; s = s.slice(1, -1).trim(); }
    
    s = s.replace(/R\$|\$|\u00A0/g, '').replace(/\s+/g, '');
    
    if (s.includes('.') && s.includes(',')) {
        s = s.replace(/\./g, '').replace(',', '.');
    } else if (s.includes(',')) {
        s = s.replace(',', '.');
    }
    
    s = s.replace(/[^0-9\.\-]/g, '');
    const n = parseFloat(s);
    if (isNaN(n)) return 0;
    return neg ? -Math.abs(n) : Math.abs(n);
}

function parseCSV(text) {
    if (!text) return [];
    const raw = text.replace(/\r/g, '');
    const lines = raw.split('\n').filter(l => l !== undefined && l !== null && l.trim() !== '');
    if (!lines.length) return [];
    
    const firstLine = lines[0];
    const count = ch => (firstLine.match(new RegExp(ch, 'g')) || []).length;
    const counts = { ';': count(';'), ',': count(','), '\t': count('\t') };
    
    let sep = ',';
    if (counts[';'] > counts[','] && counts[';'] >= counts['\t']) sep = ';';
    else if (counts['\t'] > counts[','] && counts['\t'] > counts[';']) sep = '\t';
    
    const rows = [];
    for (const line of lines) {
        const row = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; continue; }
                inQuotes = !inQuotes;
                continue;
            }
            if (ch === sep && !inQuotes) {
                row.push(cur);
                cur = '';
                continue;
            }
            cur += ch;
        }
        row.push(cur);
        rows.push(row.map(c => (c === undefined || c === null) ? '' : String(c).trim().replace(/^"|"$/g, '')));
    }
    
    rows._detectedDelimiter = sep;
    return rows;
}

function createColumnControls() {
    const togglesDiv = document.getElementById('columnToggles');
    if (!togglesDiv) return;
    
    togglesDiv.innerHTML = '';
    
    COLUMN_CONFIG.forEach(col => {
        const div = document.createElement('div');
        div.className = 'column-toggle';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `col-${col.key}`;
        checkbox.checked = !hiddenColumns.has(col.key);
        checkbox.disabled = col.required;
        checkbox.addEventListener('change', () => toggleColumn(col.key));
        
        const label = document.createElement('label');
        label.htmlFor = `col-${col.key}`;
        label.textContent = col.label + (col.required ? ' (obrigatória)' : '');
        
        div.appendChild(checkbox);
        div.appendChild(label);
        togglesDiv.appendChild(div);
    });
}

function toggleColumn(columnKey) {
    if (hiddenColumns.has(columnKey)) {
        hiddenColumns.delete(columnKey);
    } else {
        hiddenColumns.add(columnKey);
    }
    updateTableDisplay();
}

function updateTableDisplay() {
    const header = document.getElementById('tableHeader');
    if (header) {
        const ths = header.querySelectorAll('th');
        ths.forEach((th, index) => {
            const columnKey = COLUMN_CONFIG[index]?.key;
            if (columnKey && hiddenColumns.has(columnKey)) {
                th.classList.add('hidden-column');
            } else {
                th.classList.remove('hidden-column');
            }
        });
    }
    
    const tbody = document.getElementById('tableBody');
    if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const tds = row.querySelectorAll('td');
            tds.forEach((td, index) => {
                const columnKey = COLUMN_CONFIG[index]?.key;
                if (columnKey && hiddenColumns.has(columnKey)) {
                    td.classList.add('hidden-column');
                } else {
                    td.classList.remove('hidden-column');
                }
            });
        });
    }
}

function deleteRow(index) {
    if (confirm('Tem certeza que deseja excluir esta linha?')) {
        if (processedData[index] && !processedData[index].isTotal) {
            const deletedRow = processedData[index];
            const totalRow = processedData[processedData.length - 1];
            
            if (totalRow && totalRow.isTotal) {
                totalRow.valorLiquido -= deletedRow.valorLiquido;
                totalRow.valorOriginal -= deletedRow.valorOriginal;
            }
            
            processedData.splice(index, 1);
            displayResults(totalRow.valorLiquido, totalRow.valorOriginal);
            showSuccess('✅ Linha excluída com sucesso!');
        }
    }
}

document.getElementById('fileInput').addEventListener('change', function (e) {
    const files = e.target.files;
    const names = Array.from(files).map(f => f.name).join(', ');
    document.getElementById('fileName').textContent = names || '';
    document.getElementById('processButton').disabled = files.length === 0;
    hideMessages();
});

function hideMessages() {
    const e1 = document.getElementById('errorMessage');
    const e2 = document.getElementById('successMessage');
    if (e1) e1.style.display = 'none';
    if (e2) e2.style.display = 'none';
}

function showError(msg) {
    const e = document.getElementById('errorMessage');
    if (e) { e.textContent = msg; e.style.display = 'block'; }
}

function showSuccess(msg) {
    const e = document.getElementById('successMessage');
    if (e) { e.textContent = msg; e.style.display = 'block'; }
}

function readFile(file) {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = e => res(e.target.result);
        reader.onerror = rej;
        reader.readAsText(file);
    });
}

function displayResults(totalLiquido, totalOriginal) {
    const totalsDiv = document.getElementById('totals');
    if (totalsDiv) {
        totalsDiv.innerHTML = `
            <h3>📊 Totais das Transações</h3>
            <div class="total-item">💰 Total Líquido: ${formatarMoeda(totalLiquido)}</div>
            <div class="total-item">💳 Total Original: ${formatarMoeda(totalOriginal)}</div>
        `;
    }
    
    createColumnControls();
    
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    processedData.forEach((row, index) => {
        const tr = document.createElement('tr');
        if (row.isTotal) tr.className = 'total-row';
        
        tr.innerHTML = `
            <td>${row.data}</td>
            <td>${row.isTotal ? '' : `<input type="text" class="patient-name-input"
                value="${row.nomePaciente}"
                onchange="updatePatientName(${index}, this.value)"
                placeholder="Digite o nome do paciente">`}</td>
            <td>${row.metodo}</td>
            <td>${formatarMoeda(row.valorLiquido)}</td>
            <td>${row.idTransacao}</td>
            <td>${formatarMoeda(row.valorOriginal)}</td>
            <td>${row.isTotal ? '' : `<button class="delete-row-btn" onclick="deleteRow(${index})">🗑️ Excluir</button>`}</td>
        `;
        tableBody.appendChild(tr);
    });
    
    updateTableDisplay();
    
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) resultsSection.style.display = 'block';
}

function updatePatientName(i, name) {
    if (processedData[i]) processedData[i].nomePaciente = name;
}

async function processFiles() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput ? fileInput.files : [];
    if (!files || files.length === 0) { 
        showError('Por favor, selecione pelo menos um arquivo CSV.'); 
        return; 
    }
    
    document.getElementById('loading').style.display = 'block';
    document.getElementById('processButton').disabled = true;
    hideMessages();
    
    try {
        processedData = [];
        let totalLiquido = 0;
        let totalOriginal = 0;
        
        for (const file of files) {
            const text = await readFile(file);
            const rows = parseCSV(text);
            if (!rows || rows.length === 0) continue;
            
            const headers = rows[0];
            const dataIndex = findHeaderIndex(headers, ['data']);
            const metodoIndex = findHeaderIndex(headers, ['metodo']);
            const transacaoIndex = findHeaderIndex(headers, ['id','transacao']);
            const liquidoIndex = findHeaderIndex(headers, ['entrada','liquida']);
            
            if ([dataIndex, metodoIndex, transacaoIndex, liquidoIndex].some(i => i === -1)) {
                throw new Error('Colunas necessárias não encontradas.');
            }
            
            const dataRows = rows.slice(1);
            
            for (let i = 0; i < dataRows.length; i++) {
                const row = dataRows[i];
                const maxIdx = Math.max(dataIndex, metodoIndex, transacaoIndex, liquidoIndex);
                if (!row || row.length <= maxIdx) continue;
                
                const rawLiquido = row[liquidoIndex];
                const parsedLiquido = parseMonetaryValue(rawLiquido);
                
                const metodo = row[metodoIndex] || '';
                const valorOriginal = metodo.toLowerCase().includes('boleto') ? 
                                     parsedLiquido + TAXA_BOLETO : parsedLiquido;
                
                if (parsedLiquido === 0 && valorOriginal === 0) continue;
                
                const processedRow = {
                    data: row[dataIndex] || '',
                    nomePaciente: '',
                    metodo: metodo,
                    valorLiquido: parsedLiquido,
                    idTransacao: row[transacaoIndex] || '',
                    valorOriginal: valorOriginal
                };
                
                processedData.push(processedRow);
                totalLiquido += parsedLiquido;
                totalOriginal += valorOriginal;
            }
        }
        
        if (processedData.length === 0) throw new Error('Nenhuma transação válida encontrada.');
        
        processedData.push({
            data: 'TOTAL',
            nomePaciente: '',
            metodo: '',
            valorLiquido: totalLiquido,
            idTransacao: '',
            valorOriginal: totalOriginal,
            isTotal: true
        });
        
        displayResults(totalLiquido, totalOriginal);
        showSuccess(`✅ Arquivo processado! ${processedData.length - 1} transações encontradas.`);
        
    } catch (err) {
        console.error(err);
        showError(`❌ ${err.message}`);
    } finally {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('processButton').disabled = false;
    }
}

function downloadCSV() {
    if (!processedData.length) { 
        showError('Nenhum dado para download.'); 
        return; 
    }
    
    const visibleColumns = COLUMN_CONFIG.filter(col => !hiddenColumns.has(col.key));
    const headers = visibleColumns.map(col => col.label);
    const csvRows = [headers.join(',')];
    
    processedData.forEach(r => {
        const row = [];
        visibleColumns.forEach(col => {
            switch(col.key) {
                case 'data': row.push(`"${r.data}"`); break;
                case 'paciente': row.push(`"${r.nomePaciente}"`); break;
                case 'metodo': row.push(`"${r.metodo}"`); break;
                case 'liquido': row.push(`"${formatarMoeda(r.valorLiquido)}"`); break;
                case 'transacao': row.push(`"${r.idTransacao}"`); break;
                case 'original': row.push(`"${formatarMoeda(r.valorOriginal)}"`); break;
            }
        });
        csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `extrato_processado_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess('📥 Download CSV iniciado!');
}

function downloadPDF() {
    if (!processedData.length) { 
        showError('Nenhum dado para download.'); 
        return; 
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Relatório de Extratos', 20, 20);
    
    const visibleColumns = COLUMN_CONFIG.filter(col => !hiddenColumns.has(col.key));
    const headers = visibleColumns.map(col => col.label);
    
    const tableData = processedData.map(r => {
        const row = [];
        visibleColumns.forEach(col => {
            switch(col.key) {
                case 'data': row.push(r.data); break;
                case 'paciente': row.push(r.nomePaciente); break;
                case 'metodo': row.push(r.metodo); break;
                case 'liquido': row.push(formatarMoeda(r.valorLiquido)); break;
                case 'transacao': row.push(r.idTransacao); break;
                case 'original': row.push(formatarMoeda(r.valorOriginal)); break;
            }
        });
        return row;
    });
    
    doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [102, 126, 234] }
    });
    
    doc.save(`extrato_processado_${new Date().toISOString().slice(0,10)}.pdf`);
    showSuccess('📥 Download PDF iniciado!');
}