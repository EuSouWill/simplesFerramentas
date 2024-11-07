// Função para formatar valores como moeda (R$)
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para formatar inputs como moeda automaticamente
function formatInputToCurrency(input) {
    let value = input.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
    value = (value / 100).toFixed(2); // Converte para valor decimal
    input.value = formatCurrency(Number(value)); // Aplica o formato de moeda
}

// Função para calcular o upgrade
function calculateUpgrade() {
    // Pegar valores de entrada e remover formatação para cálculo
    const currentPlanValue = parseFloat(document.getElementById('currentPlanValue').value.replace(/\D/g, '')) / 100;
    const newPlanValue = parseFloat(document.getElementById('newPlanValue').value.replace(/\D/g, '')) / 100;
    const startDate = new Date(document.getElementById('startDate').value);

    // Verifica se todos os valores estão preenchidos corretamente
    if (isNaN(currentPlanValue) || isNaN(newPlanValue) || isNaN(startDate.getTime())) {
        document.getElementById('result').textContent = 'Por favor, preencha todos os campos corretamente.';
        return;
    }

    // Obter a data atual e calcular o tempo utilizado
    const currentDate = new Date();
    let timeUsed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 30)); // meses completos
    const isCurrentMonthUsed = currentDate.getDate() >= startDate.getDate(); // Verifica se o mês atual já foi "pago"

    // Sistema pré-pago: considera o mês atual como utilizado, se estamos no mês seguinte ao início
    if (isCurrentMonthUsed || currentDate.getMonth() !== startDate.getMonth()) {
        timeUsed++; // Considera o mês atual como utilizado no sistema pré-pago
    }

    const timeRemaining = 12 - timeUsed; // meses restantes

    if (timeRemaining <= 0) {
        document.getElementById('result').textContent = 'O plano já expirou. Não é possível fazer o upgrade.';
        return;
    }

    // Valor exato por mês com 4 casas decimais para evitar erros de arredondamento
    const monthlyValueExact = currentPlanValue / 12;
    
    // Calcular o valor total gasto até agora com precisão
    let totalUsed = 0;
    let monthsDetails = '<ul>';

    for (let i = 0; i < timeUsed; i++) {
        const usedDate = new Date(startDate);
        usedDate.setMonth(usedDate.getMonth() + i);
        
        // Arredonda o valor apenas ao final, mas mantém o valor exato durante o cálculo
        totalUsed += monthlyValueExact;
        
        monthsDetails += `<li>${usedDate.toLocaleDateString('pt-BR')}: Utilizou ${formatCurrency(monthlyValueExact)}</li>`;
    }
    
    // Arredondar o total usado ao final para 2 casas decimais
    totalUsed = Math.round(totalUsed * 100) / 100;
    
    // Calcular o saldo restante
    const remainingValue = Math.round((currentPlanValue - totalUsed) * 100) / 100;

    // Calcular a diferença entre o novo plano e o saldo restante
    let upgradeCost = newPlanValue - remainingValue;

    
    // Exibir os resultados detalhados
    let resultMessage = `Você utilizou ${timeUsed} meses, pagando ${formatCurrency(monthlyValueExact)} por mês. <br>`;
    resultMessage += `Valor total gasto até agora: ${formatCurrency(totalUsed)}. <br>`;
    resultMessage += `Você ainda tem ${timeRemaining} meses restantes, com um saldo de ${formatCurrency(remainingValue)}. <br>`;
    resultMessage += monthsDetails;

    if (upgradeCost > 0) {
        resultMessage += `Para fazer o upgrade, você precisa pagar ${formatCurrency(upgradeCost)}.`;
    } else {
        resultMessage += `Você não precisa pagar nada, pois o saldo do plano atual cobre o valor do novo plano.`;
    }

    // Atualizar o conteúdo da div de resultados
    document.getElementById('result').innerHTML = resultMessage;
}

// Adicionar o evento de formatação de moeda aos inputs
document.getElementById('currentPlanValue').addEventListener('input', function() {
    formatInputToCurrency(this);
});

document.getElementById('newPlanValue').addEventListener('input', function() {
    formatInputToCurrency(this);
});
