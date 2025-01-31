document.getElementById('processBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecione um arquivo CSV.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        const data = parseCSV(text);
        console.log('Parsed Data:', data); // Verificar os dados analisados
        const processedData = transformData(data);
        const csvContent = convertToCSV(processedData);
        downloadCSV(csvContent, 'tratado.csv');
    };

    reader.readAsText(file);
});

function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    console.log('Headers:', headers); // Verificar os cabeçalhos

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const entry = {};
        headers.forEach((header, index) => {
            entry[header] = values[index] ? values[index].trim() : '';
        });
        return entry;
    });
}

function transformData(data) {
    return data.map(entry => ({

        Valor: entry['Amount'] || '',
        'Data de vencimento': entry['DueDate'] || '',
        'ID do paciente': entry['PatientId'] || '',
        'Descrição do pagamento': entry['PaymentDescription'] || '',
        'Data de pagamento': entry['PaymentDate'] || '',
        Notas: entry['TransferNotes'] || '',
        'Forma de pagamento': entry['PaymentForm_CharacteristicId'] || '',
        id: entry['id'] || ''

    }));
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(','), ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))];
    return csvRows.join('\n');
}

function downloadCSV(csvContent, fileName) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}