// src/components/home/ProductsSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ProductCard from '../products/ProductCard';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

const ProductsSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        
        // Simplificar query para evitar problemas de índices
        const productsQuery = query(
          collection(db, 'products'),
          where('isActive', '==', true)
        );

        const snapshot = await getDocs(productsQuery);

        let productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filtrar productos destacados primero, luego limitar a 6
        const featuredProducts = productsData.filter(p => p.featured);
        if (featuredProducts.length > 0) {
          productsData = featuredProducts.slice(0, 6);
        } else {
          productsData = productsData.slice(0, 6);
        }

        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar productos');
        
        // Fallback: mostrar productos de ejemplo si hay error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    // La funcionalidad del carrito se maneja en ProductCard
    console.log('Agregar al carrito desde ProductsSection:', product);
  };

  if (loading) {
    return (
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div className="loading-icon"></div>
            <div className="loading-title"></div>
            <div className="loading-description"></div>
          </div>
          
          <div className="products-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="product-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-price"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="products-section">
        <div className="container">
          <div className="empty-state">
            <ShoppingBag className="empty-icon" />
            <h2 className="section-title">
              Productos <span className="highlight-text">Profesionales</span>
            </h2>
            <p className="empty-description">
              Próximamente tendremos productos disponibles para ti
            </p>
            <button
              onClick={() => navigate('/products')}
              className="btn-catalog"
            >
              Ver Catálogo Completo
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="container">
        {/* Header de la sección */}
        <div className="section-header">
          <div className="section-icon-group">
            <Sparkles className="section-icon" />
            <ShoppingBag className="section-icon" />
          </div>
          
          <h2 className="section-title">
            Productos <span className="highlight-text">Profesionales</span>
          </h2>
          
          <p className="section-description">
             Calidad premium para resultados excepcionales.
          </p>

          {products.length > 0 && (
            <div className="product-indicators">
              <span className="indicator">
                <div className="indicator-dot featured"></div>
                Productos destacados
              </span>
              <span className="indicator">
                <div className="indicator-dot available"></div>
                En stock
              </span>
              <span className="indicator">
                <div className="indicator-dot limited"></div>
                Pocas unidades
              </span>
            </div>
          )}
        </div>

        {/* Grid de productos */}
        {products.length > 0 ? (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  showAddToCart={true}
                />
              ))}
            </div>

            {/* Call to action */}
            <div className="section-cta">
              <button
                onClick={() => navigate('/products')}
                className="btn-catalog"
              >
                Ver Catálogo Completo
                <ArrowRight size={18} />
              </button>
              
              <p className="cta-subtitle">
                Más de {products.length} productos disponibles
              </p>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <ShoppingBag className="empty-icon" />
            <h3 className="empty-title">
              Catálogo en Preparación
            </h3>
            <p className="empty-description">
              Estamos preparando nuestros productos exclusivos para ti
            </p>
            <button
              onClick={() => navigate('/products')}
              className="btn-secondary-outline"
            >
              Explorar Productos
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;