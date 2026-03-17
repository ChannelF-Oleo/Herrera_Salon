import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import CourseEnrollmentModal from "../../components/ui/CourseEnrollmentModal";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award,
  Calendar,
  User,
  CheckCircle,
  PlayCircle,
  Download,
  MessageCircle,
  AlertCircle
} from "lucide-react";
import "../../styles/CourseDetail.css";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState(null);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener curso de Firebase
        const courseDoc = await getDoc(doc(db, 'courses', id));
        
        if (courseDoc.exists()) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() };
          setCourse(courseData);
          
          // Verificar si el usuario ya está inscrito
          if (user) {
            await checkEnrollmentStatus(courseData.id, user.uid);
          }
        } else {
          setError('Curso no encontrado');
          setCourse(null);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Error al cargar el curso. Por favor intenta de nuevo.');
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate, user]);

  // Verificar si el usuario ya está inscrito (por email si no está autenticado)
  const checkEnrollmentStatus = async (courseId, userId) => {
    try {
      setCheckingEnrollment(true);
      const enrollmentsRef = collection(db, 'course_enrollments');
      const q = query(
        enrollmentsRef,
        where('courseId', '==', courseId),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      setIsEnrolled(!snapshot.empty);
    } catch (err) {
      console.error('Error checking enrollment:', err);
    } finally {
      setCheckingEnrollment(false);
    }
  };

  const handleEnrollClick = () => {
    // Abrir modal de inscripción
    setShowEnrollmentModal(true);
  };

  const handleEnrollSubmit = async (formData) => {
    try {
      setEnrolling(true);
      setError(null);

      // Verificar si ya existe inscripción con este email
      const enrollmentsRef = collection(db, 'course_enrollments');
      const q = query(
        enrollmentsRef,
        where('courseId', '==', course.id),
        where('userEmail', '==', formData.email)
      );
      const existingEnrollment = await getDocs(q);
      
      if (!existingEnrollment.empty) {
        throw new Error('Este email ya está inscrito en el curso');
      }
      
      // Crear inscripción en Firebase
      const enrollmentData = {
        courseId: course.id,
        courseTitle: course.title,
        userId: user?.uid || 'guest',
        userEmail: formData.email,
        userName: formData.fullName,
        userPhone: formData.phone,
        enrolledAt: serverTimestamp(),
        status: 'pending', // pending hasta que se confirme el pago
        paymentStatus: 'pending',
        price: course.price || 0,
      };

      const enrollmentRef = await addDoc(enrollmentsRef, enrollmentData);

      console.log('Enrollment created successfully:', enrollmentRef.id);

      // Nota: Email de confirmación se enviará manualmente por el administrador
      console.log('Enrollment confirmation will be sent manually by admin');

      setIsEnrolled(true);
      setShowEnrollmentModal(false);
      
      // Mostrar mensaje de éxito
      alert(`¡Inscripción exitosa!\n\nTu inscripción ha sido registrada exitosamente.\n\nNos pondremos en contacto contigo pronto para coordinar el pago y enviarte los detalles del curso.`);
      
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setError(error.message || 'Error al inscribirse. Por favor intenta de nuevo.');
      alert(error.message || 'Error al inscribirse. Por favor intenta de nuevo.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="course-detail__loading">
        <div className="course-detail__loading-container">
          <div className="course-detail__skeleton">
            <div className="skeleton" style={{ width: '8rem', height: '2rem', marginBottom: '1.5rem' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '16rem', marginBottom: '1.5rem' }}></div>
            <div className="skeleton" style={{ width: '75%', height: '2rem', marginBottom: '1rem' }}></div>
            <div className="skeleton" style={{ width: '50%', height: '1rem', marginBottom: '1.5rem' }}></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div>
                <div className="skeleton" style={{ width: '100%', height: '8rem', marginBottom: '1rem' }}></div>
                <div className="skeleton" style={{ width: '100%', height: '8rem' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail__error">
        <div className="course-detail__error-content">
          <AlertCircle className="course-detail__error-icon" size={48} />
          <h1 className="course-detail__error-title">
            {error || 'Curso no encontrado'}
          </h1>
          <p className="course-detail__error-description">
            El curso que buscas no está disponible o no existe.
          </p>
          <button
            onClick={() => navigate('/academy')}
            className="course-detail__error-btn"
          >
            Volver a la Academia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail">
      <div className="course-detail__container">
        {/* Back button */}
        <button
          onClick={() => navigate('/academy')}
          className="course-detail__back-btn"
        >
          <ArrowLeft size={20} />
          Volver a la Academia
        </button>

        <div className="course-detail__card">
          {/* Hero Section */}
          <div className="course-detail__hero">
            <img
              src={course.image}
              alt={course.title}
              className="course-detail__hero-image"
            />
            <div className="course-detail__hero-overlay"></div>
            <div className="course-detail__hero-content">
              <div className="course-detail__badges">
                <span className="course-detail__badge course-detail__badge--category">
                  {course.category}
                </span>
                <span className={`course-detail__badge course-detail__badge--level ${
                  course.level === 'Principiante' ? 'beginner' :
                  course.level === 'Intermedio' ? 'intermediate' :
                  'advanced'
                }`}>
                  {course.level}
                </span>
                {course.certificate && (
                  <Award size={20} className="text-yellow-400" />
                )}
              </div>
              <h1 className="course-detail__title">{course.title}</h1>
              <div className="course-detail__meta">
                <div className="course-detail__meta-item">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span>{course.rating} ({course.students} estudiantes)</span>
                </div>
                <div className="course-detail__meta-item">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="course-detail__meta-item">
                  <BookOpen size={16} />
                  <span>{course.modules} módulos</span>
                </div>
              </div>
            </div>
          </div>

          <div className="course-detail__content">
            {/* Main Content */}
            <div className="course-detail__main">
              {/* Description */}
              <section className="course-detail__section">
                <h2 className="course-detail__section-title">Descripción del Curso</h2>
                <p className="course-detail__description">{course.description}</p>
              </section>

              {/* Curriculum */}
              <section className="course-detail__section">
                <h2 className="course-detail__section-title">Temario del Curso</h2>
                <div className="course-detail__curriculum">
                  {course.curriculum?.map((module, index) => (
                    <div key={index} className="course-detail__module">
                      <div className="course-detail__module-header">
                        <h3 className="course-detail__module-title">
                          Módulo {module.module}: {module.title}
                        </h3>
                        <span className="course-detail__module-duration">{module.duration}</span>
                      </div>
                      <ul className="course-detail__module-topics">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="course-detail__module-topic">
                            <CheckCircle size={14} />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Requirements */}
              {course.requirements && (
                <section className="course-detail__section">
                  <h2 className="course-detail__section-title">Requisitos</h2>
                  <ul className="course-detail__list">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="course-detail__list-item course-detail__list-item--requirement">
                        <CheckCircle size={16} />
                        {req}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Benefits */}
              {course.benefits && (
                <section className="course-detail__section">
                  <h2 className="course-detail__section-title">Beneficios Incluidos</h2>
                  <ul className="course-detail__list">
                    {course.benefits.map((benefit, index) => (
                      <li key={index} className="course-detail__list-item course-detail__list-item--benefit">
                        <CheckCircle size={16} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Instructor */}
              <section className="course-detail__section">
                <h2 className="course-detail__section-title">Instructor</h2>
                <div className="course-detail__instructor">
                  <img
                    src={course.instructorImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80'}
                    alt={course.instructor}
                    className="course-detail__instructor-image"
                  />
                  <div className="course-detail__instructor-info">
                    <h3>{course.instructor}</h3>
                    <p>{course.instructorBio}</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="course-detail__sidebar">
              <div className="course-detail__sidebar-card">
                {/* Price */}
                <div className="course-detail__price-section">
                  <div className="course-detail__price">
                    ${course.price}
                  </div>
                  <div className="course-detail__price-label">Pago único</div>
                </div>

                {/* Course Info */}
                <div className="course-detail__info-list">
                  <div className="course-detail__info-item">
                    <Calendar size={16} />
                    <div className="course-detail__info-item-content">
                      <div className="course-detail__info-item-label">Inicio</div>
                      <div className="course-detail__info-item-value">{new Date(course.startDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  {course.schedule && (
                    <div className="course-detail__info-item">
                      <Clock size={16} />
                      <div className="course-detail__info-item-content">
                        <div className="course-detail__info-item-label">Horario</div>
                        <div className="course-detail__info-item-value">{course.schedule}</div>
                      </div>
                    </div>
                  )}

                  <div className="course-detail__info-item">
                    <Users size={16} />
                    <div className="course-detail__info-item-content">
                      <div className="course-detail__info-item-label">Estudiantes</div>
                      <div className="course-detail__info-item-value">{course.students} inscritos</div>
                    </div>
                  </div>

                  <div className="course-detail__info-item">
                    <BookOpen size={16} />
                    <div className="course-detail__info-item-content">
                      <div className="course-detail__info-item-label">Duración</div>
                      <div className="course-detail__info-item-value">{course.duration}</div>
                    </div>
                  </div>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={handleEnrollClick}
                  disabled={enrolling || isEnrolled}
                  className={`course-detail__enroll-btn ${
                    isEnrolled
                      ? 'course-detail__enroll-btn--enrolled'
                      : enrolling
                      ? 'course-detail__enroll-btn--disabled'
                      : 'course-detail__enroll-btn--primary'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle size={20} />
                      Inscrito
                    </>
                  ) : enrolling ? (
                    'Inscribiendo...'
                  ) : (
                    'Inscribirse Ahora'
                  )}
                </button>

                <p className="course-detail__enroll-note">
                  Completa el formulario de inscripción
                </p>

                {/* Contact */}
                <div className="course-detail__contact">
                  <h3>¿Tienes preguntas?</h3>
                  <button className="course-detail__contact-btn">
                    <MessageCircle size={16} />
                    Contactar instructor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <CourseEnrollmentModal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        onSubmit={handleEnrollSubmit}
        course={course}
        loading={enrolling}
      />
    </div>
  );
};

export default CourseDetail;
