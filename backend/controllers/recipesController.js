exports.getRecipes = (req, res) => {
    try {
        // Sua lógica para buscar receitas
        res.json([{ name: 'Receita Exemplo' }]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};