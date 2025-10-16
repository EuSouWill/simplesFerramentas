// Utilitários gerais
const Utils = {
    // Formatação de moeda
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    // Formatação de data CORRIGIDA
    formatDate(date) {
        let dateObj;
        
        if (typeof date === 'string') {
            // Se for string no formato YYYY-MM-DD (do input date)
            if (date.includes('-')) {
                const [year, month, day] = date.split('-');
                dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            } else {
                dateObj = new Date(date);
            }
        } else {
            dateObj = new Date(date);
        }
        
        // Formatação manual para evitar problemas de fuso horário
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        
        return `${day}/${month}/${year}`;
    },

    // Parse de valor monetário
    parseCurrency(value) {
        if (typeof value === 'string') {
            return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        }
        return parseFloat(value) || 0;
    },

    // Diferença em dias entre datas CORRIGIDA
    daysDifference(date1, date2) {
        let d1, d2;
        
        // Converter strings de data corretamente
        if (typeof date1 === 'string' && date1.includes('-')) {
            const [year, month, day] = date1.split('-');
            d1 = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
            d1 = new Date(date1);
        }
        
        if (typeof date2 === 'string' && date2.includes('-')) {
            const [year, month, day] = date2.split('-');
            d2 = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
            d2 = new Date(date2);
        }
        
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round((d2 - d1) / oneDay);
    },

    // Validação de data
    isValidDate(dateString) {
        if (typeof dateString === 'string' && dateString.includes('-')) {
            const [year, month, day] = dateString.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            return date instanceof Date && !isNaN(date);
        }
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    },

    // Função para criar data a partir de string sem problemas de fuso horário
    createDateFromString(dateString) {
        if (typeof dateString === 'string' && dateString.includes('-')) {
            const [year, month, day] = dateString.split('-');
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        return new Date(dateString);
    }
};
// Sistema de notificações
const Toast = {
    show(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remover toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, duration);
    },

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
};

// Sistema de loading
const Loading = {
    show() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    },

    hide() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
};

// Validação de formulários
const FormValidator = {
    validateUpgradeForm() {
        const errors = [];
        
        const currentValue = document.getElementById('currentPlanValue').value;
        const startDate = document.getElementById('startDate').value;
        const upgradeDate = document.getElementById('upgradeDate').value;
        const newValue = document.getElementById('newPlanValue').value;

        // Validar valores monetários
        if (!currentValue || Utils.parseCurrency(currentValue) <= 0) {
            errors.push('Valor do plano atual deve ser maior que zero');
            this.setFieldError('currentPlanValue');
        } else {
            this.setFieldSuccess('currentPlanValue');
        }

        if (!newValue || Utils.parseCurrency(newValue) <= 0) {
            errors.push('Valor do novo plano deve ser maior que zero');
            this.setFieldError('newPlanValue');
        } else {
            this.setFieldSuccess('newPlanValue');
        }

        // Validar datas
        if (!startDate || !Utils.isValidDate(startDate)) {
            errors.push('Data de contratação é obrigatória');
            this.setFieldError('startDate');
        } else {
            this.setFieldSuccess('startDate');
        }

        if (!upgradeDate || !Utils.isValidDate(upgradeDate)) {
            errors.push('Data do upgrade é obrigatória');
            this.setFieldError('upgradeDate');
        } else {
            this.setFieldSuccess('upgradeDate');
        }

        // Validar se data do upgrade é posterior à contratação
        if (startDate && upgradeDate && new Date(upgradeDate) <= new Date(startDate)) {
            errors.push('Data do upgrade deve ser posterior à data de contratação');
            this.setFieldError('upgradeDate');
        }

        // Validar se novo plano é mais caro
        if (currentValue && newValue && Utils.parseCurrency(newValue) <= Utils.parseCurrency(currentValue)) {
            errors.push('O novo plano deve ter valor maior que o atual');
            this.setFieldError('newPlanValue');
        }

        return errors;
    },

    setFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            const formGroup = field.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('success');
                formGroup.classList.add('error');
            }
        }
    },

    setFieldSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            const formGroup = field.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('error');
                formGroup.classList.add('success');
            }
        }
    },

    clearValidation() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
    }
};


// Função  calcular meses utilizados
function calculateMonthsUsed(startDate, upgradeDate) {
    // Usar a função utilitária para criar datas corretamente
    const start = Utils.createDateFromString(startDate);
    const upgrade = Utils.createDateFromString(upgradeDate);
    
    // Se a data de upgrade for anterior ou igual à data de início, retorna 0
    if (upgrade <= start) {
        return 0;
    }
    
    let months = 0;
    const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    
    // Contar mês por mês
    while (current <= upgrade) {
        months++;
        
        // Avançar para o próximo mês
        current.setMonth(current.getMonth() + 1);
        
        // Se passou de 12 meses, parar
        if (months >= 12) {
            break;
        }
    }
    
    return Math.min(months, 12);
}

// Calculadora de Upgrade - Sistema com Abatimento do Saldo (FUNÇÃO CORRIGIDA)
function calculateUpgrade() {
    Loading.show();
    FormValidator.clearValidation();

    setTimeout(() => {
        const errors = FormValidator.validateUpgradeForm();

        if (errors.length > 0) {
            Loading.hide();
            Toast.show(errors.join('<br>'), 'error', 5000);
            return;
        }

        try {
            const currentPlanValue = Utils.parseCurrency(document.getElementById('currentPlanValue').value);
            const startDate = document.getElementById('startDate').value;
            const upgradeDate = document.getElementById('upgradeDate').value;
            const newPlanValue = Utils.parseCurrency(document.getElementById('newPlanValue').value);

            // USAR AS FUNÇÕES UTILITÁRIAS CORRIGIDAS
            const startDateObj = Utils.createDateFromString(startDate);
            const upgradeDateObj = Utils.createDateFromString(upgradeDate);

            // Calcular meses utilizados (sistema mensal)
            const monthsUsed = calculateMonthsUsed(startDate, upgradeDate);
            const monthsRemaining = Math.max(0, 12 - monthsUsed);

            // Valores mensais
            const currentPlanMonthlyValue = currentPlanValue / 12;
            const newPlanMonthlyValue = newPlanValue / 12;

            // Valores calculados
            const valueUsed = currentPlanMonthlyValue * monthsUsed;
            const valueRemaining = currentPlanMonthlyValue * monthsRemaining;

            // Datas - USAR createDateFromString
            const originalExpirationDate = new Date(startDateObj);
            originalExpirationDate.setFullYear(originalExpirationDate.getFullYear() + 1);

            const newExpirationDate = new Date(upgradeDateObj);
            newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);

            // NOVA REGRA: Valor do upgrade = Novo plano - Saldo restante
            const upgradeAmount = Math.max(0, newPlanValue - valueRemaining);
            
            // Se o saldo for maior que o novo plano, não há cobrança adicional
            const hasCredit = valueRemaining > newPlanValue;
            const creditAmount = hasCredit ? valueRemaining - newPlanValue : 0;

            displayUpgradeResultWithDiscount({
                currentPlanValue,
                newPlanValue,
                currentPlanMonthlyValue,
                newPlanMonthlyValue,
                startDate,
                upgradeDate,
                monthsUsed,
                monthsRemaining,
                valueUsed,
                valueRemaining,
                upgradeAmount,
                hasCredit,
                creditAmount,
                originalExpirationDate: originalExpirationDate.toISOString().split('T')[0],
                newExpirationDate: newExpirationDate.toISOString().split('T')[0]
            });

            Loading.hide();
            Toast.show('Cálculo realizado com sucesso!', 'success');

        } catch (error) {
            Loading.hide();
            Toast.show('Erro ao calcular upgrade. Verifique os dados informados.', 'error');
            console.error('Erro no cálculo:', error);
        }
    }, 800);
}

