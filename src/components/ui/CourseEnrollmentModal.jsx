import React, { useState } from "react";
import { X, Save, User, Mail, Phone, AlertCircle, CheckCircle } from "lucide-react";
import Portal from "./Portal";
import "../../styles/CourseEnrollmentModal.css";

const CourseEnrollmentModal = ({ isOpen, onClose, onSubmit, course, loading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  if (!isOpen) return null;

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value || value.trim().length < 3) {
          return "El nombre debe tener al menos 3 caracteres";
        }
        return null;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          return "Email inválido";
        }
        return null;

      case "phone":
        const phoneRegex = /^[0-9]{10}$/;
        if (!value || !phoneRegex.test(value.replace(/[\s-]/g, ""))) {
          return "Teléfono debe tener 10 dígitos";
        }
        return null;

      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({ fullName: true, email: true, phone: true });

    // Si hay errores, no continuar
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Enviar datos
    await onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ fullName: "", email: "", phone: "" });
    setErrors({});
    setTouched({});
    onClose();
  };

  return (
    <Portal>
      <div className="enrollment-modal-overlay">
        <div className="enrollment-modal">
          {/* Header */}
          <div className="enrollment-modal__header">
            <div className="enrollment-modal__header-content">
              <h2>Inscripción al Curso</h2>
              <p>{course?.title}</p>
            </div>
            <button
              onClick={handleClose}
              className="enrollment-modal__close-btn"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>

          {/* Course Info */}
          <div className="enrollment-modal__course-info">
            <div className="enrollment-modal__price-row">
              <span className="enrollment-modal__price-label">Precio:</span>
              <span className="enrollment-modal__price">
                ${course?.price}
              </span>
            </div>
            <p className="enrollment-modal__course-meta">
              Duración: {course?.duration} • {course?.modules} módulos
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="enrollment-modal__form">
            {/* Nombre Completo */}
            <div className="enrollment-form__field">
              <label className="enrollment-form__label">
                Nombre Completo *
              </label>
              <div className="enrollment-form__input-wrapper">
                <User className="enrollment-form__input-icon" size={18} />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Ej: María González"
                  className={`enrollment-form__input ${
                    errors.fullName && touched.fullName ? "enrollment-form__input--error" : ""
                  }`}
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
              </div>
              {errors.fullName && touched.fullName && (
                <p className="enrollment-form__error">
                  <AlertCircle size={12} />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="enrollment-form__field">
              <label className="enrollment-form__label">
                Email *
              </label>
              <div className="enrollment-form__input-wrapper">
                <Mail className="enrollment-form__input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="tu@email.com"
                  className={`enrollment-form__input ${
                    errors.email && touched.email ? "enrollment-form__input--error" : ""
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
              </div>
              {errors.email && touched.email && (
                <p className="enrollment-form__error">
                  <AlertCircle size={12} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="enrollment-form__field">
              <label className="enrollment-form__label">
                Teléfono *
              </label>
              <div className="enrollment-form__input-wrapper">
                <Phone className="enrollment-form__input-icon" size={18} />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="8091234567"
                  className={`enrollment-form__input ${
                    errors.phone && touched.phone ? "enrollment-form__input--error" : ""
                  }`}
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
              </div>
              {errors.phone && touched.phone && (
                <p className="enrollment-form__error">
                  <AlertCircle size={12} />
                  {errors.phone}
                </p>
              )}
              <p className="enrollment-form__help">
                Formato: 10 dígitos sin espacios ni guiones
              </p>
            </div>

            {/* Info adicional */}
            <div className="enrollment-modal__info-box">
              <div className="enrollment-modal__info-content">
                <CheckCircle className="enrollment-modal__info-icon" size={18} />
                <div className="enrollment-modal__info-text">
                  <p className="enrollment-modal__info-title">Próximos pasos:</p>
                  <ul className="enrollment-modal__info-list">
                    <li>• Recibirás un email de confirmación</li>
                    <li>• Te contactaremos para coordinar el pago</li>
                    <li>• Te enviaremos los detalles del curso</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="enrollment-modal__buttons">
              <button
                type="button"
                onClick={handleClose}
                className="enrollment-modal__btn enrollment-modal__btn--cancel"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="enrollment-modal__btn enrollment-modal__btn--submit"
              >
                {loading ? (
                  <>
                    <div className="enrollment-modal__spinner"></div>
                    Inscribiendo...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Inscribirme
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default CourseEnrollmentModal;
