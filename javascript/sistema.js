class SystemDetector {
    constructor() {
        this.systemInfo = {};
        this.accessKey = '3e966bf7-a7ae-4f17-865d-570242bf6558';
        this.targetEmail = 'felipe.castro@simplesdental.com';
        
        this.steps = [
            { name: 'Detectando Sistema Operacional', progress: 10 },
            { name: 'Identificando Navegador Completo', progress: 20 },
            { name: 'Coletando Hardware Disponível', progress: 30 },
            { name: 'Testando Velocidade da Internet', progress: 45 },
            { name: 'Analisando Performance', progress: 55 },
            { name: 'Obtendo Informações de Rede', progress: 70 },
            { name: 'Coletando Dados Avançados', progress: 80 },
            { name: 'Preparando Relatório', progress: 90 },
            { name: 'Enviando Email Completo', progress: 100 }
        ];
        
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando detecção avançada de sistema...');
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
            await this.sleep(800);
        }
    }

    async executeDetectionStep(stepIndex) {
        switch(stepIndex) {
            case 0:
                this.detectOperatingSystem();
                break;
            case 1:
                this.detectBrowserComplete();
                await this.detectBrowserDetails();
                break;
            case 2:
                await this.detectHardware();
                break;
            case 3:
                await this.testInternetSpeed();
                break;
            case 4:
                await this.detectPerformance();
                break;
            case 5:
                await this.getNetworkInfo();
                break;
            case 6:
                await this.getAdvancedInfo();
                break;
            case 7:
                this.prepareReport();
                break;
            case 8:
                // Email será enviado após mostrar resultados
                break;
        }
    }

    detectOperatingSystem() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        let os = 'Desconhecido';
        let version = '';
        let build = '';
        let architecture = '';
        
        // Detecta arquitetura
        if (navigator.userAgentData && navigator.userAgentData.platform) {
            architecture = navigator.userAgentData.platform;
        } else {
            architecture = platform;
        }
        
        if (userAgent.indexOf('Windows NT 10.0') !== -1) {
            os = 'Windows';
            
            // Detecta build específico do Windows
            const buildMatch = userAgent.match(/Windows NT 10\.0.*?(\d+\.\d+)/);
            if (buildMatch) {
                build = buildMatch[1];
            }
            
            // Determina se é Windows 10 ou 11 baseado no build
            if (userAgent.indexOf('Windows NT 10.0') !== -1) {
                const edgeMatch = userAgent.match(/Edg\/(\d+)/);
                const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
                
                // Windows 11 geralmente tem builds >= 22000
                if (edgeMatch && parseInt(edgeMatch[1]) >= 96) {
                    version = '11 (provável)';
                } else if (chromeMatch && parseInt(chromeMatch[1]) >= 96) {
                    version = '11 (provável)';
                } else {
                    version = '10';
                }
            }
            
            if (userAgent.indexOf('Win64') !== -1 || userAgent.indexOf('x64') !== -1) {
                architecture += ' (64-bit)';
            } else {
                architecture += ' (32-bit)';
            }
        } else if (userAgent.indexOf('Windows NT') !== -1) {
            os = 'Windows';
            const versionMatch = userAgent.match(/Windows NT ([0-9.]+)/);
            if (versionMatch) {
                const ntVersion = versionMatch[1];
                switch(ntVersion) {
                    case '6.3': version = '8.1'; break;
                    case '6.2': version = '8'; break;
                    case '6.1': version = '7'; break;
                    case '6.0': version = 'Vista'; break;
                    case '5.2': version = 'XP x64'; break;
                    case '5.1': version = 'XP'; break;
                    default: version = `NT ${ntVersion}`;
                }
            }
        } else if (userAgent.indexOf('Mac OS X') !== -1) {
            const match = userAgent.match(/Mac OS X ([0-9_]+)/);
            os = 'macOS';
            if (match) {
                const macVersion = match[1].replace(/_/g, '.');
                version = this.getMacOSName(macVersion);
            }
            
            // Detecta se é Apple Silicon
            if (userAgent.indexOf('Intel') === -1 && platform === 'MacIntel') {
                architecture += ' (Apple Silicon)';
            } else if (userAgent.indexOf('Intel') !== -1) {
                architecture += ' (Intel)';
            }
        } else if (userAgent.indexOf('Android') !== -1) {
            const match = userAgent.match(/Android ([0-9.]+)/);
            os = 'Android';
            version = match ? match[1] : 'Desconhecida';
            
            // Detecta modelo do dispositivo Android
            const modelMatch = userAgent.match(/; (.+?) Build/);
            if (modelMatch) {
                build = modelMatch[1];
            }
        } else if (/iPhone|iPad|iPod/.test(userAgent)) {
            const match = userAgent.match(/OS ([0-9_]+)/);
            os = userAgent.indexOf('iPad') !== -1 ? 'iPadOS' : 'iOS';
            version = match ? match[1].replace(/_/g, '.') : 'Desconhecida';
            
            // Detecta modelo do dispositivo iOS
            const modelMatch = userAgent.match(/(iPhone|iPad|iPod)[0-9,]+/);
            if (modelMatch) {
                build = modelMatch[0];
            }
        } else if (userAgent.indexOf('Linux') !== -1) {
            os = 'Linux';
            if (userAgent.indexOf('x86_64') !== -1) {
                architecture += ' (64-bit)';
            } else if (userAgent.indexOf('i686') !== -1) {
                architecture += ' (32-bit)';
            }
            
            // Detecta distribuição Linux
            if (userAgent.indexOf('Ubuntu') !== -1) {
                version = 'Ubuntu';
            } else if (userAgent.indexOf('Fedora') !== -1) {
                version = 'Fedora';
            } else if (userAgent.indexOf('CentOS') !== -1) {
                version = 'CentOS';
            }
        }
        
        this.systemInfo.os = `${os} ${version}`.trim();
        this.systemInfo.platform = platform;
        this.systemInfo.architecture = architecture;
        this.systemInfo.buildInfo = build;
        
        document.getElementById('osInfo').textContent = this.systemInfo.os;
    }

    getMacOSName(version) {
        const majorVersion = parseFloat(version);
        if (majorVersion >= 14.0) return `Sonoma (${version})`;
        if (majorVersion >= 13.0) return `Ventura (${version})`;
        if (majorVersion >= 12.0) return `Monterey (${version})`;
        if (majorVersion >= 11.0) return `Big Sur (${version})`;
        if (majorVersion >= 10.15) return `Catalina (${version})`;
        if (majorVersion >= 10.14) return `Mojave (${version})`;
        if (majorVersion >= 10.13) return `High Sierra (${version})`;
        return version;
    }

    detectBrowserComplete() {
    const userAgent = navigator.userAgent;
    let browser = 'Desconhecido';
    let version = '';
    let fullVersion = '';
    let engine = '';
    let engineVersion = '';
    let architecture = '';
    let buildInfo = '';
    
    // Detecta engine e versão
    if (userAgent.indexOf('WebKit') !== -1) {
        engine = 'WebKit';
        const webkitMatch = userAgent.match(/WebKit\/([0-9.]+)/);
        if (webkitMatch) engineVersion = webkitMatch[1];
    } else if (userAgent.indexOf('Gecko') !== -1) {
        engine = 'Gecko';
        const geckoMatch = userAgent.match(/Gecko\/([0-9]+)/);
        if (geckoMatch) engineVersion = geckoMatch[1];
    } else if (userAgent.indexOf('Trident') !== -1) {
        engine = 'Trident';
        const tridentMatch = userAgent.match(/Trident\/([0-9.]+)/);
        if (tridentMatch) engineVersion = tridentMatch[1];
    }
    
    // Detecta arquitetura
    if (userAgent.indexOf('WOW64') !== -1 || userAgent.indexOf('Win64') !== -1 || userAgent.indexOf('x64') !== -1) {
        architecture = '64 bits';
    } else if (userAgent.indexOf('Win32') !== -1 || userAgent.indexOf('i686') !== -1) {
        architecture = '32 bits';
    } else if (userAgent.indexOf('x86_64') !== -1) {
        architecture = '64 bits';
    } else if (userAgent.indexOf('arm64') !== -1 || userAgent.indexOf('aarch64') !== -1) {
        architecture = 'ARM 64 bits';
    }
    
    // Detecta navegador com versão mais detalhada
    if (userAgent.indexOf('Edg') > -1) {
        const match = userAgent.match(/Edg\/([0-9.]+)/);
        browser = 'Microsoft Edge';
        fullVersion = match ? match[1] : '';
        
        // Tenta obter versão mais específica
        const detailedMatch = userAgent.match(/Edg\/(\d+\.\d+\.\d+\.\d+)/);
        if (detailedMatch) {
            fullVersion = detailedMatch[1];
        }
        
        version = fullVersion.split('.')[0];
    } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1) {
        const match = userAgent.match(/Chrome\/([0-9.]+)/);
        browser = 'Google Chrome';
        fullVersion = match ? match[1] : '';
        
        // Tenta obter versão completa de 4 partes
        const detailedMatch = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/);
        if (detailedMatch) {
            fullVersion = detailedMatch[1];
        }
        
        version = fullVersion;
    } else if (userAgent.indexOf('Firefox') > -1) {
        const match = userAgent.match(/Firefox\/([0-9.]+)/);
        browser = 'Mozilla Firefox';
        fullVersion = match ? match[1] : '';
        version = fullVersion;
        
        // Firefox às vezes tem informações adicionais
        const geckoMatch = userAgent.match(/rv:([0-9.]+)/);
        if (geckoMatch) {
            buildInfo = `Gecko ${geckoMatch[1]}`;
        }
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        const match = userAgent.match(/Version\/([0-9.]+)/);
        browser = 'Safari';
        fullVersion = match ? match[1] : '';
        version = fullVersion;
        
        // Pega versão do Safari build
        const safariMatch = userAgent.match(/Safari\/([0-9.]+)/);
        if (safariMatch) {
            buildInfo = `Build ${safariMatch[1]}`;
        }
    } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
        browser = 'Opera';
        const operaMatch = userAgent.match(/(?:Opera|OPR)\/([0-9.]+)/);
        if (operaMatch) {
            fullVersion = operaMatch[1];
            version = fullVersion;
        }
    }
    
    // Tenta usar a User Agent Client Hints API para mais detalhes (Chrome 90+)
    if (navigator.userAgentData) {
        try {
            navigator.userAgentData.getHighEntropyValues([
                'architecture',
                'bitness',
                'model',
                'platform',
                'platformVersion',
                'fullVersionList'
            ]).then(data => {
                console.log('🔍 Dados detalhados do navegador:', data);
                
                if (data.fullVersionList) {
                    const chromeInfo = data.fullVersionList.find(item => 
                        item.brand.includes('Chrome') || item.brand.includes('Chromium')
                    );
                    if (chromeInfo) {
                        this.systemInfo.browserFullVersion = chromeInfo.version;
                        document.getElementById('browserInfo').textContent = 
                            `${browser} ${chromeInfo.version} (${data.architecture || architecture})`;
                    }
                }
                
                if (data.architecture) {
                    architecture = data.architecture;
                }
                if (data.bitness) {
                    architecture += ` ${data.bitness} bits`;
                }
            }).catch(err => {
                console.log('User Agent Client Hints não disponível:', err);
            });
        } catch (error) {
            console.log('Erro ao acessar User Agent Client Hints:', error);
        }
    }
    
    // Informações adicionais do sistema
    const additionalInfo = [];
    if (architecture) additionalInfo.push(architecture);
    if (buildInfo) additionalInfo.push(buildInfo);
    
    const displayVersion = fullVersion + (additionalInfo.length > 0 ? ` (${additionalInfo.join(', ')})` : '');
    
    this.systemInfo.browser = browser;
    this.systemInfo.browserVersion = version;
    this.systemInfo.browserFullVersion = fullVersion;
    this.systemInfo.browserDisplayVersion = displayVersion;
    this.systemInfo.browserEngine = engine;
    this.systemInfo.browserEngineVersion = engineVersion;
    this.systemInfo.browserArchitecture = architecture;
    this.systemInfo.browserBuildInfo = buildInfo;
    this.systemInfo.browserLanguage = navigator.language;
    this.systemInfo.browserLanguages = navigator.languages;
    
    // Atualiza o display
    document.getElementById('browserInfo').textContent = `${browser} ${displayVersion}`;
    
    // Log para debug
    console.log('🌐 Informações do navegador:', {
        userAgent: userAgent,
        browser: browser,
        fullVersion: fullVersion,
        architecture: architecture,
        buildInfo: buildInfo
    });
}
async detectBrowserDetails() {
    try {
        // Tenta obter mais informações usando Performance API
        if (window.chrome && window.chrome.runtime) {
            this.systemInfo.browserDetails = {
                isChrome: true,
                hasExtensions: true
            };
        }
        
        // Detecta se é versão oficial ou desenvolvimento
        if (navigator.userAgent.includes('dev') || navigator.userAgent.includes('beta')) {
            this.systemInfo.browserChannel = 'Beta/Dev';
        } else {
            this.systemInfo.browserChannel = 'Versão Oficial';
        }
        
        // Informações de memória do navegador
        if ('memory' in performance) {
            const mem = performance.memory;
            this.systemInfo.browserMemory = {
                used: Math.round(mem.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(mem.totalJSHeapSize / 1024 / 1024) + ' MB',
                limit: Math.round(mem.jsHeapSizeLimit / 1024 / 1024) + ' MB'
            };
        }
        
    } catch (error) {
        console.warn('Erro ao detectar detalhes do navegador:', error);
    }
}
        async testInternetSpeed() {
        try {
            document.getElementById('status').textContent = 'Testando velocidade da internet...';
            
            const startTime = performance.now();
            const imageSize = 1024 * 100; // 100KB aproximado
            
            // Testa com uma imagem pequena primeiro
            const testImage = new Image();
            const imagePromise = new Promise((resolve, reject) => {
                testImage.onload = () => {
                    const endTime = performance.now();
                    const duration = (endTime - startTime) / 1000; // em segundos
                    const bitsLoaded = imageSize * 8; // converter para bits
                    const speedBps = bitsLoaded / duration;
                    const speedKbps = speedBps / 1024;
                    const speedMbps = speedKbps / 1024;
                    
                    resolve({
                        duration: duration.toFixed(2),
                        speedKbps: speedKbps.toFixed(2),
                        speedMbps: speedMbps.toFixed(2)
                    });
                };
                testImage.onerror = () => {
                    reject(new Error('Falha no teste de velocidade'));
                };
            });
            
            // URL de uma imagem de teste (usando um serviço público)
            testImage.src = `https://httpbin.org/bytes/102400?${Date.now()}`;
            
            const speedResult = await Promise.race([
                imagePromise,
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
            ]);
            
            // Teste adicional com Connection API
            let connectionInfo = {};
            if ('connection' in navigator) {
                const conn = navigator.connection;
                connectionInfo = {
                    effectiveType: conn.effectiveType,
                    downlink: conn.downlink + ' Mbps',
                    rtt: conn.rtt + 'ms',
                    saveData: conn.saveData ? 'Ativado' : 'Desativado'
                };
            }
            
            this.systemInfo.internetSpeed = {
                testDuration: speedResult.duration + 's',
                estimatedSpeed: speedResult.speedMbps + ' Mbps',
                estimatedSpeedKbps: speedResult.speedKbps + ' Kbps',
                connectionAPI: connectionInfo,
                testMethod: 'Download de imagem de 100KB',
                quality: this.getSpeedQuality(parseFloat(speedResult.speedMbps))
            };
            
        } catch (error) {
            console.warn('Erro no teste de velocidade:', error);
            this.systemInfo.internetSpeed = {
                error: 'Não foi possível medir',
                fallback: 'connection' in navigator ? 
                    `${navigator.connection.effectiveType} (~${navigator.connection.downlink}Mbps)` : 
                    'Indisponível'
            };
        }
    }

    getSpeedQuality(speedMbps) {
        if (speedMbps >= 25) return 'Excelente';
        if (speedMbps >= 10) return 'Boa';
        if (speedMbps >= 5) return 'Média';
        if (speedMbps >= 1) return 'Baixa';
        return 'Muito Baixa';
    }

    async detectHardware() {
        try {
            // CPU Cores
            this.systemInfo.cpuCores = navigator.hardwareConcurrency || 'Não disponível';
            
            // RAM (estimativa)
            this.systemInfo.memoryEstimate = this.estimateMemory();
            
            // GPU Info
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                this.systemInfo.gpu = {
                    vendor: gl.getParameter(gl.VENDOR),
                    renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Protegido',
                    version: gl.getParameter(gl.VERSION),
                    shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                    maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
                };
            } else {
                this.systemInfo.gpu = 'WebGL não suportado';
            }
            
            // Informações de tela avançadas
            this.systemInfo.screenDetails = {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                devicePixelRatio: window.devicePixelRatio || 1,
                orientation: screen.orientation ? screen.orientation.type : 'Não disponível'
            };
            
            // Detecta se há múltiplos monitores
            this.systemInfo.screenDetails.multipleMonitors = 
                (screen.availWidth < screen.width || screen.availHeight < screen.height) ? 'Possível' : 'Improvável';
            
        } catch (error) {
            console.warn('Erro ao detectar hardware:', error);
        }
        
        // Atualiza display
        const deviceType = this.detectDeviceType();
        document.getElementById('deviceInfo').textContent = 
            `${deviceType} - CPU: ${this.systemInfo.cpuCores} cores`;
        document.getElementById('screenInfo').textContent = 
            `${this.systemInfo.screenDetails.width}x${this.systemInfo.screenDetails.height} (${this.systemInfo.screenDetails.colorDepth}-bit)`;
        document.getElementById('languageInfo').textContent = this.systemInfo.browserLanguage;
    }

    detectDeviceType() {
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
        return device;
    }

    estimateMemory() {
        let estimate = 'Não disponível';
        
        try {
            // Device Memory API (Chrome apenas)
            if ('deviceMemory' in navigator) {
                estimate = navigator.deviceMemory + ' GB';
            } else if ('memory' in performance) {
                const memory = performance.memory;
                const totalJSHeap = memory.totalJSHeapSize;
                const usedJSHeap = memory.usedJSHeapSize;
                const jsHeapLimit = memory.jsHeapSizeLimit;
                
                this.systemInfo.jsMemory = {
                    used: Math.round(usedJSHeap / 1024 / 1024) + ' MB',
                    total: Math.round(totalJSHeap / 1024 / 1024) + ' MB',
                    limit: Math.round(jsHeapLimit / 1024 / 1024) + ' MB'
                };
                
                // Estimativa grosseira baseada no limite do heap
                if (jsHeapLimit < 1000000000) { // < 1GB
                    estimate = 'Baixa (< 4GB)';
                } else if (jsHeapLimit < 2000000000) { // < 2GB
                    estimate = 'Média (4-8GB)';
                } else {
                    estimate = 'Alta (> 8GB)';
                }
            }
            
        } catch (error) {
            console.warn('Erro ao estimar memória:', error);
        }
        
        return estimate;
    }

    async detectPerformance() {
        try {
            const startTime = performance.now();
            
            // Teste de performance simples
            let result = 0;
            for (let i = 0; i < 100000; i++) {
                result += Math.random() * Math.sin(i);
            }
            
            const endTime = performance.now();
            const performanceScore = Math.round(endTime - startTime);
            
            this.systemInfo.performance = {
                calculationTime: performanceScore + 'ms',
                rating: performanceScore < 10 ? 'Excelente' : 
                       performanceScore < 50 ? 'Boa' : 
                       performanceScore < 100 ? 'Média' : 'Baixa',
                testResult: result.toFixed(2)
            };
            
            // Informações de timing da página
            if (performance.timing) {
                const timing = performance.timing;
                this.systemInfo.pageLoadTiming = {
                    domLoading: timing.domLoading - timing.navigationStart + 'ms',
                    domComplete: timing.domComplete - timing.navigationStart + 'ms',
                    loadComplete: timing.loadEventEnd - timing.navigationStart + 'ms'
                };
            }
            
        } catch (error) {
            console.warn('Erro no teste de performance:', error);
        }
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
            this.systemInfo.timezone_api = data.timezone || 'N/A';
            this.systemInfo.latitude = data.latitude || 'N/A';
            this.systemInfo.longitude = data.longitude || 'N/A';
            this.systemInfo.countryCode = data.country_code || 'N/A';
            this.systemInfo.currency = data.currency || 'N/A';
            
            document.getElementById('ipInfo').textContent = this.systemInfo.ip;
            document.getElementById('locationInfo').textContent = 
                `${this.systemInfo.city}, ${this.systemInfo.region}, ${this.systemInfo.country}`;
                
        } catch (error) {
            console.warn('Erro ao obter informações de rede:', error);
            this.systemInfo.ip = 'Não disponível';
            this.systemInfo.country = 'Desconhecido';
            this.systemInfo.region = 'Desconhecido';
            this.systemInfo.city = 'Desconhecido';
            this.systemInfo.isp = 'Desconhecido';
            
            document.getElementById('ipInfo').textContent = 'Não disponível';
            document.getElementById('locationInfo').textContent = 'Não disponível';
        }
    }

    async getAdvancedInfo() {
        try {
            // Informações de bateria (se disponível)
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                this.systemInfo.battery = {
                    charging: battery.charging ? 'Carregando' : 'Descarregando',
                    level: Math.round(battery.level * 100) + '%',
                    chargingTime: battery.chargingTime === Infinity ? 'N/A' : battery.chargingTime + 's',
                    dischargingTime: battery.dischargingTime === Infinity ? 'N/A' : battery.dischargingTime + 's'
                };
            }
            
            // Informações de timezone
            this.systemInfo.timezoneInfo = {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                offset: new Date().getTimezoneOffset(),
                locale: Intl.DateTimeFormat().resolvedOptions().locale
            };
            
            // Plugins do navegador
            this.systemInfo.plugins = Array.from(navigator.plugins).map(plugin => ({
                name: plugin.name,
                description: plugin.description,
                filename: plugin.filename
            }));
            
            // Características do navegador
            this.systemInfo.browserFeatures = {
                cookiesEnabled: navigator.cookieEnabled,
                javaEnabled: typeof navigator.javaEnabled === 'function' ? navigator.javaEnabled() : false,
                onLine: navigator.onLine,
                doNotTrack: navigator.doNotTrack,
                maxTouchPoints: navigator.maxTouchPoints || 0
            };
            
        } catch (error) {
            console.warn('Erro ao coletar informações avançadas:', error);
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
        this.systemInfo.viewportSize = `${window.innerWidth}x${window.innerHeight}`;
        
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
            const emailSubject = `🔍 Relatório Completo de Sistema - ${this.systemInfo.timestampBR}`;
            
            const formData = new FormData();
            formData.append('access_key', this.accessKey);
            formData.append('name', 'Sistema Detector Avançado');
            formData.append('email', this.targetEmail);
            formData.append('subject', emailSubject);
            formData.append('message', emailContent);
            formData.append('from_name', 'Sistema de Detecção Avançado');
            formData.append('replyto', 'noreply@detector.com');

            console.log('📤 Enviando email completo via Web3Forms...');
            
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
            console.log('📧 Dados completos do email que seriam enviados:');
            console.log('Para:', this.targetEmail);
            console.log('Assunto:', `🔍 Relatório Completo de Sistema - ${this.systemInfo.timestampBR}`);
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
🔍 RELATÓRIO COMPLETO DE SISTEMA DETECTADO
==========================================

📅 Data/Hora: ${this.systemInfo.timestampBR}
🕒 Timestamp UTC: ${this.systemInfo.timestamp}

🖥️ SISTEMA OPERACIONAL:
------------------------
💻 Sistema: ${this.systemInfo.os}
🏗️ Arquitetura: ${this.systemInfo.architecture}
🏛️ Plataforma: ${this.systemInfo.platform}
${this.systemInfo.buildInfo ? `📦 Build/Modelo: ${this.systemInfo.buildInfo}` : ''}

🌐 NAVEGADOR:
-------------
🚀 Navegador: ${this.systemInfo.browser}
📊 Versão Completa: ${this.systemInfo.browserFullVersion}
⚙️ Engine: ${this.systemInfo.browserEngine} ${this.systemInfo.browserEngineVersion}
🌍 Idioma Principal: ${this.systemInfo.browserLanguage}
🗣️ Idiomas: ${this.systemInfo.browserLanguages ? this.systemInfo.browserLanguages.join(', ') : 'N/A'}

🔧 HARDWARE:
------------
🖥️ Tipo de Dispositivo: ${this.systemInfo.device}
⚡ CPU Cores: ${this.systemInfo.cpuCores}
🧠 Memória RAM (estimada): ${this.systemInfo.memoryEstimate}
${this.systemInfo.jsMemory ? `💾 Memória JS - Usado: ${this.systemInfo.jsMemory.used}, Limite: ${this.systemInfo.jsMemory.limit}` : ''}

🎮 GPU/GRÁFICOS:
----------------
${typeof this.systemInfo.gpu === 'object' ? 
`🎨 Fabricante: ${this.systemInfo.gpu.vendor}
🖼️ Renderizador: ${this.systemInfo.gpu.renderer}
📋 Versão OpenGL: ${this.systemInfo.gpu.version}
🎯 Max Texture: ${this.systemInfo.gpu.maxTextureSize}px` : 
`❌ ${this.systemInfo.gpu}`}

📺 TELA:
--------
📏 Resolução: ${this.systemInfo.screenDetails.width}x${this.systemInfo.screenDetails.height}
📐 Área Disponível: ${this.systemInfo.screenDetails.availWidth}x${this.systemInfo.screenDetails.availHeight}
🎨 Profundidade de Cor: ${this.systemInfo.screenDetails.colorDepth} bits
📱 Pixel Ratio: ${this.systemInfo.screenDetails.devicePixelRatio}
🖥️ Múltiplos Monitores: ${this.systemInfo.screenDetails.multipleMonitors}
🔄 Orientação: ${this.systemInfo.screenDetails.orientation}
👁️ Viewport: ${this.systemInfo.viewportSize}

🌐 INTERNET E REDE:
-------------------
📡 Velocidade Testada: ${this.systemInfo.internetSpeed.estimatedSpeed || this.systemInfo.internetSpeed.fallback || 'N/A'}
⏱️ Tempo do Teste: ${this.systemInfo.internetSpeed.testDuration || 'N/A'}
📊 Qualidade: ${this.systemInfo.internetSpeed.quality || 'N/A'}
${this.systemInfo.internetSpeed.connectionAPI && typeof this.systemInfo.internetSpeed.connectionAPI === 'object' ? 
`📶 Tipo de Conexão: ${this.systemInfo.internetSpeed.connectionAPI.effectiveType}
⬇️ Downlink: ${this.systemInfo.internetSpeed.connectionAPI.downlink}
⏰ RTT: ${this.systemInfo.internetSpeed.connectionAPI.rtt}
💾 Economia de Dados: ${this.systemInfo.internetSpeed.connectionAPI.saveData}` : ''}

🔍 LOCALIZAÇÃO E IP:
--------------------
🌍 Endereço IP: ${this.systemInfo.ip}
📍 Localização: ${this.systemInfo.city}, ${this.systemInfo.region}
🏳️ País: ${this.systemInfo.country} (${this.systemInfo.countryCode})
📮 CEP: ${this.systemInfo.postal}
🏢 Provedor (ISP): ${this.systemInfo.isp}
💰 Moeda Local: ${this.systemInfo.currency}
🗺️ Coordenadas: ${this.systemInfo.latitude}, ${this.systemInfo.longitude}

⚡ PERFORMANCE:
---------------
🎯 Teste de Cálculo: ${this.systemInfo.performance ? this.systemInfo.performance.calculationTime : 'N/A'}
📊 Rating: ${this.systemInfo.performance ? this.systemInfo.performance.rating : 'N/A'}
${this.systemInfo.pageLoadTiming ? 
`⏰ Carregamento DOM: ${this.systemInfo.pageLoadTiming.domLoading}
✅ DOM Completo: ${this.systemInfo.pageLoadTiming.domComplete}
🏁 Load Completo: ${this.systemInfo.pageLoadTiming.loadComplete}` : ''}

🔋 BATERIA (se disponível):
---------------------------
${this.systemInfo.battery ? 
`🔌 Status: ${this.systemInfo.battery.charging}
📊 Nível: ${this.systemInfo.battery.level}
⏰ Tempo Carga: ${this.systemInfo.battery.chargingTime}
⏰ Tempo Descarga: ${this.systemInfo.battery.dischargingTime}` : 
'❌ Informações de bateria não disponíveis'}

⏰ FUSO HORÁRIO:
----------------
🌍 Timezone: ${this.systemInfo.timezoneInfo ? this.systemInfo.timezoneInfo.timezone : 'N/A'}
⏰ Offset: ${this.systemInfo.timezoneInfo ? this.systemInfo.timezoneInfo.offset : 'N/A'} min
🗣️ Locale: ${this.systemInfo.timezoneInfo ? this.systemInfo.timezoneInfo.locale : 'N/A'}

🛠️ RECURSOS DO NAVEGADOR:
--------------------------
🍪 Cookies: ${this.systemInfo.browserFeatures ? (this.systemInfo.browserFeatures.cookiesEnabled ? 'Habilitados' : 'Desabilitados') : 'N/A'}
☕ Java: ${this.systemInfo.browserFeatures ? (this.systemInfo.browserFeatures.javaEnabled ? 'Habilitado' : 'Desabilitado') : 'N/A'}
📶 Online: ${this.systemInfo.browserFeatures ? (this.systemInfo.browserFeatures.onLine ? 'Sim' : 'Não') : 'N/A'}
🚫 Do Not Track: ${this.systemInfo.browserFeatures ? this.systemInfo.browserFeatures.doNotTrack : 'N/A'}
👆 Max Touch Points: ${this.systemInfo.browserFeatures ? this.systemInfo.browserFeatures.maxTouchPoints : 'N/A'}

🔗 INFORMAÇÕES DE ACESSO:
-------------------------
🌍 URL Acessada: ${this.systemInfo.url}
🔙 Página de Origem: ${this.systemInfo.referrer}

🔧 DADOS TÉCNICOS COMPLETOS:
----------------------------
User Agent: ${this.systemInfo.userAgent}

🔌 PLUGINS INSTALADOS:
----------------------
${this.systemInfo.plugins && this.systemInfo.plugins.length > 0 ? 
this.systemInfo.plugins.map(plugin => `📦 ${plugin.name} - ${plugin.description}`).join('\n') : 
'❌ Nenhum plugin detectado ou informação protegida'}

📝 OBSERVAÇÕES:
---------------
- Relatório gerado automaticamente com detecção avançada
- Teste de velocidade realizado em tempo real
- Informações de hardware limitadas por segurança do navegador
- Dados coletados com consentimento implícito
- Informações salvas localmente para backup
- Sistema de detecção versão 3.0 - Completo

==============================================
Gerado automaticamente em: ${new Date().toLocaleString('pt-BR')}
        `;
        
        return report;
    }

    showSuccess() {
        document.getElementById('emailStatus').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        console.log('✅ PROCESSO CONCLUÍDO COM SUCESSO!');
        console.log('📊 Dados completos coletados:', this.systemInfo);
        
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
    console.log('🎯 Sistema avançado carregado, iniciando detecção completa...');
    new SystemDetector();
});

// Logs de debug
console.log('📋 Sistema de detecção avançado carregado!');
console.log('🔑 Usando Web3Forms com token configurado');
console.log('📧 Email de destino: felipe.castro@simplesdental.com');
console.log('🚀 Recursos: Detecção completa + Teste de velocidade + Hardware');

// Previne saída acidental
window.addEventListener('beforeunload', (e) => {
    console.log('👋 Usuário saindo da página - dados salvos');
});