// Função para gerar template 
function generateClientMessageWithDiscount(data) {
    let paymentSection = '';
    
    if (data.hasCredit) {
        paymentSection = `💰 **INFORMAÇÕES DO UPGRADE:**
• Novo plano: ${Utils.formatCurrency(data.newPlanValue)} (anual)
• Saldo disponível: ${Utils.formatCurrency(data.valueRemaining)}
• **🎉 VOCÊ NÃO PRECISA PAGAR NADA!**
• Crédito restante: ${Utils.formatCurrency(data.creditAmount)}`;
    } else {
        paymentSection = `💰 **INFORMAÇÕES DO UPGRADE:**
• Novo plano: ${Utils.formatCurrency(data.newPlanValue)} (anual)
• Saldo disponível para abatimento: ${Utils.formatCurrency(data.valueRemaining)}
• **Valor a pagar para upgrade: ${Utils.formatCurrency(data.upgradeAmount)}**
• Cálculo: ${Utils.formatCurrency(data.newPlanValue)} - ${Utils.formatCurrency(data.valueRemaining)} = ${Utils.formatCurrency(data.upgradeAmount)}`;
    }

    const message = `
Olá!

Analisei sua solicitação de upgrade e segue as informações:

📋 **SITUAÇÃO ATUAL:**
• Plano contratado em: ${Utils.formatDate(data.startDate)}
• Valor do plano atual: ${Utils.formatCurrency(data.currentPlanValue)} (anual)
• Meses já utilizados: ${data.monthsUsed} de 12 meses
• Meses restantes: ${data.monthsRemaining} meses
• Saldo disponível: ${Utils.formatCurrency(data.valueRemaining)}
• Vencimento do plano atual: ${Utils.formatDate(data.originalExpirationDate)}

${paymentSection}

✅ **COMO FUNCIONA O UPGRADE:**
1. Utilizamos seu saldo atual (${Utils.formatCurrency(data.valueRemaining)}) como desconto no novo plano
2. ${data.hasCredit ? 'Como seu saldo é maior que o valor do novo plano, você ainda ficará com crédito!' : `Você paga apenas a diferença: ${Utils.formatCurrency(data.upgradeAmount)}`}
3. O novo plano terá validade de 1 ano a partir da data do upgrade
4. Seu plano atual será cancelado e o saldo utilizado no upgrade

📅 **DATAS:**
• Data do upgrade: ${Utils.formatDate(data.upgradeDate)}
• Vencimento do novo plano: ${Utils.formatDate(data.newExpirationDate)}

${data.hasCredit ? `
💰 **CRÉDITO RESTANTE:**
Após o upgrade, você ainda terá ${Utils.formatCurrency(data.creditAmount)} de crédito que poderá ser utilizado em futuras renovações ou serviços adicionais.
` : ''}

${data.upgradeAmount === 0 && !data.hasCredit ? `
🎉 **EXCELENTE!**
Seu saldo atual cobre exatamente o valor do novo plano. Não há valor adicional a pagar!
` : ''}

Caso deseje prosseguir com o upgrade, estou à disposição para realizar o processo!

Atenciosamente,
[Seu Nome]`.trim();

    return message;
}

