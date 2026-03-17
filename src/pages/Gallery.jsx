import { useState, useEffect } from "react";
import Portal from "../components/ui/Portal";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { Image, Search, Filter, Eye, X } from "lucide-react";
import "../styles/Gallery.css";

// 1. MOVÍ ESTO AFUERA: Optimización para que no se re-cree en cada render
const getFallbackImages = () => [
  {
    id: '1',
    title: 'Trenzas Africanas Elegantes',
    description: 'Hermoso peinado con trenzas africanas para ocasión especial',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    category: 'trenzas',
    tags: ['trenzas', 'africanas', 'elegante'],
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Manicure Francesa Clásica',
    description: 'Manicure francesa perfecta con acabado brillante',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    category: 'uñas',
    tags: ['manicure', 'francesa', 'clásica'],
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'Corte y Peinado Moderno',
    description: 'Corte de cabello moderno con peinado profesional',
    imageUrl: 'https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?auto=format&fit=crop&w=800&q=80',
    category: 'peluqueria',
    tags: ['corte', 'peinado', 'moderno'],
    createdAt: new Date()
  },
  {
    id: '4',
    title: 'Relajación en Spa',
    description: 'Sesión de relajación y cuidado corporal',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    category: 'spa',
    tags: ['spa', 'relajación', 'masaje'],
    createdAt: new Date()
  },
  {
    id: '5',
    title: 'Diseño de Cejas Perfecto',
    description: 'Cejas perfectamente diseñadas y definidas',
    imageUrl: 'https://images.unsplash.com/photo-1588510883462-801e14940026?auto=format&fit=crop&w=800&q=80',
    category: 'cejas',
    tags: ['cejas', 'diseño', 'definidas'],
    createdAt: new Date()
  },
  {
    id: '6',
    title: 'Maquillaje de Noche',
    description: 'Maquillaje elegante para eventos nocturnos',
    imageUrl: 'https://images.unsplash.com/photo-1487412947132-28c5d9539d3c?auto=format&fit=crop&w=800&q=80',
    category: 'maquillaje',
    tags: ['maquillaje', 'noche', 'elegante'],
    createdAt: new Date()
  }
];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { id: "all", name: "Todas las categorías" },
    { id: "trenzas", name: "Trenzas Africanas" },
    { id: "uñas", name: "Uñas y Manicure" },
    { id: "peluqueria", name: "Peluquería" },
    { id: "spa", name: "Spa y Relajación" },
    { id: "cejas", name: "Cejas y Pestañas" },
    { id: "maquillaje", name: "Maquillaje" },
    { id: "antes-despues", name: "Antes y Después" }
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const galleryRef = collection(db, "gallery");
        const q = query(galleryRef, orderBy("createdAt", "desc"));
        
        const snapshot = await getDocs(q);
        const imagesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // 2. CORRECCIÓN DE FECHAS: 
            // Si viene de Firebase (.toDate existe), lo convertimos. 
            // Si no, usamos la fecha actual o la que venga.
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
          };
        });

        if (imagesData.length > 0) {
          setImages(imagesData);
          setFilteredImages(imagesData);
        } else {
          // Fallback a imágenes de ejemplo
          const fallbackImages = getFallbackImages();
          setImages(fallbackImages);
          setFilteredImages(fallbackImages);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        // Usar imágenes de ejemplo en caso de error
        const fallbackImages = getFallbackImages();
        setImages(fallbackImages);
        setFilteredImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Filtrar imágenes
  useEffect(() => {
    let filtered = [...images];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(image =>
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }

    setFilteredImages(filtered);
  }, [images, searchTerm, selectedCategory]);

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="gallery-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-main">
      <div className="gallery-container">
        {/* Header */}
        <div className="gallery-header">
          <div className="gallery-icon-container">
            <Image className="gallery-icon" />
          </div>
          <h1 className="gallery-title">
            Portafolio Herrera Beauty Studio
          </h1>
          <p className="gallery-description">
            Descubre nuestros trabajos más destacados y déjate inspirar por la belleza y el arte
          </p>
        </div>

        {/* Filtros */}
        <div className="gallery-filters">
          <div className="filters-container">
            {/* Búsqueda */}
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar en la galería..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Filtro de categoría */}
            <div className="category-filter-container">
              <Filter className="filter-icon" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="results-counter">
          <p>
            Mostrando {filteredImages.length} de {images.length} imágenes
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {/* Grid de imágenes */}
        {filteredImages.length > 0 ? (
          <div className="gallery-grid">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="gallery-card"
                onClick={() => openImageModal(image)}
              >
                <div className="gallery-card-image-container">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="gallery-card-image"
                  />
                </div>
                
                {/* Overlay con información */}
                <div className="gallery-card-overlay">
                  <div className="gallery-card-overlay-content">
                    <Eye className="overlay-eye-icon" />
                    <h3 className="overlay-title">{image.title}</h3>
                    <p className="overlay-description">{image.description}</p>
                  </div>
                </div>

                {/* Categoría */}
                <div className="gallery-card-category">
                  {categories.find(cat => cat.id === image.category)?.name || image.category}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="gallery-empty">
            <Image className="empty-icon" />
            <h3 className="empty-title">
              No se encontraron imágenes
            </h3>
            <p className="empty-description">
              Intenta ajustar los filtros de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="clear-filters-btn"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Modal de imagen */}
      {selectedImage && (
        <Portal>
          <div className="image-modal-backdrop">
            <div className="image-modal-container">
              <button
                onClick={closeImageModal}
                className="modal-close-btn"
              >
                <X size={20} />
              </button>
              
              <div className="modal-content">
                <div className="modal-image-container">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className="modal-image"
                  />
                </div>
                
                <div className="modal-info">
                  <div className="modal-category">
                    {categories.find(cat => cat.id === selectedImage.category)?.name || selectedImage.category}
                  </div>
                  
                  <h2 className="modal-title">
                    {selectedImage.title}
                  </h2>
                  
                  <p className="modal-description">
                    {selectedImage.description}
                  </p>
                  
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div className="modal-tags-section">
                      <h4 className="modal-tags-title">Tags:</h4>
                      <div className="modal-tags">
                        {selectedImage.tags.map((tag, index) => (
                          <span key={index} className="modal-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="modal-date">
                    {selectedImage.createdAt && (
                      <p>Fecha: {selectedImage.createdAt.toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default Gallery;