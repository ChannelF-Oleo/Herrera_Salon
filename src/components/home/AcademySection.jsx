import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  GraduationCap,
  ArrowRight,
  Clock,
  Users,
  Star,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import "../../styles/AcademySection.css";

// Imagen academy
import academyImage from "../../assets/images/academy_image.jpeg";

const AcademySection = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query mejorada: Traemos cursos activos
        const coursesQuery = query(
          collection(db, "courses"),
          where("isActive", "==", true),
          limit(3)
        );

        const snapshot = await getDocs(coursesQuery);

        if (!snapshot.empty) {
          const coursesData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              // Transformación de fechas
              startDate: data.startDate?.toDate
                ? data.startDate.toDate().toISOString()
                : new Date().toISOString(),

              // Mapeo de campos
              students: data.studentsCount || 0,

              // Valores por defecto
              rating: data.rating || 5.0,
              level: data.level || "Principiante",
              image:
                data.image ||
                academyImage,
              featured: data.featured !== undefined ? data.featured : true,
            };
          });

          console.log("🔥 Cursos Home cargados:", coursesData);
          setCourses(coursesData);
        } else {
          console.log("⚠️ No hay cursos activos en Firebase");
          setCourses([]);
        }
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
        setError("Error al cargar los cursos");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  const CourseCard = ({ course }) => (
    <div className="course-card">
      <div className="relative overflow-hidden h-48">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {course.featured && (
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              Destacado
            </span>
          )}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              course.level === "Principiante"
                ? "bg-green-100 text-green-800"
                : course.level === "Intermedio"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {course.level}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-current" />
          <span className="text-xs font-medium text-gray-700">
            {course.rating}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {course.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {course.description}
          </p>

          {/* Course info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{course.students} estudiantes</span>
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-purple-600">
              ${course.price}
            </span>
            <span className="text-xs text-gray-500">Pago único</span>
          </div>

          <button
            onClick={() => navigate(`/academy/${course.id}`)}
            className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <BookOpen size={14} />
            Ver Curso
          </button>
        </div>
      </div>
    </div>
  );

  // Estado de carga mejorado
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 animate-pulse">
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              D'Galú Academy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cargando cursos destacados...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Estado de error
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error al cargar cursos
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Sin cursos disponibles - Mostrar diseño hero sin cursos
  if (courses.length === 0) {
    return (
      <section className="academy-section">
        <div className="academy-container">
          {/* Imagen destacada a la izquierda */}
          <div className="academy-image-wrapper">
            <img 
              src={academyImage} 
              alt="Herrera Beauty Academy" 
              className="academy-image"
            />
            {/* Badge sobre la imagen */}
            <div className="academy-badge">
              <span className="badge-text">Academy</span>
            </div>
          </div>

          {/* Contenido a la derecha */}
          <div className="academy-content animate-fade-in">
            <div className="academy-header-badge">
              <span className="badge-text">Educación Profesional</span>
            </div>
            
            <h2 className="academy-title">
              Herrera Beauty
              <span className="title-accent">Academy</span>
            </h2>
            
            <p className="academy-subtitle">
              Donde el talento se encuentra con la técnica profesional
            </p>
            
            <p className="academy-description">
              Próximamente tendremos cursos especializados disponibles. 
              Desarrolla tus habilidades con expertos en belleza y obtén certificación profesional.
            </p>

            <div className="academy-indicators">
              <span className="indicator">
                <div className="indicator-dot certification"></div>
                Certificación incluida
              </span>
              <span className="indicator">
                <div className="indicator-dot practice"></div>
                Práctica real
              </span>
              <span className="indicator">
                <div className="indicator-dot expert"></div>
                Instructores expertos
              </span>
            </div>

            <div className="academy-cta-group">
              <button 
                className="btn-primary" 
                onClick={() => navigate("/academy")}
                type="button"
                aria-label="Ver academia"
              >
                <GraduationCap size={18} />
                <span>Ver Academia</span>
              </button>
              
              <button 
                className="btn-secondary" 
                onClick={() => navigate("/contact")}
                type="button"
                aria-label="Contactar para más información"
              >
                <span>Más Info</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Elementos visuales decorativos */}
        <div className="academy-visual">
          <div className="visual-element visual-circle-1"></div>
          <div className="visual-element visual-circle-2"></div>
        </div>
      </section>
    );
  }

  // Renderizado normal con cursos
  return (
    <section className="academy-section">
      <div className="academy-container">
        {/* Imagen destacada a la izquierda */}
        <div className="academy-image-wrapper">
          <img 
            src={courses[0]?.image || academyImage} 
            alt="Herrera Beauty Academy" 
            className="academy-image"
          />
          {/* Badge sobre la imagen */}
          <div className="academy-badge">
            <span className="badge-text">Academy</span>
          </div>
        </div>

        {/* Contenido a la derecha */}
        <div className="academy-content animate-fade-in">
          <div className="academy-header-badge">
            <span className="badge-text">Educación Profesional</span>
          </div>
          
          <h2 className="academy-title">
            Herrera Beauty
            <span className="title-accent">Academy</span>
          </h2>
          
          <p className="academy-subtitle">
            Donde el talento se encuentra con la técnica profesional
          </p>
          
          <p className="academy-description">
            Desarrolla tus habilidades con nuestros cursos especializados. 
            Aprende de expertos en belleza y obtén certificación profesional.
          </p>

          <div className="academy-indicators">
            <span className="indicator">
              <div className="indicator-dot certification"></div>
              Certificación incluida
            </span>
            <span className="indicator">
              <div className="indicator-dot practice"></div>
              Práctica real
            </span>
            <span className="indicator">
              <div className="indicator-dot expert"></div>
              Instructores expertos
            </span>
          </div>

          <div className="academy-cta-group">
            <button 
              className="btn-primary" 
              onClick={() => navigate("/academy")}
              type="button"
              aria-label="Ver todos los cursos"
            >
              <GraduationCap size={18} />
              <span>Ver Cursos</span>
            </button>
            
            <button 
              className="btn-secondary" 
              onClick={() => navigate("/academy/inscripcion")}
              type="button"
              aria-label="Inscribirse ahora"
            >
              <span>Inscribirse</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de cursos destacados */}
      <div className="academy-courses-preview">
        <div className="container">
          <h3 className="preview-title">Cursos Destacados</h3>
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>

      {/* Elementos visuales decorativos */}
      <div className="academy-visual">
        <div className="visual-element visual-circle-1"></div>
        <div className="visual-element visual-circle-2"></div>
      </div>
    </section>
  );
};

export default AcademySection;
