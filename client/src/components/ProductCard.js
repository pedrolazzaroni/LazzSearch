import React, { useState, useEffect } from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  
  // Efeito para resetar o estado da imagem quando o produto muda
  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);
  }, [product.id]);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star full">★</span>);
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star half">★</span>);
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };
  
  // Função para visitar URL do produto
  const handleCardClick = () => {
    // Log para analytics
    console.log(`Redirecionando para: ${product.store} - ${product.name}`);
    
    // Se a URL for válida, abre em nova aba
    if (product.url && product.url.startsWith('http')) {
      window.open(product.url, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback para pesquisa Google com nome do produto e loja
      const searchQuery = encodeURIComponent(`${product.name} ${product.store}`);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    }
  };
  
  // Função para salvar produto sem propagar o clique
  const handleSaveClick = (e) => {
    e.stopPropagation();
    
    try {
      // Adiciona o produto ao localStorage para "favoritos"
      const savedProducts = JSON.parse(localStorage.getItem('lazzsearch_favorites') || '[]');
      
      // Verifica se já está salvo
      if (savedProducts.some(p => p.id === product.id)) {
        alert(`"${product.name}" já está nos seus favoritos!`);
        return;
      }
      
      // Salva apenas os dados essenciais
      savedProducts.push({
        id: product.id,
        name: product.name,
        price: product.price,
        store: product.store,
        imageUrl: product.imageUrl,
        url: product.url,
        savedAt: new Date().toISOString()
      });
      
      localStorage.setItem('lazzsearch_favorites', JSON.stringify(savedProducts));
      console.log('Produto salvo:', product.id);
      alert(`"${product.name}" foi salvo nos favoritos!`);
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      alert('Não foi possível salvar o produto.');
    }
  };
  
  // Tratamento melhorado para URLs de imagem quebradas
  const handleImageError = (e) => {
    if (imageFailed) return; // Previne loops infinitos
    
    setImageFailed(true);
    e.target.onerror = null;
    
    // Cria uma URL baseada no nome do produto para imagem de fallback
    const encodedName = encodeURIComponent(
      (product.name || 'produto').split(' ').slice(0, 3).join(' ')
    );
    
    // Tenta uma imagem do Unsplash específica para o produto
    e.target.src = `https://source.unsplash.com/300x300/?${encodedName.replace(/%20/g, '+')}`;
    
    // Se continuar falhando, configura um fallback final
    e.target.onerror = () => {
      e.target.src = `https://via.placeholder.com/300x300/FF5500/FFFFFF?text=${encodedName}`;
      e.target.onerror = null;
    };
  };

  return (
    <div 
      className={`product-card ${isHovered ? 'product-card-hover' : ''} ${product.realData ? 'real-data' : 'simulated-data'}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image">
        {!imageLoaded && !imageFailed && <div className="image-placeholder pulse"></div>}
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          loading="lazy" 
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        <div className="product-store-tag">{product.store}</div>
        {product.realData === false && <div className="data-source-tag">Simulado</div>}
        {isHovered && (
          <div className="product-quick-view">
            <span>Ver oferta na {product.store}</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <div className="stars">{renderStars(product.rating || 4)}</div>
          <span className="reviews-count">({product.reviews || 0})</span>
        </div>
        <div className="product-price-container">
          <div className="product-price">{formatCurrency(product.price || 0)}</div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="original-price">{formatCurrency(product.originalPrice)}</div>
          )}
        </div>
        <p className="product-description">{product.description}</p>
      </div>
      <div className="product-actions">
        <a 
          href={product.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="view-deal-btn"
          onClick={(e) => e.stopPropagation()}
        >
          Ver oferta
        </a>
        <button className="save-btn" onClick={handleSaveClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
