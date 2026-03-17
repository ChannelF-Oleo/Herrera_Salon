import { useEffect } from "react";
import "./ReviewsSection.css";

const ReviewsSection = () => {
  useEffect(() => {
    // Cargar el script de Elfsight si no está ya cargado
    if (!window.elfsight) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <h2 className="reviews-title">Lo que dicen nuestros clientes</h2>
        
        <div className="reviews-widget-wrapper">
          <div 
            className="elfsight-app-d172f99b-b8a6-4a67-9cb5-979b17209c50" 
            data-elfsight-app-lazy
          ></div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;