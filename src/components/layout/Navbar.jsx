// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../common/NotificationBell";
import CartIcon from "../cart/CartIcon";
import "../../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función helper para navegación con scroll
  const navigateWithScroll = (path) => {
    navigate(path);
    // Pequeño delay para asegurar que la navegación se complete antes del scroll
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const navItems = [
    { name: "Servicios", path: "/services" },
    { name: "Productos", path: "/products" },
    { name: "Academy", path: "/academy" },
    { name: "Galería", path: "/gallery" },
    { name: "Nosotros", path: "/about" },
  ];

  return (
    <nav className={`navbar-fixed ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          {/* LOGO */}
          <button onClick={() => navigateWithScroll("/")} className="navbar-logo">
            Herrera Beauty Studio
          </button>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigateWithScroll(item.path)}
                className="nav-link group"
              >
                {item.name}
                <span className="nav-link-indicator"></span>
              </button>
            ))}

            {/* NOTIFICACIONES */}
            <NotificationBell />

            {/* CARRITO - Usa el contexto directamente */}
            <CartIcon />

            {/* CTA DESKTOP */}
            <a
              href="https://wa.me/18297050408?text=¡Buenas!%20Me%20gustaría%20agendar%20una%20cita"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-nav-cta"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Agendar</span>
            </a>

            {/* LOGIN DESKTOP */}

          </div>

          {/* BOTON_MENU_MOVIL */}
          <div className="md:hidden flex items-center gap-3">
            {/* Notificaciones móvil */}
            <NotificationBell />
            
            {/* Carrito móvil */}
            <CartIcon />
            
            {/* Botón menú */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-btn"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOVIL */}
      <div className={`mobile-menu-dropdown ${isOpen ? "open" : ""}`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigateWithScroll(item.path);
                setIsOpen(false);
              }}
              className="mobile-nav-link"
            >
              {item.name}
            </button>
          ))}

          {/* Separador */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* CTA MOBILE */}
          <a
            href="https://wa.me/18297050408?text=¡Buenas!%20Me%20gustaría%20agendar%20una%20cita"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-nav-cta w-full mt-4"
            onClick={() => setIsOpen(false)}
          >
            <MessageCircle className="w-5 h-5" />
            Agendar Cita
          </a>
        </div>
      </div>

      {/* El carrito se renderiza globalmente en App.jsx */}
    </nav>
  );
};

export default Navbar;