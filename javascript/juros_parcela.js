function formatarMoeda(input) {
  let valor = input.value.replace(/\D/g, '');
  valor = (valor / 100).toFixed(2) + '';
  valor = valor.replace('.', ',');
  valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  input.value = valor;
}

function parseMoeda(valor) {
  return parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
}

function calcular() {
  const erroDiv = document.getElementById('erro');
  const resultadoDiv = document.getElementById('resultado');
  erroDiv.textContent = '';
  resultadoDiv.innerHTML = '';

  const valor = parseMoeda(document.getElementById('valor').value);
  const parcelas = parseInt(document.getElementById('parcelas').value);
  const jurosMensal = parseFloat(document.getElementById('juros').value) / 100;
  const taxaAdm = parseFloat(document.getElementById('taxa').value) / 100;
  const quemPaga = document.getElementById('quemPaga').value;
  const dataInicialStr = document.getElementById('dataInicial').value;

  if (!valor || !parcelas || parcelas < 1 || jurosMensal < 0 || taxaAdm < 0 || !dataInicialStr) {
    erroDiv.textContent = 'Por favor, preencha todos os campos corretamente.';
    return;
  }

  const dataInicial = new Date(dataInicialStr);
  let parcelaValor, totalComJuros;

  if (quemPaga === 'cliente') {
    const fator = Math.pow(1 + jurosMensal, parcelas);
    parcelaValor = valor * (jurosMensal * fator) / (fator - 1);
    totalComJuros = parcelaValor * parcelas;
  } else {
    parcelaValor = valor / parcelas;
    totalComJuros = valor;
  }

  let totalLiquido = 0;
  let html = `<div class="summary">
    <p><strong>Valor Total da Compra:</strong> R$ ${totalComJuros.toFixed(2).replace('.', ',')}</p>
    <p><strong>Valor de cada parcela:</strong> R$ ${parcelaValor.toFixed(2).replace('.', ',')}</p>
    <p><strong>Taxa Administrativa:</strong> ${(taxaAdm * 100).toFixed(2)}%</p>
  </div>`;

  html += `
    <table>
      <thead>
        <tr>
          <th>Parcela</th>
          <th>Data Recebimento</th>
          <th>Valor Bruto</th>
          <th>Valor Líquido</th>
        </tr>
      </thead>
      <tbody>`;

  for (let i = 0; i < parcelas; i++) {
    const dataParcela = new Date(dataInicial);
    dataParcela.setMonth(dataParcela.getMonth() + i);

    let valorLiquido;
    if (quemPaga === 'cliente') {
      // A taxa adm incide sobre o valor original dividido em parcelas
      const valorBase = valor / parcelas;
      valorLiquido = valorBase * (1 - taxaAdm);
    } else {
      valorLiquido = parcelaValor * (1 - taxaAdm);
    }

    totalLiquido += valorLiquido;

    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${dataParcela.toLocaleDateString()}</td>
        <td>R$ ${parcelaValor.toFixed(2).replace('.', ',')}</td>
        <td>R$ ${valorLiquido.toFixed(2).replace('.', ',')}</td>
      </tr>`;
  }

  html += `
      </tbody>
    </table>
    <p style="margin-top: 10px;"><strong>Total Líquido Recebido:</strong> R$ ${totalLiquido.toFixed(2).replace('.', ',')}</p>`;

  resultadoDiv.innerHTML = html;
}
