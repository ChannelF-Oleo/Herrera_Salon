import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  GraduationCap,
  Clock,
  Users,
  Star,
  BookOpen,
  Search,
  ChevronDown,
  ArrowRight,
  Award,
  Calendar,
  AlertCircle,
} from "lucide-react";
import "../../styles/CoursesList.css";

// Imagen hero para cursos
import academyImage from "../../assets/images/academy_image.jpeg";

const CoursesList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Definimos las categorías y niveles disponibles
  const categories = [
    "Todos",
    "Peluquería",
    "Manicure",
    "Spa",
    "Maquillaje",
    "Pestañas",
    "Cejas",
    "General",
  ];

  const levels = ["Todos", "Principiante", "Intermedio", "Avanzado"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesRef = collection(db, "courses");
        const q = query(coursesRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const coursesData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              startDate: data.startDate?.toDate
                ? data.startDate.toDate().toISOString()
                : new Date().toISOString(),
              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate().toISOString()
                : new Date().toISOString(),
              students: data.studentsCount || 0,
              certificate: data.includesMaterials || true,
              rating: data.rating || 5.0,
              level: data.level || "Principiante",
              category: data.category || "General",
              featured: data.featured || false,
              modules: data.modules || 4,
              image: data.image || academyImage,
            };
          });

          setCourses(coursesData);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        // Fallback sin orderBy
        try {
          const fallbackSnapshot = await getDocs(collection(db, "courses"));
          const fallbackData = fallbackSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            image: doc.data().image || academyImage,
          }));
          setCourses(fallbackData);
        } catch (fallbackError) {
          console.error("Fallback también falló", fallbackError);
          setError("Error al cargar los cursos");
          setCourses([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtrar cursos
  const filteredCourses = courses.filter((course) => {
    const title = course.title || "";
    const desc = course.description || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevel === "Todos" || course.level === selectedLevel;

    const matchesCategory =
      selectedCategory === "Todos" || course.category === selectedCategory;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLevelDropdownOpen && !event.target.closest('.level-dropdown')) {
        setIsLevelDropdownOpen(false);
      }
      if (isCategoryDropdownOpen && !event.target.closest('.category-dropdown')) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLevelDropdownOpen, isCategoryDropdownOpen]);

  const CourseCard = ({ course }) => (
    <div
      className="course-card group"
      onClick={() => navigate(`/academy/${course.id}`)}
    >
      {/* Imagen del curso */}
      <div className="course-card-image-wrapper">
        <img
          src={course.image}
          alt={course.title}
          className="course-card-image"
        />
        
        {/* Badges */}
        <div className="course-card-badges">
          {course.featured && (
            <span className="course-badge featured">
              <Star size={10} />
              Destacado
            </span>
          )}
          <span className={`course-badge level ${course.level?.toLowerCase()}`}>
            {course.level}
          </span>
        </div>

        {/* Rating */}
        <div className="course-card-rating">
          <Star size={12} />
          <span>{course.rating}</span>
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="course-card-content">
        <div className="course-card-header">
          <span className="course-card-category">{course.category}</span>
          {course.certificate && (
            <Award size={14} className="certificate-icon" />
          )}
        </div>

        <h3 className="course-card-title">{course.title}</h3>
        
        <p className="course-card-description">
          {course.description || "Curso profesional de belleza"}
        </p>

        {/* Información del curso */}
        <div className="course-card-info">
          <div className="course-info-item">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
          <div className="course-info-item">
            <BookOpen size={14} />
            <span>{course.modules} módulos</span>
          </div>
          <div className="course-info-item">
            <Users size={14} />
            <span>{course.students} estudiantes</span>
          </div>
        </div>

        {/* Instructor y fecha */}
        <div className="course-card-meta">
          <div className="meta-item">
            <Users size={12} />
            <span>Instructor: {course.instructor || "D'Galú Staff"}</span>
          </div>
          <div className="meta-item">
            <Calendar size={12} />
            <span>
              Inicia: {course.startDate
                ? new Date(course.startDate).toLocaleDateString()
                : "Próximamente"}
            </span>
          </div>
        </div>

        {/* Precio y CTA */}
        <div className="course-card-footer">
          <div className="course-card-price">
            <span className="price">${course.price}</span>
            <span className="price-label">Pago único</span>
          </div>

          <div className="course-card-cta">
            <span>Ver Detalles</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="courses-loading">
        <div className="loading-content">
          <GraduationCap className="loading-icon" size={48} />
          <h2>Cargando cursos...</h2>
          <p>Preparando nuestros cursos de belleza</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-loading">
        <div className="loading-content">
          <AlertCircle className="loading-icon" size={48} />
          <h2>Error al cargar cursos</h2>
          <p>{error}</p>
          <button 
            className="btn-secondary"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="courses-page">
      <section className="courses-content">
        <div className="container">
          {/* Header de la página */}
          <div className="courses-page-header">
            <h1 className="courses-page-title">
              Herrera Beauty <span className="title-accent">Academy</span>
            </h1>
            <p className="courses-page-subtitle">
              Desarrolla tus habilidades profesionales con nuestros cursos especializados en belleza
            </p>
          </div>

          {/* Controles de filtrado */}
          <div className="courses-controls">
            <div className="search-filter-container">
              {/* Buscador */}
              <div className="search-container">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Filtro de nivel */}
              <div className="filter-dropdown level-dropdown">
                <button
                  className="filter-button"
                  onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                >
                  <span>{selectedLevel}</span>
                  <ChevronDown 
                    size={18} 
                    className={`chevron ${isLevelDropdownOpen ? 'open' : ''}`}
                  />
                </button>

                {isLevelDropdownOpen && (
                  <div className="dropdown-menu">
                    {levels.map((level) => (
                      <button
                        key={level}
                        className={`dropdown-item ${selectedLevel === level ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedLevel(level);
                          setIsLevelDropdownOpen(false);
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filtro de categoría */}
              <div className="filter-dropdown category-dropdown">
                <button
                  className="filter-button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown 
                    size={18} 
                    className={`chevron ${isCategoryDropdownOpen ? 'open' : ''}`}
                  />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="dropdown-menu">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsCategoryDropdownOpen(false);
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
          <div className="courses-results">
            <div className="results-header">
              <h2>
                {selectedCategory === "Todos" && selectedLevel === "Todos" 
                  ? "Todos los Cursos" 
                  : `${selectedCategory} - ${selectedLevel}`}
              </h2>
              <p>{filteredCourses.length} cursos disponibles</p>
            </div>

            {/* Grid de cursos */}
            {filteredCourses.length === 0 ? (
              <div className="no-results">
                <GraduationCap size={48} />
                <h3>No se encontraron cursos</h3>
                <p>Intenta con otros términos de búsqueda o filtros</p>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedLevel("Todos");
                    setSelectedCategory("Todos");
                  }}
                >
                  Ver todos los cursos
                </button>
              </div>
            ) : (
              <div className="courses-grid">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CoursesList;