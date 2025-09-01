// URL base da API
const API_BASE = 'http://localhost:3000/api';

// Gerenciamento de autenticação e usuários
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Verificar se há usuário logado
    const currentUser = getCurrentUser();
    updateUIForAuthState(!!currentUser);
    
    // Configurar event listeners para os modais
    setupAuthModals();
}

function getCurrentUser() {
    const token = localStorage.getItem('superfood_token');
    const user = localStorage.getItem('superfood_user');
    
    if (token && user) {
        return JSON.parse(user);
    }
    return null;
}

function setCurrentUser(user, token) {
    localStorage.setItem('superfood_token', token);
    localStorage.setItem('superfood_user', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('superfood_token');
    localStorage.removeItem('superfood_user');
}

function getAuthToken() {
    return localStorage.getItem('superfood_token');
}

function setupAuthModals() {
    // Elementos dos modais
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Abrir modais
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'flex';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            if (registerModal) registerModal.style.display = 'flex';
        });
    }
    
    if (showRegister) {
        showRegister.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'flex';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', () => {
            if (registerModal) registerModal.style.display = 'none';
            if (loginModal) loginModal.style.display = 'flex';
        });
    }
    
    // Fechar modais
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'none';
        });
    });
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            if (loginModal) loginModal.style.display = 'none';
        }
        if (event.target === registerModal) {
            if (registerModal) registerModal.style.display = 'none';
        }
    });
    
    // Submissão de formulários
    const loginSubmit = document.getElementById('loginSubmit');
    const registerSubmit = document.getElementById('registerSubmit');
    
    if (loginSubmit) {
        loginSubmit.addEventListener('click', login);
    }
    
    if (registerSubmit) {
        registerSubmit.addEventListener('click', register);
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // CTA da home
    const heroCta = document.getElementById('heroCta');
    if (heroCta) {
        heroCta.addEventListener('click', () => {
            const currentUser = getCurrentUser();
            if (currentUser) {
                window.location.href = 'historico.html';
            } else {
                if (registerModal) registerModal.style.display = 'flex';
            }
        });
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setCurrentUser(data.user, data.token);
            updateUIForAuthState(true);
            document.getElementById('loginModal').style.display = 'none';
            alert('Login realizado com sucesso!');
            
            // Redirecionar se estiver na página inicial
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                window.location.href = 'historico.html';
            }
        } else {
            alert(data.error || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setCurrentUser(data.user, data.token);
            updateUIForAuthState(true);
            document.getElementById('registerModal').style.display = 'none';
            alert('Cadastro realizado com sucesso!');
            
            // Redirecionar para a página de histórico
            window.location.href = 'historico.html';
        } else {
            alert(data.error || 'Erro ao cadastrar');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

function logout() {
    clearCurrentUser();
    updateUIForAuthState(false);
    alert('Logout realizado com sucesso!');
    
    // Redirecionar para a página inicial
    window.location.href = 'index.html';
}

function updateUIForAuthState(isLoggedIn) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (isLoggedIn) {
        const currentUser = getCurrentUser();
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userName && currentUser) userName.textContent = currentUser.name;
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (userMenu) userMenu.style.display = 'none';
    }
}