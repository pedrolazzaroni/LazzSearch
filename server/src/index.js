const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

// Configuração
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Armazena produtos temporariamente
const products = [];

// Rota de status para verificar se o servidor está funcionando
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', time: new Date().toISOString() });
});

// Rota para pesquisar produtos
app.get('/api/products/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Termo de busca é obrigatório' });
    }
    console.log(`Pesquisando por: ${query}`);
    const results = await simulateGoogleResults(query);
    res.json(results);
  } catch (error) {
    console.error('Erro na busca de produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
});

// Função para simular resultados de pesquisa
async function simulateGoogleResults(query) {
  const storeDistribution = ["Amazon", "Magazine Luiza", "Mercado Livre", "Americanas", "Casas Bahia"];
  const results = [];
  for (let i = 0; i < 12; i++) {
    const randomStore = storeDistribution[Math.floor(Math.random() * storeDistribution.length)];
    const randomPrice = (Math.random() * 2000 + 500).toFixed(2);
    const randomRating = (Math.random() * 2 + 3).toFixed(1);
    const randomReviews = Math.floor(Math.random() * 900) + 100;
    const product = {
      id: uuidv4(),
      name: `${query} ${["Premium", "Ultra", "Pro", "Max", "Plus", "Lite"][Math.floor(Math.random() * 6)]}`,
      description: `Este produto ${query} é de excelente qualidade e possui ótimo custo-benefício.`,
      price: parseFloat(randomPrice),
      imageUrl: `https://source.unsplash.com/200x200/?${encodeURIComponent(query.replace(/\s+/g, ','))}`,
      store: randomStore,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      rating: parseFloat(randomRating),
      reviews: randomReviews,
      available: true,
      searchScore: Math.random() * 100
    };
    results.push(product);
    products.push(product);
  }
  return results.sort((a, b) => b.searchScore - a.searchScore);
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}: http://localhost:${PORT}/api/status`);
});
