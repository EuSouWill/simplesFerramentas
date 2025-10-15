// Utilitários gerais
const Utils = {
    // Formatação de moeda
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    // Formatação de data
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    },

    // Parse de valor monetário
    parseCurrency(value) {
        if (typeof value === 'string') {
            return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        }
        return parseFloat(value) || 0;
    },

    // Diferença em dias entre datas
    daysDifference(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round((new Date(date2) - new Date(date1)) / oneDay);
    },

    // Validação de data
    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
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

// Função para calcular meses utilizados - ADICIONAR ESTA FUNÇÃO
// Função CORRIGIDA para calcular meses utilizados
function calculateMonthsUsed(startDate, upgradeDate) {
    const start = new Date(startDate);
    const upgrade = new Date(upgradeDate);
    
    // Se a data de upgrade for anterior ou igual à data de início, retorna 0
    if (upgrade <= start) {
        return 0;
    }
    
    // Calcular diferença em anos e meses
    let years = upgrade.getFullYear() - start.getFullYear();
    let months = upgrade.getMonth() - start.getMonth();
    
    // Calcular total de meses
    let totalMonths = years * 12 + months;
    
    // Se o dia do upgrade for maior ou igual ao dia de início, 
    // conta o mês atual como utilizado
    if (upgrade.getDate() >= start.getDate()) {
        totalMonths += 1;
    }
    
    // Garantir que não exceda 12 meses
    return Math.min(totalMonths, 12);
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

            const startDateObj = new Date(startDate);
            const upgradeDateObj = new Date(upgradeDate);

            // Calcular meses utilizados (sistema mensal)
            const monthsUsed = calculateMonthsUsed(startDateObj, upgradeDateObj);
            const monthsRemaining = Math.max(0, 12 - monthsUsed);

            // Valores mensais
            const currentPlanMonthlyValue = currentPlanValue / 12;
            const newPlanMonthlyValue = newPlanValue / 12;

            // Valores calculados
            const valueUsed = currentPlanMonthlyValue * monthsUsed;
            const valueRemaining = currentPlanMonthlyValue * monthsRemaining; // Saldo disponível

            // Datas
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

// Função para gerar template de mensagem CORRIGIDO
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
[Seu Nome]
Suporte Técnico`.trim();

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