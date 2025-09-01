// URL base da API
const API_BASE = 'http://localhost:3000/api';

// Gerenciamento de receitas
document.addEventListener('DOMContentLoaded', function() {
    initializeRecipes();
});

async function initializeRecipes() {
    await loadRecipes();
    setupFilterButtons();
}

async function loadRecipes() {
    try {
        const response = await fetch(`${API_BASE}/recipes`);
        const recipes = await response.json();
        
        if (response.ok) {
            displayRecipes(recipes);
        } else {
            console.error('Erro ao carregar receitas');
        }
    } catch (error) {
        console.error('Erro:', error);
        // Fallback para receitas locais se a API falhar
        displayRecipes(getSampleRecipes());
    }
}

function getSampleRecipes() {
    return [
        {
            id: 1,
            title: "Salmão Grelhado com Legumes",
            description: "Uma refeição clássica, balanceada, rica em ômega-3 e vitaminas para manter a saúde em dia.",
            ingredients: [
                "1 posta de salmão (150g)",
                "1/2 brócolis em floretes",
                "1 cenoura em rodelas",
                "Azeite de oliva, sal, pimenta e ervas finas a gosto"
            ],
            category: "high-protein"
        },
        {
            id: 2,
            title: "Frango com Batata Doce Assada",
            description: "A combinação perfeita de proteína magra e carboidrato complexo para energia e saciedade.",
            ingredients: [
                "1 filé de frango (150g)",
                "1 batata doce média",
                "Páprica doce, alho, sal e pimenta a gosto",
                "Azeite de oliva"
            ],
            category: "high-protein"
        }
    ];
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        recipeCard.innerHTML = `
            <div class="recipe-img">🍽️ Imagem da Receita</div>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-ingredients">
                    <h4>Ingredientes:</h4>
                    <ul>
                        ${recipe.ingredients.split('\n').map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                <span class="recipe-category">${getCategoryName(recipe.category)}</span>
            </div>
        `;
        
        container.appendChild(recipeCard);
    });
}

function getCategoryName(category) {
    const categories = {
        'all': 'Todas',
        'low-cal': 'Baixas Calorias',
        'high-protein': 'Proteínas',
        'veggie': 'Vegetariana'
    };
    
    return categories[category] || 'Outra';
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            
            // Filtrar receitas
            const category = button.getAttribute('data-category');
            filterRecipes(category);
        });
    });
}

async function filterRecipes(category) {
    if (category === 'all') {
        await loadRecipes();
    } else {
        try {
            const response = await fetch(`${API_BASE}/recipes/${category}`);
            const recipes = await response.json();
            
            if (response.ok) {
                displayRecipes(recipes);
            } else {
                console.error('Erro ao filtrar receitas');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
}