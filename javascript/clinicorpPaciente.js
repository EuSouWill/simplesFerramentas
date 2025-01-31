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
        id: entry['id'] || '',
        Nome: entry['Name'] || '', 
        Endereço: `${entry['Address']} ${entry['AddressComplement']} ${entry['AddressNumber']}`.trim(), 
        'Data de nascimento': entry['BirthDate'] || '',
        CEP: entry['CEP'] || '',
        Cidade: entry['City'] || '',
        'Estado Civil': entry['CivilStatus'] || '',
        RG: entry['DocumentId'] || '',
        'Educação': entry['Education'] || '',
        Email: entry['Email'] || '',
        'Profissão do pai': entry['FatherProfession'] || '',
        'Como conheceu': entry['HowDidMeet'] || '',
        'Indicação': entry['IndicationSource'] || '',
        'Telefone fixo': entry['OtherPhones'] || '',
        'Telefone celular': entry['MobilePhone'] || '',
        Telefone: entry['OtherPhones'] || '',
        Celular: entry['MobilePhone'] || '',
        'Profissão da mãe': entry['MotherProfession'] || '',
        Bairro: entry['Neighborhood'] || '',
        Apelido: entry['NickName'] || '',
        Notas: entry['Notes'] || '',
        CPF: entry['OtherDocumentId'] || '', 
        'Outros fones': entry['OtherPhones'] || '', 
        'Responsável': entry['PersonInCharge'] || '', 
        'CPF do responsável': entry['InvalidPersonInChargeOther'] || '', 
        Profissão: entry['Profession'] || '', 
        Sexo: entry['Sex'] || '', 
        'Local de trabalho': entry['Workplace'] || '', 
        'Nome do pai': entry['fatherName'] || '', 
        Plano: entry['insurancePlanName'] || '', 
        'Nome da mãe': entry['motherName'] || '', 
        'Número da carteirinha': entry['numero_carteirinha'] || '', 
        UF: entry['state'] || '',

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