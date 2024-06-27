function calcularJuros() {
    // Obter valores dos campos
    const valorBoleto = parseFloat(document.getElementById('valorBoleto').value);
    const valorJuros = parseFloat(document.getElementById('valorJuros').value);
    const multa = parseFloat(document.getElementById('multa').value);
    const diasAtraso = parseInt(document.getElementById('diasAtraso').value);

    // Calcular valor dos juros acumulados
    const valorJurosAtraso = valorJuros * diasAtraso;

    // Calcular novo valor do boleto
    const novoValor = valorBoleto + valorJurosAtraso + multa;

    // Exibir resultado com descrição detalhada
    document.getElementById('descricao').innerHTML = `
        <div>Valor original do boleto: <strong>R$ ${valorBoleto.toFixed(2)}</strong></div>
        <div>Dias em atraso: <strong>${diasAtraso}</strong></div>
        <div>Valor da multa: <strong>R$ ${multa.toFixed(2)}</strong></div>
        <div>Valor dos juros por dia: <strong>R$ ${valorJuros.toFixed(2)}</strong></div>
        <div>Valor total dos juros: <strong>R$ ${valorJurosAtraso.toFixed(2)}</strong></div>
    `;
    document.getElementById('novoValor').textContent = `Novo valor do boleto: R$ ${novoValor.toFixed(2)}`;
}
