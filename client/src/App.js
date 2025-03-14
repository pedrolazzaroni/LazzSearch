import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import Loader from './components/Loader';
import Header from './components/Header';
import Footer from './components/Footer';
import EmptyState from './components/EmptyState';
import AboutPage from './components/AboutPage';
import ErrorBoundary from './components/ErrorBoundary';
import config from './config';

function HomePage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState('');

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearched(true);
    setLastQuery(query);
    
    try {
      // Usa as configurações da API do arquivo config.js
      const apiUrl = `${config.api.baseUrl}${config.api.endpoints.search}?q=${encodeURIComponent(query)}`;
      
      console.log(`Buscando produtos em: ${apiUrl}`);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Falha na busca. Por favor, tente novamente.`);
      }
      
      const data = await response.json();
      console.log(`Encontrados ${data.length} produtos`);
      
      // Salva no histórico de buscas, se habilitado
      if (config.features.enableSearchHistory) {
        const searchHistory = JSON.parse(localStorage.getItem('lazzsearch_history') || '[]');
        const now = new Date().toISOString();
        
        // Adiciona ao início e evita duplicatas
        const updatedHistory = [
          { query, timestamp: now },
          ...searchHistory.filter(item => item.query !== query)
        ].slice(0, 10); // Mantém apenas as 10 buscas mais recentes
        
        localStorage.setItem('lazzsearch_history', JSON.stringify(updatedHistory));
      }
      
      setResults(data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError(`Ocorreu um erro ao buscar os produtos: ${err.message}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <SearchBar onSearch={handleSearch} />
      
      {loading && <Loader />}
      
      {error && <div className="error-message">{error}</div>}
      
      {!loading && searched && !error && results.length === 0 && (
        <EmptyState message={`Nenhum produto encontrado para "${lastQuery}". Tente uma nova busca.`} />
      )}
      
      {!loading && results.length > 0 && <ResultsList products={results} />}
    </main>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
