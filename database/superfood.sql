CREATE DATABASE IF NOT EXISTS superfood;
USE superfood;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE imc_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  height DECIMAL(3,2) NOT NULL,
  imc DECIMAL(4,2) NOT NULL,
  classification VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  category VARCHAR(50) NOT NULL
);

-- Inserir algumas receitas de exemplo
INSERT INTO recipes (title, description, ingredients, category) VALUES
('Salmão Grelhado com Legumes', 'Uma refeição clássica, balanceada, rica em ômega-3 e vitaminas para manter a saúde em dia.', '1 posta de salmão (150g)\n1/2 brócolis em floretes\n1 cenoura em rodelas\nAzeite de oliva, sal, pimenta e ervas finas a gosto', 'high-protein'),
('Frango com Batata Doce Assada', 'A combinação perfeita de proteína magra e carboidrato complexo para energia e saciedade.', '1 filé de frango (150g)\n1 batata doce média\nPáprica doce, alho, sal e pimenta a gosto\nAzeite de oliva', 'high-protein'),
('Peixe Assado com Batatas e Ervas', 'Uma refeição leve, saborosa e completa. O peixe fornece ômega-3, e as batatas, a energia na medida certa.', '1 posta de peixe branco (tilápia, merluza)\n2 batatas pequenas em rodelas finas\nTomate cereja a gosto\nRamos de alecrim e tomilho', 'low-cal'),
('Salada de Quinoa com Vegetais', 'Uma opção leve e nutritiva, rica em proteínas vegetais e fibras.', '1 xícara de quinoa cozida\n1 pepino picado\n1 tomate picado\n1/4 de cebola roxa fatiada\nSuco de limão, azeite e ervas a gosto', 'veggie'),
('Smoothie Verde Energético', 'Bebida nutritiva e refrescante, perfeita para começar o dia com disposição.', '1 banana congelada\n1 xícara de espinafre fresco\n200ml de leite vegetal\n1 colher de sopa de semente de chia\n1 colher de chá de mel (opcional)', 'low-cal'),
('Lentilha com Legumes', 'Prato vegetariano rico em proteínas e fibras, ideal para uma refeição completa.', '1 xícara de lentilha cozida\n1 cenoura picada\n1 batata picada\n1/2 xícara de abóbora em cubos\nTemperos a gosto: cúrcuma, cominho, alho', 'veggie');