import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Users,
  Edit2,
  Package,
  Clock,
} from "lucide-react";
import {
  collection,
  query,
  getDocs,
  orderBy,
  Timestamp,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase"; // Ajusta ruta segun tu estructura
import { hasPermission } from "../utils/rolePermissions"; // Ajusta ruta
import CourseModal from "../components/ui/CourseModal";
import StudentModal from "../components/ui/StudentModal";
import "../styles/global-variables.css";
import "./AcademyView.css";

const AcademyView = ({ userRole }) => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");

  // --- Estados para Modales ---
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const canManage = hasPermission(userRole, "canManageCourses");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Cursos
      const coursesRef = collection(db, "courses");
      const coursesQuery = query(coursesRef, orderBy("createdAt", "desc"));
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesData = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);

      // Fetch Estudiantes
      const studentsRef = collection(db, "students");
      const studentsSnapshot = await getDocs(studentsRef);
      const studentsData = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers para Cursos ---
  const handleOpenCourseModal = (course = null) => {
    setEditingItem(course);
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (courseData) => {
    try {
      const payload = {
        ...courseData,
        updatedAt: serverTimestamp(),
        startDate: courseData.startDate
          ? Timestamp.fromDate(new Date(courseData.startDate))
          : null,
      };

      if (editingItem) {
        await updateDoc(doc(db, "courses", editingItem.id), payload);
      } else {
        payload.createdAt = serverTimestamp();
        payload.studentsCount = 0;
        await addDoc(collection(db, "courses"), payload);
      }
      await fetchData();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Error al guardar el curso");
    }
  };

  // --- Handlers para Estudiantes ---
  const handleOpenStudentModal = (student = null) => {
    setEditingItem(student);
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      const payload = {
        ...studentData,
        updatedAt: serverTimestamp(),
        enrolledAt: serverTimestamp(),
      };

      // Denormalizar nombre del curso para mostrarlo fácil en tabla
      const course = courses.find((c) => c.id === studentData.courseId);
      if (course) payload.courseName = course.title;

      if (editingItem) {
        await updateDoc(doc(db, "students", editingItem.id), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, "students"), payload);
      }
      await fetchData();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  return (
    <div className="academy-view">
      {/* Header */}
      <div className="academy-view__header">
        <div className="academy-view__header-content">
          <h1 className="academy-view__title">
            <GraduationCap className="academy-view__title-icon" />
            Herrera Academy
          </h1>
          <p className="academy-view__subtitle">
            Gestión profesional de cursos y alumnado
          </p>
        </div>

        {canManage && (
          <button
            onClick={() =>
              activeTab === "courses"
                ? handleOpenCourseModal()
                : handleOpenStudentModal()
            }
            className="academy-view__add-btn"
          >
            <Plus size={20} />
            {activeTab === "courses" ? "Nuevo Curso" : "Nuevo Estudiante"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="academy-view__tabs">
        <button
          onClick={() => setActiveTab("courses")}
          className={`academy-view__tab ${
            activeTab === "courses" ? "academy-view__tab--active" : ""
          }`}
        >
          Cursos
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`academy-view__tab ${
            activeTab === "students" ? "academy-view__tab--active" : ""
          }`}
        >
          Estudiantes
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="academy-view__loading">
          <div className="academy-view__spinner"></div>
        </div>
      ) : activeTab === "courses" ? (
        <div className="academy-view__courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="academy-view__course-card">
              <div className="academy-view__course-header">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="academy-view__course-image"
                  />
                ) : (
                  <div className="academy-view__course-placeholder">
                    <GraduationCap size={48} />
                  </div>
                )}
                <div className="academy-view__course-badges">
                  <span className="academy-view__course-badge">
                    {course.modality || "Presencial"}
                  </span>
                </div>
              </div>

              <div className="academy-view__course-content">
                <div className="academy-view__course-title-section">
                  <h3 className="academy-view__course-title" title={course.title}>
                    {course.title}
                  </h3>
                  <span className="academy-view__course-price">
                    RD$ {course.price}
                  </span>
                </div>

                <p className="academy-view__course-description">
                  {course.description}
                </p>

                <div className="academy-view__course-info">
                  <div className="academy-view__course-info-item">
                    <Clock size={16} />
                    <span className="academy-view__course-info-text">
                      {course.schedule || "Horario pendiente"}
                    </span>
                  </div>
                  <div className="academy-view__course-info-row">
                    <div className="academy-view__course-info-item">
                      <Users size={16} />
                      <span>
                        Cupo: {course.studentsCount || 0}/
                        {course.capacity || "∞"}
                      </span>
                    </div>
                    {course.includesMaterials && (
                      <div className="academy-view__materials-badge">
                        <Package size={12} /> Materiales
                      </div>
                    )}
                  </div>
                </div>

                {canManage && (
                  <button
                    onClick={() => handleOpenCourseModal(course)}
                    className="academy-view__edit-btn"
                  >
                    <Edit2 size={16} /> Editar Curso
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Tabla de Estudiantes
        <div className="academy-view__students-table">
          <table className="academy-view__table">
            <thead className="academy-view__table-header">
              <tr>
                <th className="academy-view__table-th">Estudiante</th>
                <th className="academy-view__table-th">Curso</th>
                <th className="academy-view__table-th">Estado</th>
                <th className="academy-view__table-th academy-view__table-th--right">Acción</th>
              </tr>
            </thead>
            <tbody className="academy-view__table-body">
              {students.map((student) => (
                <tr key={student.id} className="academy-view__table-row">
                  <td className="academy-view__table-td academy-view__table-td--name">
                    {student.name}
                  </td>
                  <td className="academy-view__table-td">{student.courseName}</td>
                  <td className="academy-view__table-td">
                    <span
                      className={`academy-view__status-badge ${
                        student.paymentStatus === "paid"
                          ? "academy-view__status-badge--paid"
                          : "academy-view__status-badge--pending"
                      }`}
                    >
                      {student.paymentStatus === "paid"
                        ? "Pagado"
                        : "Pendiente"}
                    </span>
                  </td>
                  <td className="academy-view__table-td academy-view__table-td--right">
                    <button
                      onClick={() => handleOpenStudentModal(student)}
                      className="academy-view__table-btn"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales Integrados */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => {
          setIsCourseModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveCourse}
        editingCourse={editingItem}
      />
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveStudent}
        editingStudent={editingItem}
        availableCourses={courses}
        userRole={userRole}
      />
    </div>
  );
};

export default AcademyView;
