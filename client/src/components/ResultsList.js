import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ResultsList.css';

const ResultsList = ({ products }) => {
  const [sortBy, setSortBy] = useState('price_asc');
  const [filterStore, setFilterStore] = useState('');
  const [realDataCount, setRealDataCount] = useState(0);
  
  // Calcula quantos produtos têm dados reais
  useEffect(() => {
    const realCount = products.filter(p => p.realData === true).length;
    setRealDataCount(realCount);
  }, [products]);

  // Get unique store names
  const stores = [...new Set(products.map(product => product.store))].sort();

  // Sort and filter products
  const getSortedAndFilteredProducts = () => {
    let filteredProducts = [...products];
    
    // Apply store filter
    if (filterStore) {
      filteredProducts = filteredProducts.filter(p => p.store === filterStore);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        return filteredProducts.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return filteredProducts.sort((a, b) => b.price - a.price);
      case 'rating':
        return filteredProducts.sort((a, b) => b.rating - a.rating);
      case 'relevance':
        return filteredProducts.sort((a, b) => b.searchScore - a.searchScore);
      default:
        return filteredProducts;
    }
  };

  const sortedAndFilteredProducts = getSortedAndFilteredProducts();
  
  // Cria uma estatística de preço mínimo, máximo e médio
  const priceStats = sortedAndFilteredProducts.length > 0 
    ? {
        min: Math.min(...sortedAndFilteredProducts.map(p => p.price)),
        max: Math.max(...sortedAndFilteredProducts.map(p => p.price)),
        avg: sortedAndFilteredProducts.reduce((sum, p) => sum + p.price, 0) / sortedAndFilteredProducts.length
      }
    : { min: 0, max: 0, avg: 0 };

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-title">
          <h2>Resultados encontrados ({sortedAndFilteredProducts.length})</h2>
          {products.length > 0 && (
            <div className="data-quality-indicator">
              {realDataCount > 0 ? (
                <span className="data-quality real">
                  {realDataCount} produtos com dados reais encontrados
                </span>
              ) : (
                <span className="data-quality simulated">
                  Dados simulados (nenhum produto real encontrado)
                </span>
              )}
            </div>
          )}
        </div>
        <div className="filter-controls">
          <div className="sort-control">
            <label htmlFor="sort">Ordenar por:</label>
            <select 
              id="sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
              <option value="rating">Melhor avaliação</option>
              <option value="relevance">Relevância</option>
            </select>
          </div>
          <div className="store-filter">
            <label htmlFor="store">Filtrar loja:</label>
            <select 
              id="store" 
              value={filterStore} 
              onChange={(e) => setFilterStore(e.target.value)}
            >
              <option value="">Todas as lojas</option>
              {stores.map(store => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {sortedAndFilteredProducts.length > 0 && (
        <div className="price-range-summary">
          <div className="price-stat">
            <span className="price-label">Menor preço:</span>
            <span className="price-value">{new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(priceStats.min)}</span>
          </div>
          <div className="price-stat">
            <span className="price-label">Preço médio:</span>
            <span className="price-value">{new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(priceStats.avg)}</span>
          </div>
          <div className="price-stat">
            <span className="price-label">Maior preço:</span>
            <span className="price-value">{new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(priceStats.max)}</span>
          </div>
        </div>
      )}

      <div className="products-grid">
        {sortedAndFilteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
