// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigateWithScroll } from "../hooks/useNavigateWithScroll";
// Agregamos 'limit' para optimizar la descarga
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../config/firebase";
import "../styles/Home.css";
import { icons } from "../utils/icons";
import "../styles/Styles.css";
import ProductsSection from "../components/home/ProductsSection";
import AcademySection from "../components/home/AcademySection";
import ReviewsSection from "./ReviewsSection";
import { MessageCircle } from "lucide-react";

// Imagen hero
import heroImage from "../assets/images/hero_image.jpeg";

// --- Card de Servicio (Limpia) ---
const ServiceCard = ({ service }) => {
  const navigateWithScroll = useNavigateWithScroll();

  const handleClick = () => {
    navigateWithScroll(`/services/${service.id}`);
  };

  return (
    <button onClick={handleClick} className="service-card group">
      {/* Wrapper de Imagen */}
      <div className="card-image-wrapper">
        <img
          src={service.image}
          alt={service.name}
          className="card-image"
          loading="lazy"
        />
      </div>

      {/* Contenido de Texto */}
      <div className="card-content">
        <h3 className="card-title">{service.name}</h3>
        <p className="card-desc">{service.description}</p>

        {/* Mostrar número de subservicios si existen */}
        {service.subservices && service.subservices.length > 0 && (
          <div className="text-sm text-purple-600 mb-2">
            {service.subservices.length} opciones disponibles
          </div>
        )}

        <div className="card-link">
          Ver Detalles
          <icons.ArrowRight className="arrow-icon" size={20} />
        </div>
      </div>
    </button>
  );
};

// --- Hero Section ---
const HeroSection = () => {
  const navigateWithScroll = useNavigateWithScroll();

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Imagen a la izquierda */}
        <div className="hero-image-wrapper">
          <img 
            src={heroImage} 
            alt="Herrera Beauty Studio" 
            className="hero-image"
          />
        </div>

        {/* Contenido a la derecha */}
        <div className="hero-content animate-fade-in">
          <div className="hero-badge">
            <span className="badge-text">Beauty Studio</span>
          </div>
          
          <h1 className="hero-title">
            Herrera Beauty
            <span className="title-accent">Studio</span>
          </h1>
          
          <p className="hero-subtitle">
            Donde la belleza se encuentra con la técnica profesional
          </p>
          
          <p className="hero-description">
            Especialistas en peinados, uñas, maquillaje y tratamientos de belleza. 
            Cada servicio es una experiencia personalizada.
          </p>

          <div className="hero-cta-group">
            <a 
              href="https://wa.me/18297050408?text=¡Buenas!%20Me%20gustaría%20agendar%20una%20cita"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              aria-label="Agendar cita por WhatsApp"
            >
              <MessageCircle size={18} />
              <span>Agendar Cita</span>
            </a>
            
            <button 
              className="btn-secondary" 
              onClick={() => navigateWithScroll("/services")}
              type="button"
              aria-label="Ver todos los servicios"
            >
              <span>Ver Servicios</span>
              <icons.ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Elementos visuales decorativos más sutiles */}
      <div className="hero-visual">
        <div className="visual-element visual-circle-1"></div>
        <div className="visual-element visual-circle-2"></div>
      </div>
    </section>
  );
};

// --- Services Section (Solo Firebase) ---
const ServicesSection = () => {
  const navigateWithScroll = useNavigateWithScroll();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesRef = collection(db, "services");
        
        // QUERY OPTIMIZADA: limita a 3
        const q = query(servicesRef, limit(3));
        
        const querySnapshot = await getDocs(q);

        const servicesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="servicios" className="services-section">
        <div className="container">
          <h2 className="section-title">
            Nuestros <span className="highlight-text">Servicios Destacados</span>
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay servicios cargados, no renderizamos la grilla vacía (opcional)
  if (services.length === 0) {
     return null; 
  }

  return (
    <section id="servicios" className="services-section">
      <div className="container">
        <h2 className="section-title">
          Nuestros <span className="highlight-text">Servicios</span>
        </h2>

        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigateWithScroll("/services")}
            className="btn-catalog"
          >
            Ver Catálogo Completo
            <icons.ArrowRight size={18} />
          </button>

          <p className="catalog-subtitle">
            Descubre todos nuestros servicios especializados
          </p>
        </div>
      </div>
    </section>
  );
};

const Home = () => (
  <main className="home-main">
    <HeroSection />
    <div className="section-divider"></div>
    <ServicesSection />
    <div className="section-divider"></div>
    <ProductsSection />
    <div className="section-divider"></div>
    <ReviewsSection />
    <div className="section-divider"></div>
    <AcademySection />
  </main>
);

export default Home;