// Nova função de display com desconto
function displayUpgradeResultWithDiscount(data) {
    const resultDiv = document.getElementById('upgradeResult');
    
    if (!resultDiv) {
        console.error('Elemento upgradeResult não encontrado');
        return;
    }
    
    const clientMessage = generateClientMessageWithDiscount(data);
    
    let paymentHighlight = '';
    let paymentClass = '';
    
    if (data.hasCredit) {
        paymentHighlight = `🎉 UPGRADE GRATUITO + Crédito de ${Utils.formatCurrency(data.creditAmount)}`;
        paymentClass = 'success';
    } else if (data.upgradeAmount === 0) {
        paymentHighlight = `🎉 UPGRADE GRATUITO - Saldo cobre o novo plano!`;
        paymentClass = 'success';
    } else {
        paymentHighlight = `Valor a pagar: ${Utils.formatCurrency(data.upgradeAmount)}`;
        paymentClass = 'primary';
    }
    
    const resultHTML = `
        <div class="client-explanation">
            <div class="explanation-title">
                <i class="fas fa-info-circle"></i>
                <h3>Informações sobre seu Upgrade</h3>
            </div>
            
            <div class="explanation-text">
                <p><strong>📅 Situação Atual:</strong></p>
                <p>Você contratou seu plano atual em <strong>${Utils.formatDate(data.startDate)}</strong> no valor de <strong>${Utils.formatCurrency(data.currentPlanValue)}</strong> por ano.</p>
                
                <p>Até hoje (${Utils.formatDate(data.upgradeDate)}), você já utilizou <strong>${data.monthsUsed} mês(es)</strong>, restando <strong>${data.monthsRemaining} mês(es)</strong> com saldo de <strong>${Utils.formatCurrency(data.valueRemaining)}</strong>.</p>
                
                <div class="highlight-box ${paymentClass}">
                    <p><strong>💰 Resultado do Upgrade:</strong></p>
                    <p class="upgrade-value">${paymentHighlight}</p>
                </div>
                
                <div class="calculation-breakdown">
                    <h4><i class="fas fa-calculator"></i> Como chegamos neste valor:</h4>
                    <div class="calc-item">
                        <span>Valor do novo plano:</span>
                        <span>${Utils.formatCurrency(data.newPlanValue)}</span>
                    </div>
                    <div class="calc-item">
                        <span>Saldo disponível (desconto):</span>
                        <span>- ${Utils.formatCurrency(data.valueRemaining)}</span>
                    </div>
                    <div class="calc-item total">
                        <span><strong>Valor a pagar:</strong></span>
                        <span><strong>${Utils.formatCurrency(data.upgradeAmount)}</strong></span>
                    </div>
                    ${data.hasCredit ? `
                        <div class="calc-item credit">
                            <span><strong>Crédito restante:</strong></span>
                            <span><strong>+ ${Utils.formatCurrency(data.creditAmount)}</strong></span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="important-note">
                    <p><strong>✅ IMPORTANTE:</strong></p>
                    <p>Seu saldo atual será <strong>utilizado como desconto</strong> no novo plano. O plano atual será cancelado e substituído pelo novo plano com validade até <strong>${Utils.formatDate(data.newExpirationDate)}</strong>.</p>
                </div>
            </div>
        </div>

        <!-- Template para o analista -->
        <div class="client-message-template">
            <div class="template-header">
                <i class="fas fa-envelope"></i>
                <h3>Template de Mensagem para o Cliente</h3>
            </div>
            
            <div class="message-actions">
                <button type="button" onclick="copyClientMessage()" class="btn-copy">
                    <i class="fas fa-copy"></i>
                    Copiar Mensagem
                </button>
                <button type="button" onclick="toggleMessagePreview()" class="btn-preview">
                    <i class="fas fa-eye"></i>
                    Ver/Ocultar Prévia
                </button>
            </div>
            
            <div class="message-preview" id="messagePreview" style="display: none;">
                <pre id="clientMessageText">${clientMessage}</pre>
            </div>
            
            <small class="template-note">
                <i class="fas fa-info-circle"></i>
                Esta mensagem foi gerada automaticamente com a regra de abatimento do saldo.
            </small>
        </div>

        <div class="comparison-table">
            <h4><i class="fas fa-balance-scale"></i> Comparação de Planos</h4>
            <table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Plano Atual</th>
                        <th>Novo Plano</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Valor Anual</td>
                        <td>${Utils.formatCurrency(data.currentPlanValue)}</td>
                        <td>${Utils.formatCurrency(data.newPlanValue)}</td>
                    </tr>
                    <tr>
                        <td>Valor Mensal</td>
                        <td>${Utils.formatCurrency(data.currentPlanMonthlyValue)}</td>
                        <td>${Utils.formatCurrency(data.newPlanMonthlyValue)}</td>
                    </tr>
                    <tr>
                        <td>Data de Contratação</td>
                        <td>${Utils.formatDate(data.startDate)}</td>
                        <td>${Utils.formatDate(data.upgradeDate)}</td>
                    </tr>
                    <tr>
                        <td>Data de Vencimento</td>
                        <td>${Utils.formatDate(data.originalExpirationDate)}</td>
                        <td>${Utils.formatDate(data.newExpirationDate)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="final-summary">
            <div class="summary-header">
                <i class="fas fa-clipboard-check"></i>
                <strong>Resumo Final</strong>
            </div>
            <div class="summary-content">
                <p><strong>💳 Valor a pagar:</strong> ${Utils.formatCurrency(data.upgradeAmount)}</p>
                <p><strong>💰 Desconto aplicado:</strong> ${Utils.formatCurrency(data.valueRemaining)}</p>
                <p><strong>📅 Validade do novo plano:</strong> ${Utils.formatDate(data.upgradeDate)} até ${Utils.formatDate(data.newExpirationDate)}</p>
                ${data.hasCredit ? `<p><strong>🎁 Crédito restante:</strong> ${Utils.formatCurrency(data.creditAmount)}</p>` : ''}
            </div>
        </div>
    `;
    
    resultDiv.innerHTML = resultHTML;
}
// Funções para gerenciar o template da mensagem (ADICIONAR ESTAS FUNÇÕES)
function copyClientMessage() {
    const messageText = document.getElementById('clientMessageText');
    if (messageText) {
        const text = messageText.textContent;
        
        // Tentar usar a API moderna primeiro
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                Toast.show('Mensagem copiada para a área de transferência!', 'success');
            }).catch((err) => {
                console.error('Erro ao copiar:', err);
                fallbackCopyTextToClipboard(text);
            });
        } else {
            // Fallback para navegadores mais antigos
            fallbackCopyTextToClipboard(text);
        }
    } else {
        Toast.show('Erro: mensagem não encontrada', 'error');
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            Toast.show('Mensagem copiada!', 'success');
        } else {
            Toast.show('Erro ao copiar mensagem', 'error');
        }
    } catch (err) {
        console.error('Erro ao copiar:', err);
        Toast.show('Erro ao copiar mensagem', 'error');
    }
    
    document.body.removeChild(textArea);
}

function toggleMessagePreview() {
    const preview = document.getElementById('messagePreview');
    const button = document.querySelector('.btn-preview');
    
    if (preview && button) {
        if (preview.style.display === 'none') {
            preview.style.display = 'block';
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Prévia';
        } else {
            preview.style.display = 'none';
            button.innerHTML = '<i class="fas fa-eye"></i> Ver Prévia';
        }
    }
}

// Função para limpar formulário (MANTER ESTA TAMBÉM)
function clearForm() {
    const form = document.getElementById('upgradeForm');
    if (form) {
        form.reset();
    }
    
    const resultDiv = document.getElementById('upgradeResult');
    if (resultDiv) {
        resultDiv.innerHTML = '';
    }
    
    FormValidator.clearValidation();
    Toast.show('Formulário limpo!', 'info');
}

// Calculadora de duração de plano (MANTER ESTA FUNÇÃO)
function calculateEndDate() {
    const startDateInput = document.getElementById('start-date');
    const resultDiv = document.getElementById('end-date-result');
    
    if (!startDateInput || !startDateInput.value) {
        if (resultDiv) resultDiv.innerHTML = '';
        return;
    }
    
    try {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        
        const today = new Date();
        const daysRemaining = Utils.daysDifference(today, endDate);
        const daysTotal = Utils.daysDifference(startDate, endDate);
        const daysUsed = Math.max(0, daysTotal - daysRemaining);
        const progressPercentage = Math.max(0, Math.min(100, (daysUsed / daysTotal) * 100));
        
        let statusClass = 'info';
        let statusIcon = 'clock';
        let statusText = 'Ativo';
        let progressColor = '#28a745';
        
        if (daysRemaining < 0) {
            statusClass = 'danger';
            statusIcon = 'times-circle';
            statusText = 'Expirado';
            progressColor = '#dc3545';
        } else if (daysRemaining <= 30) {
            statusClass = 'warning';
            statusIcon = 'exclamation-triangle';
            statusText = 'Próximo ao vencimento';
            progressColor = '#ffc107';
        }
        
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-highlight">
                    <i class="fas fa-${statusIcon}"></i>
                    Status: <strong>${statusText}</strong>
                </div>
                
                <div class="plan-duration">
                    <h4><i class="fas fa-calendar-check"></i> Duração do Plano</h4>
                    <ul>
                        <li><span>Data de Início:</span> ${Utils.formatDate(startDate)}</li>
                        <li><span>Data de Término:</span> ${Utils.formatDate(endDate)}</li>
                        <li><span>Dias Restantes:</span> ${Math.max(0, daysRemaining)} dias</li>
                        <li><span>Dias Utilizados:</span> ${daysUsed} dias</li>
                        <li><span>Progresso:</span> ${progressPercentage.toFixed(1)}%</li>
                    </ul>
                </div>
                
                <div class="progress-bar" style="background-color: #e9ecef; border-radius: 10px; height: 10px; margin: 15px 0;">
                    <div style="background-color: ${progressColor}; 
                               height: 100%; width: ${progressPercentage}%; border-radius: 10px; transition: width 0.3s ease;"></div>
                </div>
            `;
        }
        
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Erro ao calcular a duração do plano. Verifique a data informada.
                </div>
            `;
        }
        console.error('Erro no cálculo de duração:', error);
    }
}

// Calculadora de cartão de crédito (MANTER ESTA FUNÇÃO)
function calculateDueDates() {
    const purchaseDate = document.getElementById('purchaseDate').value;
    const installments = parseInt(document.getElementById('installments').value);
    const closingDate = parseInt(document.getElementById('closingDate').value);
    const resultDiv = document.getElementById('creditCardResult');

    // Validações
    if (!purchaseDate || !installments || !closingDate) {
        Toast.show('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    if (installments < 1 || installments > 36) {
        Toast.show('Número de parcelas deve ser entre 1 e 36', 'error');
        return;
    }

    if (closingDate < 1 || closingDate > 31) {
        Toast.show('Dia de fechamento deve ser entre 1 e 31', 'error');
        return;
    }

    Loading.show();

    setTimeout(() => {
        try {
            const purchase = new Date(purchaseDate);
            const installmentsList = [];

            for (let i = 0; i < installments; i++) {
                // Calcular o mês da parcela
                const installmentMonth = new Date(purchase);
                installmentMonth.setMonth(installmentMonth.getMonth() + i);
                
                // Determinar se a compra entrou na fatura atual ou próxima
                let billingCycle = new Date(installmentMonth.getFullYear(), installmentMonth.getMonth(), closingDate);
                
                // Se a compra foi feita depois do fechamento, vai para o próximo ciclo
                if (i === 0 && purchase.getDate() > closingDate) {
                    billingCycle.setMonth(billingCycle.getMonth() + 1);
                }
                
                // Data de vencimento (geralmente 10 dias após o fechamento)
                const dueDate = new Date(billingCycle);
                dueDate.setDate(dueDate.getDate() + 10);
                
                // Ajustar se a data de vencimento cair em fim de semana
                if (dueDate.getDay() === 0) { // Domingo
                    dueDate.setDate(dueDate.getDate() + 1);
                } else if (dueDate.getDay() === 6) { // Sábado
                    dueDate.setDate(dueDate.getDate() + 2);
                }

                installmentsList.push({
                    number: i + 1,
                    closingDate: billingCycle,
                    dueDate: dueDate
                });
            }

            displayCreditCardResult(installmentsList, purchase);
            Loading.hide();
            Toast.show('Datas calculadas com sucesso!', 'success');

        } catch (error) {
            Loading.hide();
            Toast.show('Erro ao calcular datas. Verifique os dados informados.', 'error');
            console.error('Erro no cálculo do cartão:', error);
        }
    }, 500);
}

function displayCreditCardResult(installments, purchaseDate) {
    const resultDiv = document.getElementById('creditCardResult');
    
    if (!resultDiv) return;

    const today = new Date();
    const nextDue = installments.find(inst => inst.dueDate >= today);
    
    let installmentsHTML = '';
    
    installments.forEach((installment, index) => {
        const isPast = installment.dueDate < today;
        const isCurrent = installment === nextDue;
        const statusClass = isPast ? 'past' : isCurrent ? 'current' : 'future';
        const statusIcon = isPast ? 'check-circle' : isCurrent ? 'clock' : 'calendar';
        
        installmentsHTML += `
            <li class="installment-item ${statusClass}">
                <div class="installment-header">
                    <i class="fas fa-${statusIcon}"></i>
                    <strong>Parcela ${installment.number}/${installments.length}</strong>
                </div>
                <div class="installment-details">
                    <span>Fechamento: ${Utils.formatDate(installment.closingDate)}</span>
                    <span>Vencimento: ${Utils.formatDate(installment.dueDate)}</span>
                </div>
            </li>
        `;
    });

    const resultHTML = `
        <div class="result-highlight">
            <i class="fas fa-credit-card"></i>
            Parcelamento em <strong>${installments.length}x</strong>
        </div>
        
        <div class="purchase-info">
            <h4><i class="fas fa-shopping-cart"></i> Informações da Compra</h4>
            <ul>
                <li><span>Data da Compra:</span> ${Utils.formatDate(purchaseDate)}</li>
                <li><span>Quantidade de Parcelas:</span> ${installments.length}x</li>
                <li><span>Primeira Parcela:</span> ${Utils.formatDate(installments[0].dueDate)}</li>
                <li><span>Última Parcela:</span> ${Utils.formatDate(installments[installments.length - 1].dueDate)}</li>
            </ul>
        </div>

        ${nextDue ? `
            <div class="next-due">
                <h4><i class="fas fa-bell"></i> Próximo Vencimento</h4>
                <div class="highlight-due">
                    <strong>Parcela ${nextDue.number}:</strong> ${Utils.formatDate(nextDue.dueDate)}
                    <small>(${Utils.daysDifference(today, nextDue.dueDate)} dias)</small>
                </div>
            </div>
        ` : ''}

        <div class="installments-list">
            <h4><i class="fas fa-list"></i> Cronograma de Parcelas</h4>
            <ul class="installments-timeline">
                ${installmentsHTML}
            </ul>
        </div>
    `;
    
    resultDiv.innerHTML = resultHTML;
}

// Função para toggle do menu mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
    
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Formatação automática de campos monetários
document.addEventListener('DOMContentLoaded', function() {
    // Auto-formatação para campos de valor
    const moneyInputs = document.querySelectorAll('#currentPlanValue, #newPlanValue');
    
    moneyInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = (parseInt(value) / 100).toFixed(2);
                e.target.value = value.replace('.', ',');
            }
        });
    });

    // Definir data padrão do upgrade para hoje
    const upgradeDateInput = document.getElementById('upgradeDate');
    if (upgradeDateInput) {
        const today = new Date().toISOString().split('T')[0];
        upgradeDateInput.value = today;
    }

    // Auto-calcular duração quando mudar a data
    const startDateInput = document.getElementById('start-date');
    if (startDateInput) {
        startDateInput.addEventListener('change', calculateEndDate);
    }
});

// Event listeners para melhor UX
document.addEventListener('keydown', function(e) {
    // Esc para fechar loading
    if (e.key === 'Escape') {
        Loading.hide();
    }
    
    // Enter para calcular quando estiver em um input
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        
        if (e.target.closest('#upgradeForm')) {
            calculateUpgrade();
        } else if (e.target.id === 'start-date') {
            calculateEndDate();
        } else if (e.target.closest('.calculator')) {
            calculateDueDates();
        }
    }
});
// Calculadora de duração de plano
function calculateEndDate() {
    const startDateInput = document.getElementById('start-date');
    const resultDiv = document.getElementById('end-date-result');
    
    if (!startDateInput || !startDateInput.value) {
        if (resultDiv) resultDiv.innerHTML = '';
        return;
    }
    
    try {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        
        const today = new Date();
        const daysRemaining = Utils.daysDifference(today, endDate);
        const daysTotal = Utils.daysDifference(startDate, endDate);
        const daysUsed = Math.max(0, daysTotal - daysRemaining);
        const progressPercentage = Math.max(0, Math.min(100, (daysUsed / daysTotal) * 100));
        
        let statusClass = 'info';
        let statusIcon = 'clock';
        let statusText = 'Ativo';
        let progressColor = '#28a745';
        
        if (daysRemaining < 0) {
            statusClass = 'danger';
            statusIcon = 'times-circle';
            statusText = 'Expirado';
            progressColor = '#dc3545';
        } else if (daysRemaining <= 30) {
            statusClass = 'warning';
            statusIcon = 'exclamation-triangle';
            statusText = 'Próximo ao vencimento';
            progressColor = '#ffc107';
        }
        
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-highlight">
                    <i class="fas fa-${statusIcon}"></i>
                    Status: <strong>${statusText}</strong>
                </div>
                
                <div class="plan-duration">
                    <h4><i class="fas fa-calendar-check"></i> Duração do Plano</h4>
                    <ul>
                        <li><span>Data de Início:</span> ${Utils.formatDate(startDate)}</li>
                        <li><span>Data de Término:</span> ${Utils.formatDate(endDate)}</li>
                        <li><span>Dias Restantes:</span> ${Math.max(0, daysRemaining)} dias</li>
                        <li><span>Dias Utilizados:</span> ${daysUsed} dias</li>
                        <li><span>Progresso:</span> ${progressPercentage.toFixed(1)}%</li>
                    </ul>
                </div>
                
                <div class="progress-bar" style="background-color: #e9ecef; border-radius: 10px; height: 10px; margin: 15px 0;">
                    <div style="background-color: ${progressColor}; 
                               height: 100%; width: ${progressPercentage}%; border-radius: 10px; transition: width 0.3s ease;"></div>
                </div>
            `;
        }
        
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Erro ao calcular a duração do plano. Verifique a data informada.
                </div>
            `;
        }
        console.error('Erro no cálculo de duração:', error);
    }
}

// Calculadora de cartão de crédito
// Função para alternar modo de cálculo
function toggleCalculationMode() {
    const mode = document.getElementById('calculationMode')?.value || 'single';
    const singleSection = document.getElementById('singlePurchaseSection');
    const multipleSection = document.getElementById('multiplePurchasesSection');
    
    if (singleSection && multipleSection) {
        if (mode === 'single') {
            singleSection.style.display = 'block';
            multipleSection.style.display = 'none';
        } else {
            singleSection.style.display = 'none';
            multipleSection.style.display = 'block';
        }
    }
    
    // Limpar resultados
    const resultDiv = document.getElementById('creditCardResult');
    if (resultDiv) resultDiv.innerHTML = '';
}

// Função principal modificada (substitui a calculateDueDates original)
function calculateDueDates() {
    const mode = document.getElementById('calculationMode')?.value || 'single';
    
    if (mode === 'single') {
        calculateSinglePurchase();
    } else {
        calculateMultiplePurchases();
    }
}

// Função para compra única (baseada no código original)
function calculateSinglePurchase() {
    const purchaseDate = document.getElementById('purchaseDate').value;
    const purchaseValue = Utils.parseCurrency(document.getElementById('purchaseValue')?.value || '0');
    const installments = parseInt(document.getElementById('installments').value);
    const closingDate = parseInt(document.getElementById('closingDate').value);

    // Validações
    if (!purchaseDate || !installments || !closingDate) {
        Toast.show('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    if (installments < 1 || installments > 36) {
        Toast.show('Número de parcelas deve ser entre 1 e 36', 'error');
        return;
    }

    if (closingDate < 1 || closingDate > 31) {
        Toast.show('Dia de fechamento deve ser entre 1 e 31', 'error');
        return;
    }

    Loading.show();

    setTimeout(() => {
        try {
            const purchase = Utils.createDateFromString ? Utils.createDateFromString(purchaseDate) : new Date(purchaseDate);
            const installmentValue = purchaseValue > 0 ? purchaseValue / installments : 0;
            const installmentsList = [];

            for (let i = 0; i < installments; i++) {
                const installmentMonth = new Date(purchase);
                installmentMonth.setMonth(installmentMonth.getMonth() + i);
                
                let billingCycle = new Date(installmentMonth.getFullYear(), installmentMonth.getMonth(), closingDate);
                
                if (i === 0 && purchase.getDate() > closingDate) {
                    billingCycle.setMonth(billingCycle.getMonth() + 1);
                }
                
                const dueDate = new Date(billingCycle);
                dueDate.setDate(dueDate.getDate() + 10);
                
                if (dueDate.getDay() === 0) {
                    dueDate.setDate(dueDate.getDate() + 1);
                } else if (dueDate.getDay() === 6) {
                    dueDate.setDate(dueDate.getDate() + 2);
                }

                installmentsList.push({
                    number: i + 1,
                    closingDate: billingCycle,
                    dueDate: dueDate,
                    value: installmentValue,
                    description: 'Compra Única'
                });
            }

            const clientMessage = generateSinglePurchaseMessage({
                purchaseDate,
                purchaseValue,
                installments,
                installmentValue,
                installmentsList,
                closingDate
            });

            displayCreditCardResultEnhanced(installmentsList, purchase, clientMessage, {
                purchaseValue,
                installmentValue,
                mode: 'single'
            });
            
            Loading.hide();
            Toast.show('Datas calculadas com sucesso!', 'success');

        } catch (error) {
            Loading.hide();
            Toast.show('Erro ao calcular datas. Verifique os dados informados.', 'error');
            console.error('Erro no cálculo do cartão:', error);
        }
    }, 500);
}
// Função para múltiplas compras
function calculateMultiplePurchases() {
    const closingDate = parseInt(document.getElementById('closingDateMultiple').value);
    
    const purchase1Date = document.getElementById('purchase1Date').value;
    const purchase1Value = Utils.parseCurrency(document.getElementById('purchase1Value')?.value || '0');
    const purchase1Installments = parseInt(document.getElementById('purchase1Installments').value);
    const purchase1Description = document.getElementById('purchase1Description').value || 'Primeira Compra';
    
    const purchase2Date = document.getElementById('purchase2Date').value;
    const purchase2Value = Utils.parseCurrency(document.getElementById('purchase2Value')?.value || '0');
    const purchase2Installments = parseInt(document.getElementById('purchase2Installments').value);
    const purchase2Description = document.getElementById('purchase2Description').value || 'Segunda Compra';

    // Validações
    if (!purchase1Date || !purchase1Installments || !purchase2Date || !purchase2Installments || !closingDate) {
        Toast.show('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    if (purchase1Installments < 1 || purchase1Installments > 36 || 
        purchase2Installments < 1 || purchase2Installments > 36) {
        Toast.show('Número de parcelas deve ser entre 1 e 36', 'error');
        return;
    }

    if (closingDate < 1 || closingDate > 31) {
        Toast.show('Dia de fechamento deve ser entre 1 e 31', 'error');
        return;
    }

    Loading.show();

    setTimeout(() => {
        try {
            const date1 = Utils.createDateFromString ? Utils.createDateFromString(purchase1Date) : new Date(purchase1Date);
            const date2 = Utils.createDateFromString ? Utils.createDateFromString(purchase2Date) : new Date(purchase2Date);
            
            const installment1Value = purchase1Value > 0 ? purchase1Value / purchase1Installments : 0;
            const installment2Value = purchase2Value > 0 ? purchase2Value / purchase2Installments : 0;

            // Calcular parcelas para ambas as compras
            const installments1 = calculateInstallmentsForPurchase(date1, purchase1Installments, closingDate, installment1Value, purchase1Description);
            const installments2 = calculateInstallmentsForPurchase(date2, purchase2Installments, closingDate, installment2Value, purchase2Description);

            const data = {
                purchase1: {
                    date: purchase1Date,
                    value: purchase1Value,
                    installments: purchase1Installments,
                    installmentValue: installment1Value,
                    description: purchase1Description,
                    installmentsList: installments1
                },
                purchase2: {
                    date: purchase2Date,
                    value: purchase2Value,
                    installments: purchase2Installments,
                    installmentValue: installment2Value,
                    description: purchase2Description,
                    installmentsList: installments2
                },
                closingDate
            };

            const clientMessage = generateMultiplePurchasesMessage(data);
            displayMultiplePurchasesResult(data, clientMessage);
            
            Loading.hide();
            Toast.show('Cálculo de múltiplas compras realizado com sucesso!', 'success');

        } catch (error) {
            Loading.hide();
            Toast.show('Erro ao calcular parcelas. Verifique os dados informados.', 'error');
            console.error('Erro no cálculo:', error);
        }
    }, 500);
}

// Função utilitária para calcular parcelas de uma compra
// Função CORRIGIDA para calcular parcelas de uma compra
function calculateInstallmentsForPurchase(purchaseDate, installmentCount, closingDay, installmentValue, description) {
    const installments = [];
    
    for (let i = 0; i < installmentCount; i++) {
        // Data da parcela atual (mês + i da data de compra)
        const installmentMonth = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth() + i, purchaseDate.getDate());
        
        // Determinar em qual fatura essa parcela será incluída
        let billingCycle = new Date(installmentMonth.getFullYear(), installmentMonth.getMonth(), closingDay);
        
        // Se for a primeira parcela e a compra foi feita após o fechamento, vai para o próximo ciclo
        if (i === 0 && purchaseDate.getDate() > closingDay) {
            billingCycle.setMonth(billingCycle.getMonth() + 1);
        }
        // Para parcelas subsequentes, verificar se o dia da compra original passou do fechamento
        else if (i > 0) {
            // Se a data de vencimento "natural" da parcela for após o fechamento do mês, 
            // ela vai para o próximo fechamento
            const naturalDueDay = installmentMonth.getDate();
            if (naturalDueDay > closingDay) {
                billingCycle.setMonth(billingCycle.getMonth() + 1);
            }
        }
        
        // Data de vencimento da fatura (10 dias após fechamento)
        const dueDate = new Date(billingCycle);
        dueDate.setDate(dueDate.getDate() + 10);
        
        // Ajustar se cair em fim de semana
        if (dueDate.getDay() === 0) { // Domingo
            dueDate.setDate(dueDate.getDate() + 1);
        } else if (dueDate.getDay() === 6) { // Sábado
            dueDate.setDate(dueDate.getDate() + 2);
        }

        installments.push({
            number: i + 1,
            total: installmentCount,
            value: installmentValue,
            closingDate: billingCycle,
            dueDate: dueDate,
            description: description,
            originalPurchaseDate: new Date(purchaseDate) // Para referência
        });
    }

    return installments;
}
// Função modificada para exibir resultado de compra única (compatível com o código original)
function displayCreditCardResultEnhanced(installments, purchaseDate, clientMessage = null, additionalData = null) {
    const resultDiv = document.getElementById('creditCardResult');
    
    if (!resultDiv) return;

    const today = new Date();
    const nextDue = installments.find(inst => inst.dueDate >= today);
    
    let installmentsHTML = '';
    
    installments.forEach((installment) => {
        const isPast = installment.dueDate < today;
        const isCurrent = installment === nextDue;
        const statusClass = isPast ? 'past' : isCurrent ? 'current' : 'future';
        const statusIcon = isPast ? 'check-circle' : isCurrent ? 'clock' : 'calendar';
        
        installmentsHTML += `
            <li class="installment-item ${statusClass}">
                <div class="installment-header">
                    <i class="fas fa-${statusIcon}"></i>
                    <strong>Parcela ${installment.number}/${installments.length}</strong>
                    ${additionalData?.installmentValue ? `<span>${Utils.formatCurrency(installment.value || additionalData.installmentValue)}</span>` : ''}
                </div>
                <div class="installment-details">
                    <span>Fechamento: ${Utils.formatDate(installment.closingDate)}</span>
                    <span>Vencimento: ${Utils.formatDate(installment.dueDate)}</span>
                </div>
            </li>
        `;
    });

    const resultHTML = `
        <div class="result-highlight">
            <i class="fas fa-credit-card"></i>
            ${additionalData?.purchaseValue ? 
                `Compra: ${Utils.formatCurrency(additionalData.purchaseValue)} em <strong>${installments.length}x</strong> de ${Utils.formatCurrency(additionalData.installmentValue)}` :
                `Parcelamento em <strong>${installments.length}x</strong>`
            }
        </div>

        ${clientMessage ? `
            <!-- Template para o analista -->
            <div class="client-message-template">
                <div class="template-header">
                    <i class="fas fa-envelope"></i>
                    <h3>Template de Mensagem para o Cliente</h3>
                </div>
                
                <div class="message-actions">
                    <button type="button" onclick="copyCreditCardMessage()" class="btn-copy">
                        <i class="fas fa-copy"></i>
                        Copiar Mensagem
                    </button>
                    <button type="button" onclick="toggleCreditCardPreview()" class="btn-preview">
                        <i class="fas fa-eye"></i>
                        Ver/Ocultar Prévia
                    </button>
                </div>
                
                <div class="message-preview" id="creditCardMessagePreview" style="display: none;">
                    <pre id="creditCardMessageText">${clientMessage}</pre>
                </div>
                
                <small class="template-note">
                    <i class="fas fa-info-circle"></i>
                    Mensagem gerada automaticamente para o cliente.
                </small>
            </div>
        ` : ''}
        
        <div class="purchase-info">
            <h4><i class="fas fa-shopping-cart"></i> Informações da Compra</h4>
            <ul>
                <li><span>Data da Compra:</span> ${Utils.formatDate(purchaseDate)}</li>
                ${additionalData?.purchaseValue ? `<li><span>Valor Total:</span> ${Utils.formatCurrency(additionalData.purchaseValue)}</li>` : ''}
                <li><span>Quantidade de Parcelas:</span> ${installments.length}x</li>
                ${additionalData?.installmentValue ? `<li><span>Valor por Parcela:</span> ${Utils.formatCurrency(additionalData.installmentValue)}</li>` : ''}
                <li><span>Primeira Parcela:</span> ${Utils.formatDate(installments[0].dueDate)}</li>
                <li><span>Última Parcela:</span> ${Utils.formatDate(installments[installments.length - 1].dueDate)}</li>
            </ul>
        </div>

        ${nextDue ? `
            <div class="next-due">
                <h4><i class="fas fa-bell"></i> Próximo Vencimento</h4>
                <div class="highlight-due">
                    <strong>Parcela ${nextDue.number}:</strong> ${Utils.formatDate(nextDue.dueDate)}
                    ${nextDue.value ? ` - ${Utils.formatCurrency(nextDue.value)}` : ''}
                    <small>(${Utils.daysDifference(today, nextDue.dueDate)} dias)</small>
                </div>
            </div>
        ` : ''}

        <div class="installments-list">
            <h4><i class="fas fa-list"></i> Cronograma de Parcelas</h4>
            <ul class="installments-timeline">
                ${installmentsHTML}
            </ul>
        </div>
    `;
    
    resultDiv.innerHTML = resultHTML;
}

// Função para exibir resultado de múltiplas compras
function displayMultiplePurchasesResult(data, clientMessage) {
    const resultDiv = document.getElementById('creditCardResult');
    
    if (!resultDiv) return;

    const today = new Date();
    const allInstallments = [...data.purchase1.installmentsList, ...data.purchase2.installmentsList];
    
    // Ordenar por data de vencimento
    allInstallments.sort((a, b) => a.dueDate - b.dueDate);
    
    // Criar resumo mensal
    const monthlyResume = createMonthlyResume(allInstallments);
    
    // Determinar quando cada compra termina
    const purchase1EndDate = data.purchase1.installmentsList[data.purchase1.installmentsList.length - 1].dueDate;
    const purchase2EndDate = data.purchase2.installmentsList[data.purchase2.installmentsList.length - 1].dueDate;

    const resultHTML = `
        <div class="purchases-summary">
            <h4><i class="fas fa-shopping-cart"></i> Resumo das Compras</h4>
            <div class="summary-grid">
                <div class="summary-item">
                    <span>Total Geral:</span>
                    <span><strong>${Utils.formatCurrency(data.purchase1.value + data.purchase2.value)}</strong></span>
                </div>
                <div class="summary-item">
                    <span>Primeira Parcela:</span>
                    <span>${Utils.formatDate(allInstallments[0].dueDate)}</span>
                </div>
                <div class="summary-item">
                    <span>Última Parcela:</span>
                    <span>${Utils.formatDate(allInstallments[allInstallments.length - 1].dueDate)}</span>
                </div>
            </div>
        </div>

        <!-- Template para o analista -->
        <div class="client-message-template">
            <div class="template-header">
                <i class="fas fa-envelope"></i>
                <h3>Template de Mensagem para o Cliente</h3>
            </div>
            
            <div class="message-actions">
                <button type="button" onclick="copyCreditCardMessage()" class="btn-copy">
                    <i class="fas fa-copy"></i>
                    Copiar Mensagem
                </button>
                <button type="button" onclick="toggleCreditCardPreview()" class="btn-preview">
                    <i class="fas fa-eye"></i>
                    Ver/Ocultar Prévia
                </button>
            </div>
            
            <div class="message-preview" id="creditCardMessagePreview" style="display: none;">
                <pre id="creditCardMessageText">${clientMessage}</pre>
            </div>
            
            <small class="template-note">
                <i class="fas fa-info-circle"></i>
                Mensagem gerada automaticamente para múltiplas compras.
            </small>
        </div>

        <div class="purchase-timeline">
            <h4><i class="fas fa-timeline"></i> Timeline das Compras</h4>
            
            <div class="timeline-purchase purchase1">
                <div class="purchase-header">
                    <span class="purchase-title">${data.purchase1.description}</span>
                    <span class="purchase-status ${purchase1EndDate > today ? 'active' : 'finished'}">
                        ${purchase1EndDate > today ? 'Ativo' : 'Finalizado'}
                    </span>
                </div>
                <div class="purchase-details">
                    <p><strong>Valor:</strong> ${Utils.formatCurrency(data.purchase1.value)} em ${data.purchase1.installments}x de ${Utils.formatCurrency(data.purchase1.installmentValue)}</p>
                    <p><strong>Período:</strong> ${Utils.formatDate(data.purchase1.date)} - Termina em ${Utils.formatDate(purchase1EndDate)}</p>
                </div>
            </div>

            <div class="timeline-purchase purchase2">
                <div class="purchase-header">
                    <span class="purchase-title">${data.purchase2.description}</span>
                    <span class="purchase-status ${purchase2EndDate > today ? 'active' : 'finished'}">
                        ${purchase2EndDate > today ? 'Ativo' : 'Finalizado'}
                    </span>
                </div>
                <div class="purchase-details">
                    <p><strong>Valor:</strong> ${Utils.formatCurrency(data.purchase2.value)} em ${data.purchase2.installments}x de ${Utils.formatCurrency(data.purchase2.installmentValue)}</p>
                    <p><strong>Período:</strong> ${Utils.formatDate(data.purchase2.date)} - Termina em ${Utils.formatDate(purchase2EndDate)}</p>
                </div>
            </div>
        </div>

        <div class="monthly-summary">
            <h4><i class="fas fa-calendar-alt"></i> Resumo Mensal</h4>
            ${monthlyResume}
        </div>
    `;
    
    resultDiv.innerHTML = resultHTML;
}

// Função para criar resumo mensal
function createMonthlyResume(allInstallments) {
    const monthlyTotals = {};
    
    allInstallments.forEach(installment => {
        // Usar a data de vencimento real de cada parcela
        const dueDate = installment.dueDate;
        const monthKey = dueDate.getFullYear() + '-' + (dueDate.getMonth() + 1).toString().padStart(2, '0');
        
        if (!monthlyTotals[monthKey]) {
            monthlyTotals[monthKey] = {
                total: 0,
                installments: [],
                details: []
            };
        }
        
        monthlyTotals[monthKey].total += installment.value;
        monthlyTotals[monthKey].installments.push(installment);
        monthlyTotals[monthKey].details.push({
            description: installment.description,
            value: installment.value,
            parcela: `${installment.number}/${installment.total}`
        });
    });
    
    let resumeHTML = '';
    Object.keys(monthlyTotals).sort().forEach(monthKey => {
        const [year, month] = monthKey.split('-');
        const monthName = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        const monthData = monthlyTotals[monthKey];
        const installmentCount = monthData.installments.length;
        
        resumeHTML += `
            <div class="month-item">
                <div class="month-header">
                    <span><strong>${monthName.charAt(0).toUpperCase() + monthName.slice(1)}:</strong></span>
                    <span><strong>${Utils.formatCurrency(monthData.total)}</strong> (${installmentCount} parcela${installmentCount > 1 ? 's' : ''})</span>
                </div>
                <div class="month-details">
                    ${monthData.details.map(detail => 
                        `<small>• ${detail.description} - Parcela ${detail.parcela}: ${Utils.formatCurrency(detail.value)}</small>`
                    ).join('<br>')}
                </div>
            </div>
        `;
    });
    
    return resumeHTML;
}

// Manter compatibilidade com função original
function displayCreditCardResult(installments, purchaseDate, clientMessage = null, additionalData = null) {
    displayCreditCardResultEnhanced(installments, purchaseDate, clientMessage, additionalData);
}
// Função para gerar mensagem de compra única
function generateSinglePurchaseMessage(data) {
    const message = `
