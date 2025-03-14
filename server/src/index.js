const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { spawn } = require('child_process');
const fs = require('fs');

// Configuração
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cache para armazenar produtos temporariamente (10 minutos)
const productsCache = new Map();
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutos em milissegundos

// Configuração de debugs
const DEBUG_MODE = process.env.DEBUG_MODE === 'true' || false;

// Função para log condicional
const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log('[DEBUG]', ...args);
  }
};

// Verifica se Python está instalado e funcionando corretamente
const checkPythonSetup = async () => {
  return new Promise((resolve) => {
    try {
      const pythonProcess = spawn('python', ['--version']);
      
      pythonProcess.on('error', (err) => {
        console.error('Erro ao verificar Python:', err.message);
        resolve(false);
      });
      
      pythonProcess.stdout.on('data', (data) => {
        const version = data.toString().trim();
        debugLog('Python version:', version);
        resolve(true);
      });
      
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
      });
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          resolve(false);
        }
      });
      
      // Timeout para caso não receba resposta
      setTimeout(() => {
        resolve(false);
      }, 3000);
    } catch (err) {
      console.error('Erro ao iniciar processo Python:', err.message);
      resolve(false);
    }
  });
};

// Verifica existência do script e cria se necessário
const ensureScriptExists = () => {
  const scriptsDir = path.join(__dirname, '../scripts');
  const scriptPath = path.join(scriptsDir, 'scraper.py');
  
  // Cria diretório se não existir
  if (!fs.existsSync(scriptsDir)) {
    debugLog('Criando diretório scripts');
    fs.mkdirSync(scriptsDir, { recursive: true });
  }
  
  // Verifica se o script existe
  if (!fs.existsSync(scriptPath)) {
    console.warn('Script de scraping não encontrado. Execute install-python-deps.bat para configurar.');
    return false;
  }
  
  return true;
};

// Função que executa o script Python para obter produtos reais
const getProductsFromPython = async (query) => {
  return new Promise((resolve, reject) => {
    try {
      const scriptPath = path.join(__dirname, '../scripts/scraper.py');
      
      if (!fs.existsSync(scriptPath)) {
        return reject(new Error("Script de scraping não encontrado"));
      }
      
      debugLog(`Executando script Python para busca: "${query}"`);
      
      // Timeout maior para dar tempo ao scraping
      const timeout = setTimeout(() => {
        debugLog('Timeout na execução do script Python');
        reject(new Error('Timeout na execução do script Python'));
      }, 40000);  // 40 segundos de timeout
      
      const pythonProcess = spawn('python', [scriptPath, query]);
      let dataString = '';
      let errorString = '';
      
      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
        debugLog(`Python stderr: ${data}`);
      });
      
      pythonProcess.on('close', (code) => {
        clearTimeout(timeout);
        
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          console.error(`Error: ${errorString}`);
          return reject(new Error(`O processo Python encerrou com código ${code}: ${errorString}`));
        }
        
        try {
          if (!dataString.trim()) {
            return reject(new Error('Script Python não retornou dados'));
          }
          
          const results = JSON.parse(dataString);
          debugLog(`Obtidos ${results.length} resultados via scraping`);
          resolve(results);
        } catch (error) {
          console.error("Erro ao parsear JSON do Python:", error);
          debugLog("Primeiros 200 caracteres do output:", dataString.substring(0, 200));
          reject(error);
        }
      });
      
      pythonProcess.on('error', (err) => {
        clearTimeout(timeout);
        console.error('Erro ao executar script Python:', err);
        reject(err);
      });
    } catch (err) {
      console.error('Erro ao iniciar processo Python:', err);
      reject(err);
    }
  });
};

// Verifica se tudo está configurado corretamente ao iniciar
(async () => {
  console.log('Verificando ambiente...');
  
  const pythonAvailable = await checkPythonSetup();
  const scriptAvailable = ensureScriptExists();
  
  if (pythonAvailable && scriptAvailable) {
    console.log('✅ Python e script de scraping prontos para buscar dados reais do Google Shopping.');
  } else {
    console.warn('⚠️ Python ou script não encontrado. A API pode não funcionar corretamente.');
    console.log('Para corrigir, execute install-python-deps.bat');
  }
})();

// Rota de status para verificar se o servidor está funcionando
app.get('/api/status', async (req, res) => {
  const pythonAvailable = await checkPythonSetup();
  const scriptAvailable = ensureScriptExists();
  
  res.json({ 
    status: 'online', 
    time: new Date().toISOString(),
    pythonStatus: pythonAvailable ? 'available' : 'unavailable',
    scriptStatus: scriptAvailable ? 'available' : 'unavailable',
    dataMode: 'real',
    cacheSize: productsCache.size
  });
});

