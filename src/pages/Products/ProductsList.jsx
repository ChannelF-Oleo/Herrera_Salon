import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import ProductCard from "../../components/products/ProductCard";
import { Search, ChevronDown, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import "../../styles/ProductsList.css";

// Imagen hero para productos
import productsHeroImage from "../../assets/images/hero_image.jpeg";

const ProductsList = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Categorías disponibles
  const categories = [
    "Todos",
    "Esmaltes",
    "Kits",
    "Cuidado",
    "Herramientas",
    "Accesorios"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where("isActive", "==", true),
          orderBy("name", "asc")
        );

        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback sin orderBy
        try {
          const fallbackSnapshot = await getDocs(
            query(collection(db, "products"), where("isActive", "==", true))
          );
          const fallbackData = fallbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setProducts(fallbackData);
          setFilteredProducts(fallbackData);
        } catch (fallbackError) {
          console.error("Fallback también falló:", fallbackError);
          setProducts([]);
          setFilteredProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar productos
  useEffect(() => {
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.filter-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const ProductCardCompact = ({ product }) => (
    <div
      className="product-card group"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Imagen del producto */}
      <div className="product-card-image-wrapper">
        <img
          src={product.images?.[0] || productsHeroImage}
          alt={product.name}
          className="product-card-image"
        />
        
        {/* Badges */}
        <div className="product-card-badges">
          {product.featured && (
            <span className="product-badge featured">
              <Star size={10} />
              Destacado
            </span>
          )}
          {product.stock === 0 && (
            <span className="product-badge out-of-stock">
              Agotado
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="product-badge low-stock">
              Pocas unidades
            </span>
          )}
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="product-card-content">
        <div className="product-card-header">
          <span className="product-card-category">{product.category}</span>
          {product.rating > 0 && (
            <div className="product-card-rating">
              <Star size={12} />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <h3 className="product-card-title">{product.name}</h3>
        
        <p className="product-card-description">
          {product.description || "Producto profesional de belleza"}
        </p>

        {/* Precio y CTA */}
        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="price">${product.price?.toFixed(2) || "0.00"}</span>
          </div>

          <button
            className={`product-card-add-btn ${product.stock === 0 ? 'disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (product.stock > 0) {
                addItem(product, 1, e);
              }
            }}
            disabled={product.stock === 0}
          >
            <ShoppingBag size={14} />
            <span>{product.stock === 0 ? 'Agotado' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-content">
          <ShoppingBag className="loading-icon" size={48} />
          <h2>Cargando productos...</h2>
          <p>Preparando nuestros productos de belleza</p>
        </div>
      </div>
    );
  }

  return (
    <main className="products-page">
      {/* Sección de filtros y productos */}
      <section className="products-content">
        <div className="container">
          {/* Header de la página */}
          <div className="products-page-header">
            <h1 className="products-page-title">
              Nuestros <span className="title-accent">Productos</span>
            </h1>
            <p className="products-page-subtitle">
              Descubre nuestra línea exclusiva de productos profesionales para el cuidado y belleza
            </p>
          </div>

          {/* Controles de filtrado */}
          <div className="products-controls">
            {/* Buscador y Filtro en línea */}
            <div className="search-filter-container">
              {/* Buscador */}
              <div className="search-container">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Filtro desplegable */}
              <div className="filter-dropdown">
                <button
                  className="filter-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown 
                    size={18} 
                    className={`chevron ${isDropdownOpen ? 'open' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="products-results">
            <div className="results-header">
              <h2>
                {selectedCategory === "Todos" ? "Todos los Productos" : selectedCategory}
              </h2>
              <p>{filteredProducts.length} productos disponibles</p>
            </div>

            {/* Grid de productos */}
            {filteredProducts.length === 0 ? (
              <div className="no-results">
                <ShoppingBag size={48} />
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda o categoría</p>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Todos");
                  }}
                >
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCardCompact key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductsList;