Olá!

Segue o cronograma das parcelas da sua compra no cartão de crédito:

📋 **INFORMAÇÕES DA COMPRA:**
• Data da compra: ${Utils.formatDate(data.purchaseDate)}
• Valor total: ${Utils.formatCurrency(data.purchaseValue)}
• Parcelamento: ${data.installments}x de ${Utils.formatCurrency(data.installmentValue)}
• Data de fechamento da fatura: dia ${data.closingDate}

📅 **CRONOGRAMA DE VENCIMENTOS:**
• Primeira parcela: ${Utils.formatDate(data.installmentsList[0].dueDate)}
• Última parcela: ${Utils.formatDate(data.installmentsList[data.installmentsList.length - 1].dueDate)}

📝 **DETALHAMENTO DAS PARCELAS:**
${data.installmentsList.map(inst => 
    `Parcela ${inst.number}/${data.installments}: Vencimento em ${Utils.formatDate(inst.dueDate)} - ${Utils.formatCurrency(inst.value)}`
).join('\n')}

💳 **IMPORTANTE:**
As parcelas aparecerão na sua fatura conforme as datas de fechamento. Lembre-se de que o vencimento da fatura é sempre 10 dias após o fechamento.

Caso tenha dúvidas sobre as datas de cobrança, estou à disposição!

