/**
 * Configurações globais do aplicativo LazzSearch
 */
const config = {
  // API URLs
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    endpoints: {
      search: '/api/products/search',
      status: '/api/status',
      clearCache: '/api/admin/clear-cache'
    }
  },
  
  // Configurações de interface
  ui: {
    // Número de produtos por página
    productsPerPage: 20,
    
    // Categorias populares para sugestões
    popularCategories: [
      'smartphone',
      'notebook',
      'tv 4k',
      'headphone',
      'geladeira'
    ],
    
    // Configurações de imagem
    images: {
      fallbackSize: '400x400',
      placeholderColor: 'FF5500'
    }
  },
  
  // Configurações de features
  features: {
    // Habilita salvamento de favoritos localmente
    enableFavorites: true,
    
    // Habilita histórico de busca
    enableSearchHistory: true,
    
    // Habilita ferramentas de dev (com triplo clique no logo)
    enableDevTools: true,
    
    // Tempo de cache das pesquisas (em minutos)
    cacheTime: 30
  }
};

export default config;
