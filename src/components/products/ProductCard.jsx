// src/components/products/ProductCard.jsx
import { } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, onAddToCart, showAddToCart = true }) => {
  const navigate = useNavigate();
  const { addItem, isInCart, getItemQuantity } = useCart();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product, 1, e);
  };

  const isLowStock = product.stock <= product.minStock;
  const isOutOfStock = product.stock === 0;

  return (
    <div 
      className={`product-card ${isOutOfStock ? 'product-card--out-of-stock' : ''}`}
      onClick={handleCardClick}
    >
      {/* Imagen del producto - Más pequeña */}
      <div className="product-card__image-wrapper">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="product-card__image"
        />
        
        {/* Badges - Más pequeños */}
        <div className="product-card__badges">
          {product.featured && (
            <span className="product-badge product-badge--featured">
              Destacado
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="product-badge product-badge--warning">
              <AlertTriangle size={8} />
              Pocas
            </span>
          )}
          {isOutOfStock && (
            <span className="product-badge product-badge--error">
              Agotado
            </span>
          )}
        </div>
      </div>

      {/* Contenido del producto - Más compacto */}
      <div className="product-card__content">
        {/* Header con categoría y rating */}
        <div className="product-card__header">
          <span className="product-card__category">
            {product.category}
          </span>
          {product.rating > 0 && (
            <div className="product-card__rating">
              <Star size={10} className="product-card__star" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Nombre del producto */}
        <h3 className="product-card__title">
          {product.name}
        </h3>

        {/* Descripción - Más corta */}
        <p className="product-card__description">
          {product.description}
        </p>

        {/* Precio y acciones */}
        <div className="product-card__footer">
          <div className="product-card__price-section">
            <span className="product-card__price">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`product-card__add-btn ${
                isOutOfStock ? 'product-card__add-btn--disabled' : ''
              }`}
            >
              <ShoppingCart size={10} />
              {isOutOfStock ? 'Agotado' : isInCart(product.id) ? `(${getItemQuantity(product.id)})` : 'Agregar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;