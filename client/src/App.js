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

function HomePage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Falha na busca. Por favor, tente novamente.');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Ocorreu um erro ao buscar os produtos. Por favor, tente novamente.');
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
        <EmptyState message="Nenhum produto encontrado. Tente uma nova busca." />
      )}
      
      {!loading && results.length > 0 && <ResultsList products={results} />}
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
