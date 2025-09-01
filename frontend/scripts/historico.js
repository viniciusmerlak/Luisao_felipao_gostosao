// URL base da API
const API_BASE = 'http://localhost:3000/api';

// Gerenciamento do histórico
document.addEventListener('DOMContentLoaded', function() {
    initializeHistory();
});

function initializeHistory() {
    checkAuthentication();
    loadHistory();
    setupImcModal();
}

function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('superfood_user'));
    if (!currentUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'index.html';
        return;
    }
}

async function loadHistory() {
    const currentUser = JSON.parse(localStorage.getItem('superfood_user'));
    
    if (!currentUser) return;
    
    try {
        const token = localStorage.getItem('superfood_token');
        const response = await fetch(`${API_BASE}/imc/history?userId=${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayHistoryTable(data);
            updateStats(data);
            renderProgressChart(data);
        } else {
            console.error('Erro ao carregar histórico:', data.error);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

function displayHistoryTable(history) {
    const tableBody = document.getElementById('historyTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (history.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum registro de IMC encontrado</td></tr>';
        return;
    }
    
    // Ordenar por data (mais recente primeiro)
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    history.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(entry.date).toLocaleDateString('pt-BR')}</td>
            <td>${entry.weight}</td>
            <td>${entry.height}</td>
            <td>${entry.imc.toFixed(2)}</td>
            <td>${entry.classification}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateStats(history) {
    const firstMeasurement = document.getElementById('firstMeasurement');
    const lastMeasurement = document.getElementById('lastMeasurement');
    const evolutionStatus = document.getElementById('evolutionStatus');
    
    if (history.length === 0) {
        if (firstMeasurement) firstMeasurement.textContent = '-';
        if (lastMeasurement) lastMeasurement.textContent = '-';
        if (evolutionStatus) evolutionStatus.textContent = '-';
        return;
    }
    
    // Ordenar por data (mais antiga primeiro)
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (firstMeasurement) {
        firstMeasurement.textContent = `${sortedHistory[0].imc.toFixed(2)} (${new Date(sortedHistory[0].date).toLocaleDateString('pt-BR')})`;
    }
    
    if (lastMeasurement) {
        lastMeasurement.textContent = `${sortedHistory[sortedHistory.length - 1].imc.toFixed(2)} (${new Date(sortedHistory[sortedHistory.length - 1].date).toLocaleDateString('pt-BR')})`;
    }
    
    // Calcular evolução
    if (evolutionStatus && sortedHistory.length > 1) {
        const firstImc = sortedHistory[0].imc;
        const lastImc = sortedHistory[sortedHistory.length - 1].imc;
        const difference = lastImc - firstImc;
        
        if (difference === 0) {
            evolutionStatus.textContent = 'Estável';
            evolutionStatus.style.color = '#FF9800';
        } else if (difference > 0) {
            evolutionStatus.textContent = `+${difference.toFixed(2)}`;
            evolutionStatus.style.color = '#F44336';
        } else {
            evolutionStatus.textContent = `${difference.toFixed(2)}`;
            evolutionStatus.style.color = '#4CAF50';
        }
    }
}

function renderProgressChart(history) {
    const canvas = document.getElementById('progressChart');
    if (!canvas || history.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    
    // Ordenar por data (mais antiga primeiro)
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dates = sortedHistory.map(entry => new Date(entry.date).toLocaleDateString('pt-BR'));
    const imcValues = sortedHistory.map(entry => entry.imc);
    
    // Criar o gráfico
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Evolução do IMC',
                data: imcValues,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'IMC'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data'
                    }
                }
            }
        }
    });
}

function setupImcModal() {
    const imcModal = document.getElementById('imcModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Fechar modal
    if (closeModalButtons) {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (imcModal) {
                    imcModal.style.display = 'none';
                }
            });
        });
    }
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === imcModal) {
            imcModal.style.display = 'none';
        }
    });
}