Atenciosamente,
[Seu Nome]
Suporte Técnico`.trim();

    return message;
}

// Função para gerar mensagem de múltiplas compras
function generateMultiplePurchasesMessage(data) {
    const purchase1EndDate = data.purchase1.installmentsList[data.purchase1.installmentsList.length - 1].dueDate;
    const purchase2EndDate = data.purchase2.installmentsList[data.purchase2.installmentsList.length - 1].dueDate;
    const allInstallments = [...data.purchase1.installmentsList, ...data.purchase2.installmentsList];
    allInstallments.sort((a, b) => a.dueDate - b.dueDate);

    // Calcular totais mensais CORRIGIDO
    const monthlyTotals = {};
    allInstallments.forEach(installment => {
        const dueDate = installment.dueDate;
        const monthKey = dueDate.getFullYear() + '-' + (dueDate.getMonth() + 1).toString().padStart(2, '0');
        
        if (!monthlyTotals[monthKey]) {
            monthlyTotals[monthKey] = {
                total: 0,
                details: []
            };
        }
        
        monthlyTotals[monthKey].total += installment.value;
        monthlyTotals[monthKey].details.push({
            description: installment.description,
            value: installment.value,
            parcela: `${installment.number}/${installment.total}`
        });
    });

    let monthlyBreakdown = '';
    Object.keys(monthlyTotals).sort().forEach(monthKey => {
        const [year, month] = monthKey.split('-');
        const monthName = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        const monthData = monthlyTotals[monthKey];
        
        monthlyBreakdown += `
