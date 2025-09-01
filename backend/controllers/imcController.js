exports.calcularIMC = (req, res) => {
    try {
        const { peso, altura } = req.body;
        
        if (!peso || !altura) {
            return res.status(400).json({ error: 'Peso e altura são obrigatórios' });
        }
        
        const alturaMetros = altura / 100;
        const imc = peso / (alturaMetros * alturaMetros);
        
        res.json({ imc: imc.toFixed(2) });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao calcular IMC' });
    }
};