import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Clock,
  MapPin,
  Package,
  Users,
  Tag,
  Layers,
  Star,
  AlertCircle,
  Plus,
  Trash2,
  BookOpen,
} from "lucide-react";
import Portal from "./Portal";
import ImageUploader from "../shared/ImageUploader";
import { createCourseSchema } from "../../types/schemas";
import "../../styles/CourseModal.css";

const CourseModal = ({ isOpen, onClose, onSave, editingCourse }) => {
  // Estado inicial con TODOS los campos necesarios
  const initialFormState = {
    title: "",
    description: "",
    instructor: "",
    instructorBio: "",
    price: "",
    duration: "",
    startDate: "",
    image: null,
    // Campos nuevos integrados
    schedule: "",
    modality: "Presencial",
    includesMaterials: false,
    capacity: 10,
    // Campos FALTANTES agregados ahora
    category: "General",
    level: "Principiante",
    modules: 4,
    featured: false,
    // Curriculum/Temario
    curriculum: [
      {
        module: 1,
        title: "Introducción",
        duration: "2 horas",
        topics: ["Conceptos básicos", "Herramientas necesarias"]
      }
    ],
    // Campos adicionales para vista detallada
    requirements: [],
    benefits: [],
    rating: 5.0,
    students: 0,
    certificate: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Funciones para manejar curriculum
  const addCurriculumModule = () => {
    const newModule = {
      module: formData.curriculum.length + 1,
      title: "",
      duration: "",
      topics: [""]
    };
    setFormData({
      ...formData,
      curriculum: [...formData.curriculum, newModule]
    });
  };

  const removeCurriculumModule = (index) => {
    const newCurriculum = formData.curriculum.filter((_, i) => i !== index);
    // Reordenar números de módulo
    const reorderedCurriculum = newCurriculum.map((module, i) => ({
      ...module,
      module: i + 1
    }));
    setFormData({
      ...formData,
      curriculum: reorderedCurriculum
    });
  };

  const updateCurriculumModule = (index, field, value) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[index] = {
      ...newCurriculum[index],
      [field]: value
    };
    setFormData({
      ...formData,
      curriculum: newCurriculum
    });
  };

  const addTopicToModule = (moduleIndex) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].topics.push("");
    setFormData({
      ...formData,
      curriculum: newCurriculum
    });
  };

  const removeTopicFromModule = (moduleIndex, topicIndex) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].topics = newCurriculum[moduleIndex].topics.filter((_, i) => i !== topicIndex);
    setFormData({
      ...formData,
      curriculum: newCurriculum
    });
  };

  const updateTopicInModule = (moduleIndex, topicIndex, value) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].topics[topicIndex] = value;
    setFormData({
      ...formData,
      curriculum: newCurriculum
    });
  };

  // Listas de opciones
  const categories = [
    "Peluquería",
    "Manicure",
    "Spa",
    "Maquillaje",
    "Pestañas",
    "Cejas",
    "Barbería",
    "General",
  ];

  const levels = ["Principiante", "Intermedio", "Avanzado"];

  useEffect(() => {
    if (editingCourse) {
      // Si estamos editando, rellenamos con datos existentes o defaults si faltan
      setFormData({
        ...initialFormState, // Asegura que no queden campos undefined
        ...editingCourse,
        // Manejo seguro de fechas de Firebase
        startDate: editingCourse.startDate?.toDate
          ? editingCourse.startDate.toDate().toISOString().split("T")[0]
          : editingCourse.startDate || "",
      });
    } else {
      // Resetear formulario para nuevo curso
      setFormData(initialFormState);
    }
  }, [editingCourse, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      // Convertir todos los números correctamente antes de validar
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        capacity: parseInt(formData.capacity) || 10,
        modules: parseInt(formData.modules) || 1,
        studentsCount: editingCourse?.studentsCount || 0,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
      };

      // Validar con Zod (sin campos auto-generados)
      const validationData = {
        title: dataToSave.title,
        description: dataToSave.description,
        instructor: dataToSave.instructor,
        price: dataToSave.price,
        duration: dataToSave.duration,
        startDate: dataToSave.startDate,
        schedule: dataToSave.schedule,
        modality: dataToSave.modality,
        includesMaterials: dataToSave.includesMaterials,
        capacity: dataToSave.capacity,
        category: dataToSave.category,
        level: dataToSave.level,
        modules: dataToSave.modules,
        featured: dataToSave.featured,
        studentsCount: dataToSave.studentsCount,
        isActive: dataToSave.isActive,
        image: dataToSave.image || '',
      };

      // Validación básica manual (Zod schema necesita ajustes)
      if (!validationData.title || validationData.title.trim().length < 3) {
        throw new Error('El título debe tener al menos 3 caracteres');
      }
      if (!validationData.description || validationData.description.trim().length < 10) {
        throw new Error('La descripción debe tener al menos 10 caracteres');
      }
      if (validationData.price < 0) {
        throw new Error('El precio debe ser mayor o igual a 0');
      }
      if (validationData.capacity < 1) {
        throw new Error('La capacidad debe ser al menos 1');
      }

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Error al guardar curso:", error);
      setErrors({ general: error.message || 'Error al guardar el curso' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="course-modal">
        <div className="course-modal__container">
          <div className="course-modal__header">
            <h2 className="course-modal__title">
              {editingCourse ? "Editar Curso" : "Crear Nuevo Curso"}
            </h2>
            <button
              onClick={onClose}
              className="course-modal__close-btn"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="course-modal__form">
            {/* Mostrar errores generales */}
            {errors.general && (
              <div className="course-modal__error">
                <AlertCircle className="course-modal__error-icon" size={20} />
                <div>
                  <p className="course-modal__error-title">Error</p>
                  <p className="course-modal__error-message">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Sección Imagen */}
            <div className="course-modal__image-section">
              <label className="course-modal__label">
                Portada del Curso
              </label>
              <ImageUploader
                folder="courses"
                currentImage={formData.image}
                onUpload={(url) => setFormData({ ...formData, image: url })}
              />
            </div>

            {/* Información Principal */}
            <div className="course-modal__grid">
              {/* Título */}
              <div className="course-modal__field course-modal__field--full">
                <label className="course-modal__label">
                  Nombre del Curso
                </label>
                <input
                  type="text"
                  required
                  className="course-modal__input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Categoría y Nivel (NUEVOS) */}
              <div className="course-modal__field">
                <label className="course-modal__label course-modal__label--icon">
                  <Tag size={16} /> Categoría
                </label>
                <select
                  className="course-modal__select"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="course-modal__field">
                <label className="course-modal__label course-modal__label--icon">
                  <Layers size={16} /> Nivel
                </label>
                <select
                  className="course-modal__select"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div className="course-modal__field course-modal__field--full">
                <label className="course-modal__label">
                  Descripción
                </label>
                <textarea
                  rows="3"
                  className="course-modal__textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Campos Específicos */}
              <div className="course-modal__field">
                <label className="course-modal__label course-modal__label--icon">
                  <MapPin size={16} /> Modalidad
                </label>
                <select
                  className="course-modal__select"
                  value={formData.modality}
                  onChange={(e) =>
                    setFormData({ ...formData, modality: e.target.value })
                  }
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <div className="course-modal__field">
                <label className="course-modal__label course-modal__label--icon">
                  <Clock size={16} /> Horario
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lun y Mié 6pm - 9pm"
                  required
                  className="course-modal__input"
                  value={formData.schedule}
                  onChange={(e) =>
                    setFormData({ ...formData, schedule: e.target.value })
                  }
                />
              </div>

              <div className="course-modal__field">
                <label className="course-modal__label course-modal__label--icon">
                  <Users size={16} /> Cupo Máximo
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  className="course-modal__input"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                />
              </div>

              <div className="course-modal__field">
                <label className="course-modal__label course-modal__label--icon">
                  <Layers size={16} /> Cant. Módulos
                </label>
                <input
                  type="number"
                  min="1"
                  className="course-modal__input"
                  value={formData.modules}
                  onChange={(e) =>
                    setFormData({ ...formData, modules: e.target.value })
                  }
                />
              </div>

              {/* Checkboxes: Materiales y Destacado */}
              <div className="course-modal__field course-modal__field--full">
                <div className="course-modal__checkboxes">
                  <div className="course-modal__checkbox-group course-modal__checkbox-group--materials">
                    <input
                      type="checkbox"
                      id="materials"
                      className="course-modal__checkbox"
                      checked={formData.includesMaterials}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          includesMaterials: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="materials"
                      className="course-modal__checkbox-label"
                    >
                      <Package size={18} />
                      Incluye Materiales
                    </label>
                  </div>

                  <div className="course-modal__checkbox-group course-modal__checkbox-group--featured">
                    <input
                      type="checkbox"
                      id="featured"
                      className="course-modal__checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                    />
                    <label
                      htmlFor="featured"
                      className="course-modal__checkbox-label"
                    >
                      <Star size={18} />
                      Destacado en Home
                    </label>
                  </div>
                </div>
              </div>

              {/* Resto de campos estándar */}
              <div className="course-modal__field">
                <label className="course-modal__label">
                  Precio (RD$)
                </label>
                <input
                  type="number"
                  required
                  className="course-modal__input"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div className="course-modal__field">
                <label className="course-modal__label">
                  Instructor
                </label>
                <input
                  type="text"
                  className="course-modal__input"
                  value={formData.instructor}
                  onChange={(e) =>
                    setFormData({ ...formData, instructor: e.target.value })
                  }
                />
              </div>

              <div className="course-modal__field">
                <label className="course-modal__label">
                  Duración (Texto)
                </label>
                <input
                  type="text"
                  placeholder="Ej: 4 Semanas"
                  className="course-modal__input"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </div>

              <div className="course-modal__field">
                <label className="course-modal__label">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  className="course-modal__input"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>

              {/* Instructor Bio */}
              <div className="course-modal__field">
                <label className="course-modal__label">
                  Biografía del Instructor
                </label>
                <textarea
                  rows="2"
                  className="course-modal__textarea"
                  value={formData.instructorBio}
                  onChange={(e) =>
                    setFormData({ ...formData, instructorBio: e.target.value })
                  }
                  placeholder="Breve descripción del instructor..."
                />
              </div>
            </div>

            {/* Curriculum/Temario Section */}
            <div className="course-modal__curriculum-section">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <BookOpen size={20} />
                  Temario del Curso
                </h3>
                <button
                  type="button"
                  onClick={addCurriculumModule}
                  className="course-modal__add-module-btn"
                >
                  <Plus size={16} />
                  Agregar Módulo
                </button>
              </div>

              <div className="course-modal__curriculum-list">
                {formData.curriculum.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="course-modal__curriculum-module">
                    <div className="course-modal__module-header">
                      <h4 className="course-modal__module-title">
                        Módulo {module.module}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeCurriculumModule(moduleIndex)}
                        className="course-modal__remove-module-btn"
                        disabled={formData.curriculum.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="course-modal__module-fields">
                      <div className="course-modal__module-field">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título del Módulo
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          value={module.title}
                          onChange={(e) => updateCurriculumModule(moduleIndex, 'title', e.target.value)}
                          placeholder="Ej: Introducción a las técnicas básicas"
                        />
                      </div>

                      <div className="course-modal__module-field">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duración
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          value={module.duration}
                          onChange={(e) => updateCurriculumModule(moduleIndex, 'duration', e.target.value)}
                          placeholder="Ej: 2 horas"
                        />
                      </div>
                    </div>

                    <div className="course-modal__topics-section">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Temas del Módulo
                        </label>
                        <button
                          type="button"
                          onClick={() => addTopicToModule(moduleIndex)}
                          className="course-modal__add-topic-btn"
                        >
                          <Plus size={14} />
                          Agregar Tema
                        </button>
                      </div>

                      <div className="course-modal__topics-list">
                        {module.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="course-modal__topic-item">
                            <input
                              type="text"
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                              value={topic}
                              onChange={(e) => updateTopicInModule(moduleIndex, topicIndex, e.target.value)}
                              placeholder="Ej: Conceptos básicos y fundamentos"
                            />
                            <button
                              type="button"
                              onClick={() => removeTopicFromModule(moduleIndex, topicIndex)}
                              className="course-modal__remove-topic-btn"
                              disabled={module.topics.length === 1}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="course-modal__actions">
              <button
                type="button"
                onClick={onClose}
                className="course-modal__cancel-btn"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="course-modal__save-btn"
              >
                <Save size={18} />
                {loading ? "Guardando..." : "Guardar Curso"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default CourseModal;
