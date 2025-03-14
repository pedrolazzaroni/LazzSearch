import React, { useState, useEffect } from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageRetries, setImageRetries] = useState(0);
  
  // Efeito para resetar o estado da imagem quando o produto muda
  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);
    setImageRetries(0);
  }, [product.id, product.imageUrl]);
  
  // Formatação de preço com R$ e garantia de 2 casas decimais
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    
    // Garante que temos um número
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Usa Intl.NumberFormat para garantir sempre 2 casas decimais
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };
  
  // Calcula o percentual de desconto, se houver
  const calculateDiscount = () => {
    if (!product.originalPrice || product.originalPrice <= product.price) return null;
    
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    return Math.round(discount); // Arredonda para número inteiro
  };
  
  const discountPercent = calculateDiscount();

  // Renderiza as estrelas de avaliação
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
    // Registra analytics (simulado)
    console.log(`Clique: ${product.name} | ${formatCurrency(product.price)} | ${product.store}`);
    
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
      
      // Salva os dados essenciais
      savedProducts.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        store: product.store,
        imageUrl: product.imageUrl,
        url: product.url,
        rating: product.rating,
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
  
  // Estratégia avançada para tratamento de falhas de imagem
  const handleImageError = (e) => {
    // Limita a 3 tentativas para evitar loops infinitos
    if (imageRetries >= 3) {
      setImageFailed(true);
      return;
    }
    
    setImageRetries(prev => prev + 1);
    e.target.onerror = null;
    
    // Estratégia em cascata para tentar diferentes fontes de imagem
    switch (imageRetries) {
      case 0:
        // Primeira tentativa: adiciona parâmetro de cache-busting à URL existente
        if (product.imageUrl.includes('?')) {
          e.target.src = `${product.imageUrl}&cb=${Date.now()}`;
        } else {
          e.target.src = `${product.imageUrl}?cb=${Date.now()}`;
        }
        break;
      
      case 1:
        // Segunda tentativa: tenta buscar uma imagem no Unsplash específica para o produto
        const productTerms = encodeURIComponent(
          (product.name || '').split(' ').slice(0, 3).join(' ')
        );
        e.target.src = `https://source.unsplash.com/400x400/?${productTerms.replace(/%20/g, '+')}`;
        break;
      
      case 2:
        // Terceira tentativa: usa o produto e a loja para buscar uma imagem mais específica
        const searchTerms = encodeURIComponent(`${product.store} ${product.name.split(' ')[0]}`);
        e.target.src = `https://source.unsplash.com/400x400/?${searchTerms.replace(/%20/g, '+')}&product`;
        break;
      
      default:
        // Fallback final: usa um placeholder com o nome do produto
        const encodedName = encodeURIComponent(product.name.substring(0, 15));
        e.target.src = `https://via.placeholder.com/400x400/FF5500/FFFFFF?text=${encodedName}`;
        setImageFailed(true);
    }
  };

  return (
    <div 
      className="product-card"
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
        
        {discountPercent && (
          <div className="discount-badge">-{discountPercent}%</div>
        )}
        
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
          <div className="product-price">{formatCurrency(product.price)}</div>
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
