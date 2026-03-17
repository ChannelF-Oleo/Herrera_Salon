// src/pages/Services/ServiceDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigateWithScroll } from "../../hooks/useNavigateWithScroll";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { 
  ArrowLeft, Clock, MessageCircle, Sparkles, Star, DollarSign
} from "lucide-react";


const ServiceDetail = () => {
  const { id } = useParams();
  const navigateWithScroll = useNavigateWithScroll();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubservice, setSelectedSubservice] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        console.log("Fetching service with ID:", id);
        const docRef = doc(db, "services", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const serviceData = { id: docSnap.id, ...docSnap.data() };
          console.log("Service data loaded:", serviceData);
          setService(serviceData);
          
          // Si hay subservicios, seleccionar el primero por defecto
          if (serviceData.subservices && serviceData.subservices.length > 0) {
            setSelectedSubservice(serviceData.subservices[0]);
          }
        } else {
          console.log("Service not found with ID:", id);
          setError("El servicio no existe o fue eliminado.");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(`Error al cargar la información: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    } else {
      console.error("No service ID provided");
      setError("ID de servicio no proporcionado");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--champagne-light)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--soft-bronze)' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'var(--champagne-light)' }}>
        <div className="text-xl font-bold mb-2" style={{ color: 'var(--soft-bronze)' }}>Error</div>
        <p className="text-muted mb-6">{error}</p>
        <button 
          onClick={() => navigateWithScroll("/services")} 
          className="btn-primary"
        >
          Volver a Servicios
        </button>
      </div>
    );
  }

  // Función para manejar reserva por WhatsApp
  const handleBookService = (subservice = null) => {
    const serviceName = subservice ? `${service.name} - ${subservice.name}` : service.name;
    const message = `¡Buenas! Me gustaría agendar una cita para ${serviceName}`;
    const whatsappUrl = `https://wa.me/18297050408?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen pt-20 pb-8" style={{ backgroundColor: 'var(--champagne-light)' }}>
      <div className="container">
        {/* Botón Volver */}
        <button 
          onClick={() => navigateWithScroll("/services")} 
          className="flex items-center mb-6 transition-colors text-secondary hover:text-primary"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a servicios
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal - Información del Servicio */}
          <div className="lg:col-span-2">
            <div className="card-base">
              {/* Header con Imagen */}
              <div className="relative h-64 md:h-80" style={{ backgroundColor: 'var(--champagne-dark)' }}>
                {service.image ? (
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted">
                    <span className="text-lg">Sin imagen disponible</span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span 
                    className="px-4 py-1.5 backdrop-blur font-bold rounded-full shadow-sm text-sm uppercase tracking-wide"
                    style={{ 
                      backgroundColor: 'var(--glass-bg)',
                      color: 'var(--soft-bronze)',
                      border: '1px solid var(--glass-border)'
                    }}
                  >
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div style={{ padding: 'var(--section-padding)' }}>
                <div className="mb-8">
                  <h1 className="text-display text-primary mb-2" style={{ fontSize: 'var(--font-size-4xl)' }}>
                    {service.name}
                  </h1>
                  <p className="text-muted" style={{ fontSize: 'var(--font-size-lg)' }}>
                    {service.description || "Servicio de belleza profesional"}
                  </p>
                </div>

                {/* Información básica */}
                <div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 rounded-xl"
                  style={{ backgroundColor: 'var(--champagne)' }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: 'var(--glass-bg)',
                        color: 'var(--soft-bronze)'
                      }}
                    >
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Duración base</p>
                      <p className="font-semibold text-primary">{service.duration || 60} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: 'var(--glass-bg)',
                        color: 'var(--soft-bronze)'
                      }}
                    >
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Desde</p>
                      <p className="font-semibold text-primary">${service.basePrice || service.price || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: 'var(--glass-bg)',
                        color: 'var(--soft-bronze)'
                      }}
                    >
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Variantes</p>
                      <p className="font-semibold text-primary">{service.subservices?.length || 1}</p>
                    </div>
                  </div>
                </div>

                {/* Botón de reserva general */}
                {(!service.subservices || service.subservices.length === 0) && (
                  <button
                    onClick={() => handleBookService()}
                    className="btn-primary w-full py-4 px-6 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Agendar por WhatsApp
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Columna Lateral - Subservicios */}
          <div className="lg:col-span-1">
            <div className="card-base p-6 sticky top-8">
              <h2 className="text-display text-primary mb-6 flex items-center gap-2" style={{ fontSize: 'var(--font-size-xl)' }}>
                <Star className="text-secondary" size={20} />
                {service.subservices && service.subservices.length > 0 ? 'Elige tu variante' : 'Información'}
              </h2>

              {service.subservices && service.subservices.length > 0 ? (
                <div className="space-y-4">
                  {service.subservices.map((subservice, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedSubservice?.name === subservice.name
                          ? 'border-secondary'
                          : 'border-gray-200 hover:border-secondary'
                      }`}
                      style={{
                        backgroundColor: selectedSubservice?.name === subservice.name 
                          ? 'var(--champagne)' 
                          : 'transparent',
                        borderColor: selectedSubservice?.name === subservice.name 
                          ? 'var(--soft-bronze)' 
                          : 'var(--glass-border)'
                      }}
                      onClick={() => setSelectedSubservice(subservice)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-primary" style={{ fontSize: 'var(--font-size-sm)' }}>
                          {subservice.name}
                        </h3>
                        <span className="text-secondary font-bold" style={{ fontSize: 'var(--font-size-sm)' }}>
                          ${subservice.price}
                        </span>
                      </div>
                      
                      {subservice.description && (
                        <p className="text-muted mb-2" style={{ fontSize: 'var(--font-size-xs)' }}>
                          {subservice.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {subservice.duration || 20} min
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Botón de reserva para subservicio seleccionado */}
                  {selectedSubservice && (
                    <button
                      onClick={() => handleBookService(selectedSubservice)}
                      className="btn-primary w-full py-3 px-4 flex items-center justify-center gap-2 mt-6"
                    >
                      <MessageCircle size={18} />
                      Agendar - ${selectedSubservice.price}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted">
                  <p className="mb-4">Este servicio no tiene variantes específicas.</p>
                  <button
                    onClick={() => handleBookService()}
                    className="btn-primary w-full py-3 px-4 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Agendar por WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
