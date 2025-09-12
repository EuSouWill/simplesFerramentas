// Sistema de Menu Centralizado
class MenuManager {
    constructor() {
        this.menuItems = [
            {
                href: "/index.html",
                icon: "fas fa-home",
                text: "Home",
                id: "home"
            },
            {
                href: "/front-end/html/verificador.html",
                icon: "fas fa-search",
                text: "Verificador de Dados",
                id: "verificador"
            },
            {
                href: "/front-end/html/upgrade.html",
                icon: "fas fa-calendar-alt",
                text: "Calculadora Upgrade Anual",
                id: "upgrade"
            },
            {
                href: "/front-end/html/calculadora.html",
                icon: "fas fa-calculator",
                text: "Calculadora de Juros",
                id: "calculadora"
            },
            {
                href: "/front-end/html/pagarmeExtrato.html",
                icon: "fas fa-file-invoice-dollar",
                text: "Extrato Pagarme",
                id: "extrato"
            },
            {
                href: "/front-end/html/juros_parcela.html",
                icon: "fas fa-percentage",
                text: "Juros de Parcela",
                id: "juros_parcela"
            },
            {
                href: "/front-end/html/sugestoes.html",
                icon: "fas fa-lightbulb",
                text: "Sugestão de Melhoria",
                id: "sugestoes"
            }
        ];
    }

    // Gerar HTML do menu
    generateMenuHTML() {
        return `
            <nav class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <h3>Menu</h3>
                    <button class="sidebar-toggle" onclick="toggleSidebar()">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
                <ul class="sidebar-menu">
                    ${this.menuItems.map(item => `
                        <li>
                            <a href="${item.href}" class="menu-item" data-page="${item.id}">
                                <i class="${item.icon}"></i>
                                <span class="menu-text">${item.text}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
                <div class="sidebar-footer">
                    <p>&copy; 2024 Simples Dental</p>
                </div>
            </nav>
        `;
    }

    // Inicializar o menu
    init() {
        // Procurar por container do menu ou criar um
        let menuContainer = document.querySelector('.menu-container');
        if (!menuContainer) {
            // Se não existe container, criar um no início do body
            menuContainer = document.createElement('div');
            menuContainer.className = 'menu-container';
            document.body.insertBefore(menuContainer, document.body.firstChild);
        }

        // Inserir o menu
        menuContainer.innerHTML = this.generateMenuHTML();

        // Adicionar classe ao body para ajustar layout
        document.body.classList.add('has-sidebar');

        // Marcar item ativo
        this.setActiveMenuItem();

        // Adicionar event listeners
        this.addEventListeners();
    }

    // Marcar item do menu como ativo baseado na URL atual
    setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (currentPath === href || (currentPath === '/' && href === '/index.html')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Adicionar event listeners
    addEventListeners() {
        // Smooth transitions
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });
    }

    // Adicionar novo item ao menu (para futuras expansões)
    addMenuItem(item) {
        this.menuItems.push(item);
        this.init(); // Re-inicializar
    }

    // Remover item do menu
    removeMenuItem(id) {
        this.menuItems = this.menuItems.filter(item => item.id !== id);
        this.init(); // Re-inicializar
    }
}

// Função para toggle do sidebar (mobile)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    
    sidebar.classList.toggle('collapsed');
    body.classList.toggle('sidebar-collapsed');
}

// Função para fechar sidebar em mobile quando clicar em um link
function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const body = document.body;
        
        sidebar.classList.add('collapsed');
        body.classList.add('sidebar-collapsed');
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const menuManager = new MenuManager();
    menuManager.init();
    
    // Fechar sidebar em mobile quando clicar nos links
    document.querySelectorAll('.menu-item').forEach(link => {
        link.addEventListener('click', closeSidebarOnMobile);
    });
    
    // Fechar sidebar quando redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const sidebar = document.getElementById('sidebar');
            const body = document.body;
            
            sidebar.classList.remove('collapsed');
            body.classList.remove('sidebar-collapsed');
        }
    });
});

// Tornar MenuManager global para uso em outras partes do código
window.MenuManager = MenuManager;