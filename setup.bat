@echo off
echo === Configurando LazzSearch ===

echo.
echo === Verificando Node.js e npm ===
node -v
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js não encontrado! Por favor instale Node.js antes de continuar.
    pause
    exit /b
)
echo Node.js encontrado.
echo.

echo === Instalando dependências do servidor ===
if not exist server mkdir server
if not exist server\src mkdir server\src

echo Copiando arquivo de backend para server\src\index.js...
echo const express = require('express');>server\src\index.js
echo const cors = require('cors');>>server\src\index.js
echo const path = require('path');>>server\src\index.js
echo const dotenv = require('dotenv');>>server\src\index.js
echo const { v4: uuidv4 } = require('uuid');>>server\src\index.js
echo.>>server\src\index.js
echo // Configuração>>server\src\index.js
echo dotenv.config();>>server\src\index.js
echo const app = express();>>server\src\index.js
echo const PORT = process.env.PORT ^|^| 5000;>>server\src\index.js
echo.>>server\src\index.js
echo // Middleware>>server\src\index.js
echo app.use(cors());>>server\src\index.js
echo app.use(express.json());>>server\src\index.js
echo.>>server\src\index.js
echo // Armazena produtos temporariamente>>server\src\index.js
echo const products = [];>>server\src\index.js
echo.>>server\src\index.js
echo // Rota de status para verificar se o servidor está funcionando>>server\src\index.js
echo app.get('/api/status', (req, res) =^> {>>server\src\index.js
echo   res.json({ status: 'online', time: new Date().toISOString() });>>server\src\index.js
echo });>>server\src\index.js
echo.>>server\src\index.js
echo // Rota para pesquisar produtos>>server\src\index.js
echo app.get('/api/products/search', async (req, res) =^> {>>server\src\index.js
echo   try {>>server\src\index.js
echo     const { q: query } = req.query;>>server\src\index.js
echo     if (!query) {>>server\src\index.js
echo       return res.status(400).json({ message: 'Termo de busca é obrigatório' });>>server\src\index.js
echo     }>>server\src\index.js
echo     console.log(`Pesquisando por: ${query}`);>>server\src\index.js
echo     const results = await simulateGoogleResults(query);>>server\src\index.js
echo     res.json(results);>>server\src\index.js
echo   } catch (error) {>>server\src\index.js
echo     console.error('Erro na busca de produtos:', error);>>server\src\index.js
echo     res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });>>server\src\index.js
echo   }>>server\src\index.js
echo });>>server\src\index.js
echo.>>server\src\index.js
echo // Função para simular resultados de pesquisa>>server\src\index.js
echo async function simulateGoogleResults(query) {>>server\src\index.js
echo   const storeDistribution = ["Amazon", "Magazine Luiza", "Mercado Livre", "Americanas", "Casas Bahia"];>>server\src\index.js
echo   const results = [];>>server\src\index.js
echo   for (let i = 0; i ^< 12; i++) {>>server\src\index.js
echo     const randomStore = storeDistribution[Math.floor(Math.random() * storeDistribution.length)];>>server\src\index.js
echo     const randomPrice = (Math.random() * 2000 + 500).toFixed(2);>>server\src\index.js
echo     const randomRating = (Math.random() * 2 + 3).toFixed(1);>>server\src\index.js
echo     const randomReviews = Math.floor(Math.random() * 900) + 100;>>server\src\index.js
echo     const product = {>>server\src\index.js
echo       id: uuidv4(),>>server\src\index.js
echo       name: `${query} ${["Premium", "Ultra", "Pro", "Max", "Plus", "Lite"][Math.floor(Math.random() * 6)]}`,>>server\src\index.js
echo       description: `Este produto ${query} é de excelente qualidade e possui ótimo custo-benefício.`,>>server\src\index.js
echo       price: parseFloat(randomPrice),>>server\src\index.js
echo       imageUrl: `https://source.unsplash.com/200x200/?${encodeURIComponent(query.replace(/\s+/g, ','))}`,>>server\src\index.js
echo       store: randomStore,>>server\src\index.js
echo       url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,>>server\src\index.js
echo       rating: parseFloat(randomRating),>>server\src\index.js
echo       reviews: randomReviews,>>server\src\index.js
echo       available: true,>>server\src\index.js
echo       searchScore: Math.random() * 100>>server\src\index.js
echo     };>>server\src\index.js
echo     results.push(product);>>server\src\index.js
echo     products.push(product);>>server\src\index.js
echo   }>>server\src\index.js
echo   return results.sort((a, b) =^> b.searchScore - a.searchScore);>>server\src\index.js
echo }>>server\src\index.js
echo.>>server\src\index.js
echo // Iniciar servidor>>server\src\index.js
echo app.listen(PORT, () =^> {>>server\src\index.js
echo   console.log(`Servidor rodando na porta ${PORT}: http://localhost:${PORT}/api/status`);>>server\src\index.js
echo });>>server\src\index.js

cd server
echo Instalando dependências do servidor...
call npm install --save express cors dotenv uuid axios cheerio
cd ..

echo.
echo === Instalando dependências do cliente ===
if not exist client mkdir client
if not exist client\src mkdir client\src
if not exist client\public mkdir client\public

echo Criando pasta public do cliente...
if not exist client\public\index.html (
    echo ^<!DOCTYPE html^>>client\public\index.html
    echo ^<html lang="pt-br"^>>>client\public\index.html
    echo   ^<head^>>>client\public\index.html
    echo     ^<meta charset="utf-8" /^>>>client\public\index.html
    echo     ^<meta name="viewport" content="width=device-width, initial-scale=1" /^>>>client\public\index.html
    echo     ^<meta name="theme-color" content="#4285f4" /^>>>client\public\index.html
    echo     ^<meta name="description" content="LazzSearch - Comparador de preços online" /^>>>client\public\index.html
    echo     ^<link rel="preconnect" href="https://fonts.googleapis.com"^>>>client\public\index.html
    echo     ^<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin^>>>client\public\index.html
    echo     ^<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"^>>>client\public\index.html
    echo     ^<title^>LazzSearch - Compare e economize^</title^>>>client\public\index.html
    echo   ^</head^>>>client\public\index.html
    echo   ^<body^>>>client\public\index.html
    echo     ^<noscript^>Você precisa habilitar o JavaScript para executar este aplicativo.^</noscript^>>>client\public\index.html
    echo     ^<div id="root"^>^</div^>>>client\public\index.html
    echo   ^</body^>>>client\public\index.html
    echo ^</html^>>>client\public\index.html
)

cd client
echo Instalando dependências do cliente...

REM Remover node_modules e package-lock.json se existirem
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Instalar o create-react-app globalmente para garantir que funcione
call npm install -g create-react-app

REM Inicializar o projeto React com o create-react-app
echo "Inicializando um novo projeto React..."
call npx create-react-app . --template=javascript

REM Garantir que todas as dependências foram instaladas corretamente
echo "Verificando e reinstalando dependências para garantir funcionamento..."
call npm install --force

cd ..

echo.
echo === Configuração concluída ===
echo.
echo === Instruções: ===
echo 1. Para iniciar o servidor, execute: cd server ^&^& npm start
echo 2. Para iniciar o cliente, execute: cd client ^&^& npm start
echo 3. Ou execute o arquivo start.bat para iniciar ambos
echo.
pause
