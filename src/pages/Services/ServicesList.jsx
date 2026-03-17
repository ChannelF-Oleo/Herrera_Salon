// src/pages/Services/ServicesList.jsx
import React, { useEffect, useState } from "react";
import { useNavigateWithScroll } from "../../hooks/useNavigateWithScroll";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import { ArrowRight, Sparkles, Clock, DollarSign, Search, ChevronDown } from "lucide-react";
import "../../styles/ServicesList.css";

// Imagen hero para servicios
import servicesHeroImage from "../../assets/images/hero_image.jpeg";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigateWithScroll = useNavigateWithScroll();

  // Categorías disponibles
  const categories = [
    "Todos",
    "Manicura/Pedicura",
    "Peluquería", 
    "Maquillaje",
    "Depilación",
    "Spa/Bienestar",
    "Pestañas/Cejas"
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesRef = collection(db, "services");
        const q = query(servicesRef, orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);
        
        const servicesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setServices(servicesData);
        setFilteredServices(servicesData);
      } catch (error) {
        console.error("Error obteniendo servicios:", error);
        // Fallback sin orderBy
        try {
          const fallbackSnapshot = await getDocs(collection(db, "services"));
          const fallbackData = fallbackSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setServices(fallbackData);
          setFilteredServices(fallbackData);
        } catch (fallbackError) {
          console.error("Fallback también falló:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filtrar servicios
  useEffect(() => {
    let filtered = services;

    // Filtrar por categoría
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory]);

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

  const ServiceCard = ({ service }) => (
    <div
      className="service-card group"
      onClick={() => navigateWithScroll(`/services/${service.id}`)}
    >
      {/* Imagen del servicio */}
      <div className="service-card-image-wrapper">
        <img
          src={service.image || servicesHeroImage}
          alt={service.name}
          className="service-card-image"
        />

        {/* Contador de subservicios */}
        {service.subservices && service.subservices.length > 0 && (
          <div className="service-card-count">
            <Sparkles size={12} />
            <span>{service.subservices.length} opciones</span>
          </div>
        )}
      </div>

      {/* Contenido de la card */}
      <div className="service-card-content">
        <h3 className="service-card-title">{service.name}</h3>
        
        <p className="service-card-description">
          {service.description || "Servicio profesional de belleza"}
        </p>

        {/* Información del servicio */}
        <div className="service-card-info">
          <div className="service-info-item">
            <DollarSign size={14} />
            <span>Desde ${service.price}</span>
          </div>
          <div className="service-info-item">
            <Clock size={14} />
            <span>{service.duration} min</span>
          </div>
        </div>

        {/* CTA */}
        <div className="service-card-cta">
          <span>Ver detalles</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="services-loading">
        <div className="loading-content">
          <Sparkles className="loading-icon" size={48} />
          <h2>Cargando servicios...</h2>
          <p>Preparando nuestros tratamientos de belleza</p>
        </div>
      </div>
    );
  }

  return (
    <main className="services-page">
      {/* Sección de filtros y servicios */}
      <section className="services-content">
        <div className="container">
          {/* Header de la página */}
          <div className="services-page-header">
            <h1 className="services-page-title">
              Nuestros <span className="title-accent">Servicios</span>
            </h1>
            <p className="services-page-subtitle">
              Descubre nuestra gama completa de tratamientos profesionales de belleza
            </p>
          </div>

          {/* Controles de filtrado */}
          <div className="services-controls">
            {/* Buscador y Filtro en línea */}
            <div className="search-filter-container">
              {/* Buscador */}
              <div className="search-container">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar servicios..."
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
          <div className="services-results">
            <div className="results-header">
              <h2>
                {selectedCategory === "Todos" ? "Todos los Servicios" : selectedCategory}
              </h2>
              <p>{filteredServices.length} servicios disponibles</p>
            </div>

            {/* Grid de servicios */}
            {filteredServices.length === 0 ? (
              <div className="no-results">
                <Sparkles size={48} />
                <h3>No se encontraron servicios</h3>
                <p>Intenta con otros términos de búsqueda o categoría</p>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Todos");
                  }}
                >
                  Ver todos los servicios
                </button>
              </div>
            ) : (
              <div className="services-grid">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesList;