📅 **${monthName.charAt(0).toUpperCase() + monthName.slice(1)}:** ${Utils.formatCurrency(monthData.total)} (${monthData.details.length} parcela${monthData.details.length > 1 ? 's' : ''})
${monthData.details.map(detail => `   • ${detail.description} - Parcela ${detail.parcela}: ${Utils.formatCurrency(detail.value)}`).join('\n')}
`;
    });

    const message = `
Olá!

Analisei suas duas compras parceladas e segue o cronograma completo:

🛍️ **RESUMO DAS COMPRAS:**

**${data.purchase1.description}:**
• Data: ${Utils.formatDate(data.purchase1.date)}
• Valor: ${Utils.formatCurrency(data.purchase1.value)}
• Parcelamento: ${data.purchase1.installments}x de ${Utils.formatCurrency(data.purchase1.installmentValue)}
• Término: ${Utils.formatDate(purchase1EndDate)}

**${data.purchase2.description}:**
• Data: ${Utils.formatDate(data.purchase2.date)}
• Valor: ${Utils.formatCurrency(data.purchase2.value)}
• Parcelamento: ${data.purchase2.installments}x de ${Utils.formatCurrency(data.purchase2.installmentValue)}
• Término: ${Utils.formatDate(purchase2EndDate)}

💰 **VALOR TOTAL:** ${Utils.formatCurrency(data.purchase1.value + data.purchase2.value)}