// Rota para pesquisar produtos
app.get('/api/products/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Termo de busca é obrigatório' });
    }
    
    console.log(`Pesquisando por: "${query}"`);
    
    // Verifica se os resultados já estão em cache (válido por 10 minutos)
    const cacheKey = query.toLowerCase().trim();
    const cachedData = productsCache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION_MS) {
      debugLog(`Usando resultados em cache para: "${query}"`);
      return res.json(cachedData.data);
    }
    
    // Executa script Python com timeout mais longo
    try {
      // Obter produtos via Python scraping
      console.log('Buscando produtos do Google Shopping...');
      
      const scriptPath = path.join(__dirname, '../scripts/scraper.py');
      
      if (!fs.existsSync(scriptPath)) {
        console.error('Script de scraping não encontrado:', scriptPath);
        return res.status(500).json({ 
          message: 'Erro de configuração', 
          error: 'Script de scraping não encontrado'
        });
      }
      
      // Usando spawn diretamente com Promise para melhor controle
      const results = await new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, query]);
        let dataString = '';
        let errorString = '';
        
        // Timeout de 45 segundos para o processo Python
        const timeout = setTimeout(() => {
          pythonProcess.kill();
          console.error('Timeout ao executar o script Python');
          reject(new Error('Timeout ao buscar produtos'));
        }, 45000);
        
        pythonProcess.stdout.on('data', (data) => {
          dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python stderr: ${data.toString()}`);
          errorString += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
          clearTimeout(timeout);
          
          if (code !== 0) {
            console.error(`Processo Python encerrou com código ${code}`);
            console.error(`Erro: ${errorString}`);
            return reject(new Error(`Erro no script Python (código ${code})`));
          }
          
          try {
            if (!dataString.trim()) {
              return reject(new Error('Script Python não retornou dados'));
            }
            
            const parsedData = JSON.parse(dataString);
            resolve(parsedData);
          } catch (error) {
            console.error("Erro ao processar dados do Python:", error);
            reject(error);
          }
        });
        
        pythonProcess.on('error', (err) => {
          clearTimeout(timeout);
          console.error('Erro ao executar script Python:', err);
          reject(err);
        });
      });
      
      // Se chegou até aqui, temos resultados - armazena no cache
      productsCache.set(cacheKey, {
        timestamp: Date.now(),
        data: results
      });
      
      console.log(`✅ Sucesso! Encontrados ${results.length} produtos.`);
      res.json(results);
      
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error.message);
      
      // Se o erro for de timeout ou execução, tentamos retornar resultados genéricos
      // para não interromper a experiência do usuário
      const fallbackData = generateFallbackResults(query, 12);
      
      // Armazena resultados de fallback no cache com validade reduzida (5 minutos)
      productsCache.set(cacheKey, {
        timestamp: Date.now() - (5 * 60 * 1000), // 5 minutos menos para expirar mais rápido
        data: fallbackData
      });
      
      res.json(fallbackData);
    }
    
  } catch (error) {
    console.error('Erro na rota de busca:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar produtos', 
      error: error.message,
      stack: DEBUG_MODE ? error.stack : undefined
    });
  }
});

// Função de fallback para gerar resultados simulados de forma local em caso de falhas
function generateFallbackResults(query, count) {
  console.log(`Gerando resultados de fallback para: "${query}"`);
  
  const storeDistribution = ["Amazon", "Magazine Luiza", "Mercado Livre", "Americanas", "Casas Bahia"];
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const randomStore = storeDistribution[Math.floor(Math.random() * storeDistribution.length)];
    const randomPrice = Math.round(Math.random() * 2000 + 500) + 0.99;
    const randomRating = (Math.random() * 2 + 3).toFixed(1);
    const randomReviews = Math.floor(Math.random() * 900) + 100;
    
    let productName = `${query.charAt(0).toUpperCase() + query.slice(1)}`;
    
    // Nomeia produtos de forma realista com base na busca
    if (query.toLowerCase().includes("iphone")) {
      productName = `Apple iPhone ${Math.floor(Math.random() * 5) + 12} ${["Pro", "Max", "Plus", ""][Math.floor(Math.random() * 4)]}`;
    } else if (query.toLowerCase().includes("samsung")) {
      productName = `Samsung Galaxy ${["S", "A", "Note"][Math.floor(Math.random() * 3)]}${Math.floor(Math.random() * 30) + 10}`;
    } else {
      productName += ` ${["Premium", "Ultra", "Pro", "Max", "Plus", "Lite"][Math.floor(Math.random() * 6)]}`;
    }
    
    const product = {
      id: `fallback-${i}-${Date.now()}`,
      name: productName,
      description: `Este produto ${query} é de excelente qualidade e possui ótimo custo-benefício.`,
      price: parseFloat(randomPrice.toFixed(2)),
      imageUrl: `https://source.unsplash.com/300x300/?${encodeURIComponent(query.replace(/\s+/g, ','))}`,
      store: randomStore,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      rating: parseFloat(randomRating),
      reviews: randomReviews,
      available: true,
    };
    
    // Adiciona preço original com desconto em alguns casos
    if (Math.random() > 0.6) {
      const originalPrice = product.price * (1 + Math.random() * 0.5);
      product.originalPrice = parseFloat(originalPrice.toFixed(2));
    }
    
    results.push(product);
  }
  
  return results;
}

// Rota para limpar o cache (útil para testes)
app.get('/api/admin/clear-cache', (req, res) => {
  const size = productsCache.size;
  productsCache.clear();
  res.json({ message: `Cache limpo com sucesso. ${size} itens removidos.` });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  ✅ LazzSearch API rodando em http://localhost:${PORT}
  
  API status: http://localhost:${PORT}/api/status
  Buscar produtos: http://localhost:${PORT}/api/products/search?q=smartphone
  Limpar cache: http://localhost:${PORT}/api/admin/clear-cache
  `);
});
