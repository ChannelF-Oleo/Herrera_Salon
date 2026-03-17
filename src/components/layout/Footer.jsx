// src/components/Footer.jsx

import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Clock,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Servicios", path: "/services" },
    { name: "Productos", path: "/products" },
    { name: "Academy", path: "/academy" },
    { name: "Nosotros", path: "/about" },
    { name: "Blog", path: "/blog" }, // futura página
    { name: "Login / Admin", path: "/login" },
  ];

  // Función para navegar y hacer scroll al top
  const handleNavigation = (path) => {
    navigate(path);
    // Scroll suave al top después de la navegación
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Función para abrir FireForgeRD
  const handleFireForgeClick = () => {
    window.open('https://fireforgerd.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer-main">
      <div className="footer-container">
        {/* GRID */}
        <div className="footer-grid">
          {/* --- CONTACTO --- */}
          <div className="footer-section">
            <h3>Contacta tu Cita</h3>

            <div className="contact-info">
              <div className="contact-item">
                <MapPin className="contact-icon" />
                <span>
                  Av. Nicolas de Ovando, al lado de De La Cruz L. Auto Import,
                  <br className="hidden sm:block" />
                  Santo Domingo.
                </span>
              </div>

              <div className="contact-item">
                <Phone className="contact-icon" />
                <a href="tel:+18297050408">
                  829-705-0408
                </a>
              </div>

              <div className="contact-item">
                <Mail className="contact-icon" />
                <a href="mailto:info@herrerabeautystudio.com">
                  info@herrerabeautystudio.com
                </a>
              </div>
            </div>
          </div>

          {/* --- NAVEGACIÓN --- */}
          <div className="footer-section">
            <h3>Navegación</h3>

            <ul className="nav-links">
              {quickLinks.map((link, index) => (
                <li key={index} className="nav-link-item">
                  <button onClick={() => handleNavigation(link.path)}>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* --- HORARIO + REDES --- */}
          <div className="footer-section">
            <h3>Horario & Social</h3>

            <div className="schedule-item">
              <Clock className="contact-icon" />
              <span>Mar - Sab: 9:00 AM - 7:00 PM</span>
            </div>

            <div className="social-links">
              <a
                href="https://www.instagram.com/herrera_beautystudio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram - Herrera Beauty Studio"
                className="social-link"
              >
                <Instagram className="social-icon" />
              </a>
              <a
                href="https://www.tiktok.com/@herreramakeupstudio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok - Herrera Makeup Studio"
                className="social-link"
              >
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* --- MAPA --- */}
          <div className="footer-section">
            <h3>Encuéntranos</h3>

            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.565360544254!2d-69.90305782653819!3d18.503336682586898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89fa2688eca7%3A0x87d8eecaac0aeae6!2sHerrera%20Makeup%20Studio!5e0!3m2!1ses!2sdo!4v1773010015424!5m2!1ses!2sdo"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Herrera Beauty Studio"
                className="map-iframe"
              ></iframe>
            </div>

            <p className="map-description">
              Visítanos en nuestro estudio de belleza profesional. 💄
            </p>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="footer-copyright">
          <Heart className="heart-icon" />
          © {currentYear} Herrera Beauty Studio. Todos los derechos reservados. |{" "}
          Desarrollado con 🔥 por{" "}
          <button 
            onClick={handleFireForgeClick}
            className="fireforge-link"
            aria-label="Visitar FireForgeRD"
          >
            FireForgeRD
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;