📊 **CRONOGRAMA MENSAL DETALHADO:**
${monthlyBreakdown}

📋 **INFORMAÇÕES IMPORTANTES:**
• Data de fechamento da fatura: dia ${data.closingDate}
• Vencimento da fatura: sempre 10 dias após o fechamento
• As parcelas são cobradas mensalmente a partir da data de cada compra
• ${data.purchase1.description} termina em: ${Utils.formatDate(purchase1EndDate)}
• ${data.purchase2.description} termina em: ${Utils.formatDate(purchase2EndDate)}

${purchase1EndDate.getTime() !== purchase2EndDate.getTime() ? `
⏰ **ATENÇÃO:** As compras terminam em datas diferentes:
• ${data.purchase1.description}: última parcela em ${Utils.formatDate(purchase1EndDate)}
• ${data.purchase2.description}: última parcela em ${Utils.formatDate(purchase2EndDate)}

Após ${Utils.formatDate(purchase1EndDate < purchase2EndDate ? purchase1EndDate : purchase2EndDate)}, você terá apenas as parcelas da ${purchase1EndDate > purchase2EndDate ? data.purchase1.description : data.purchase2.description} restantes.
` : ''}

Caso tenha dúvidas sobre o cronograma de pagamentos, estou à disposição!

Atenciosamente,
[Seu Nome]
Suporte Técnico`.trim();

    return message;
}

// Funções para gerenciar mensagens do cartão de crédito
function copyCreditCardMessage() {
    const messageText = document.getElementById('creditCardMessageText');
    if (messageText) {
        const text = messageText.textContent;
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                Toast.show('Mensagem copiada para a área de transferência!', 'success');
            }).catch((err) => {
                console.error('Erro ao copiar:', err);
                fallbackCopyTextToClipboard(text);
            });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    } else {
        Toast.show('Erro: mensagem não encontrada', 'error');
    }
}

function toggleCreditCardPreview() {
    const preview = document.getElementById('creditCardMessagePreview');
    const button = document.querySelector('.btn-preview');
    
    if (preview && button) {
        if (preview.style.display === 'none') {
            preview.style.display = 'block';
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Prévia';
        } else {
            preview.style.display = 'none';
            button.innerHTML = '<i class="fas fa-eye"></i> Ver Prévia';
        }
    }
}

// Função para limpar formulário de cartão de crédito
function clearCreditCardForm() {
    const mode = document.getElementById('calculationMode')?.value || 'single';
    
    if (mode === 'single') {
        document.getElementById('purchaseDate').value = '';
        if (document.getElementById('purchaseValue')) document.getElementById('purchaseValue').value = '';
        document.getElementById('installments').value = '';
        document.getElementById('closingDate').value = '';
    } else {
        document.getElementById('closingDateMultiple').value = '';
        document.getElementById('purchase1Date').value = '';
        document.getElementById('purchase1Value').value = '';
        document.getElementById('purchase1Installments').value = '';
        document.getElementById('purchase1Description').value = '';
        document.getElementById('purchase2Date').value = '';
        document.getElementById('purchase2Value').value = '';
        document.getElementById('purchase2Installments').value = '';
        document.getElementById('purchase2Description').value = '';
    }
    
    const resultDiv = document.getElementById('creditCardResult');
    if (resultDiv) {
        resultDiv.innerHTML = '';
    }
    
    Toast.show('Formulário de cartão de crédito limpo!', 'info');
}

// Formatação automática para campos monetários do cartão
document.addEventListener('DOMContentLoaded', function() {
    // Campos monetários da calculadora de cartão
    const creditCardMoneyInputs = document.querySelectorAll('#purchaseValue, #purchase1Value, #purchase2Value');
    
    creditCardMoneyInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = (parseInt(value) / 100).toFixed(2);
                    e.target.value = value.replace('.', ',');
                }
            });
        }
    });

    // Auto-popular data atual nos campos de data se estiverem vazios
    const today = new Date().toISOString().split('T')[0];
    
    const dateFields = ['purchaseDate', 'purchase1Date', 'purchase2Date'];
    dateFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value) {
            field.value = today;
        }
    });
});

// Event listeners específicos para cartão de crédito
document.addEventListener('keydown', function(e) {
    // Enter para calcular quando estiver nos campos do cartão
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const calculator = e.target.closest('.calculator');
        if (calculator) {
            e.preventDefault();
            calculateDueDates();
        }
    }
});

// Função utilitária para validar datas no cartão
function validateCreditCardDates(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const today = new Date();
    
    // Verificar se as datas não são muito antigas (mais de 2 anos)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);
    
    if (d1 < twoYearsAgo || d2 < twoYearsAgo) {
        return {
            valid: false,
            message: 'Datas muito antigas. Verifique se as datas estão corretas.'
        };
    }
    
    // Verificar se as datas não são muito futuras (mais de 1 ano)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    if (d1 > oneYearFromNow || d2 > oneYearFromNow) {
        return {
            valid: false,
            message: 'Datas muito futuras. Verifique se as datas estão corretas.'
        };
    }
    
    return { valid: true };
}

// Função para limpar formulário
function clearForm() {
    const form = document.getElementById('upgradeForm');
    if (form) {
        form.reset();
    }
    
    const resultDiv = document.getElementById('upgradeResult');
    if (resultDiv) {
        resultDiv.innerHTML = '';
    }
    
    FormValidator.clearValidation();
    Toast.show('Formulário limpo!', 'info');
}

// Formatação automática de campos monetários
document.addEventListener('DOMContentLoaded', function() {
    // Auto-formatação para campos de valor
    const moneyInputs = document.querySelectorAll('#currentPlanValue, #newPlanValue');
    
    moneyInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = (parseInt(value) / 100).toFixed(2);
                e.target.value = value.replace('.', ',');
            }
        });
    });

    // Definir data padrão do upgrade para hoje
    const upgradeDateInput = document.getElementById('upgradeDate');
    if (upgradeDateInput) {
        const today = new Date().toISOString().split('T')[0];
        upgradeDateInput.value = today;
    }

    // Auto-calcular duração quando mudar a data
    const startDateInput = document.getElementById('start-date');
    if (startDateInput) {
        startDateInput.addEventListener('change', calculateEndDate);
    }
});

// Função para toggle do menu mobile (se necessário)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
    
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Event listeners para melhor UX
document.addEventListener('keydown', function(e) {
    // Esc para fechar loading
    if (e.key === 'Escape') {
        Loading.hide();
    }
    
    // Enter para calcular quando estiver em um input
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        
        if (e.target.closest('#upgradeForm')) {
            calculateUpgrade();
        } else if (e.target.id === 'start-date') {
            calculateEndDate();
        } else if (e.target.closest('.calculator')) {
            calculateDueDates();
        }
    }
});