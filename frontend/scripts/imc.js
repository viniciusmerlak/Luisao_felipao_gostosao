// URL base da API
const API_BASE = 'http://localhost:3000/api';

// Gerenciamento do cálculo de IMC
document.addEventListener('DOMContentLoaded', function() {
    initializeImcCalculator();
});

function initializeImcCalculator() {
    // Configurar evento para o botão de cálculo de IMC na página de histórico
    const calculateImcBtn = document.getElementById('calculateImcBtn');
    if (calculateImcBtn) {
        calculateImcBtn.addEventListener('click', () => {
            openImcModal();
        });
    }
    
    // Configurar evento para o cálculo de IMC no modal
    const calculateImcSubmit = document.getElementById('calculateImcSubmit');
    if (calculateImcSubmit) {
        calculateImcSubmit.addEventListener('click', calculateIMC);
    }
}

function openImcModal() {
    const imcModal = document.getElementById('imcModal');
    if (imcModal) {
        imcModal.style.display = 'flex';
        
        // Limpar campos ao abrir o modal
        document.getElementById('imcWeight').value = '';
        document.getElementById('imcHeight').value = '';
        const resultElement = document.getElementById('imcResult');
        if (resultElement) {
            resultElement.textContent = '';
            resultElement.className = 'imc-result';
        }
    }
}

async function calculateIMC() {
    const weight = parseFloat(document.getElementById('imcWeight').value);
    const height = parseFloat(document.getElementById('imcHeight').value);
    const currentUser = JSON.parse(localStorage.getItem('superfood_user'));
    
    if (!weight || !height) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    if (!currentUser) {
        alert('Você precisa estar logado para calcular o IMC');
        return;
    }
    
    try {
        const token = localStorage.getItem('superfood_token');
        const response = await fetch(`${API_BASE}/imc/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                userId: currentUser.id, 
                weight, 
                height 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const resultElement = document.getElementById('imcResult');
            if (resultElement) {
                resultElement.textContent = `Seu IMC: ${data.imc} - ${data.classification}`;
                
                // Adicionar classe baseada na classificação
                resultElement.className = 'imc-result';
                if (data.classification.includes('Abaixo')) {
                    resultElement.classList.add('below');
                } else if (data.classification.includes('Peso normal')) {
                    resultElement.classList.add('normal');
                } else {
                    resultElement.classList.add('above');
                }
            }
            
            alert('IMC calculado e salvo com sucesso!');
            
            // Recarregar a página de histórico se estivermos nela
            if (window.location.pathname.endsWith('historico.html')) {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } else {
            alert(data.error || 'Erro ao calcular IMC');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}