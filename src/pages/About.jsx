// src/pages/About.jsx
import React from "react";
import "../styles/About.css";
import HeroNosotros from "../assets/images/hero_nosotros.jpeg";
import TianiHerrera from "../assets/images/Tiani_Herrera.jpeg";
import YailinNunez from "../assets/images/Yailin_Nuñez.jpeg";
import IsauraVeloz from "../assets/images/Isaura_Veloz.jpeg";

/* ===== Iconos para especialidades ===== */
const SpecialtyIcon = ({ type }) => {
  const icons = {
    micropigmentacion: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21L12 2L21 21H3Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="12" cy="16" r="2" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M10 12H14" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    cabello: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3C8 3 10 1 12 1C14 1 16 3 16 3" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M7 6C7 4 9 2 12 2C15 2 17 4 17 6V18C17 20 15 22 12 22C9 22 7 20 7 18V6Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M9 8L15 8M9 12L15 12M10 16L14 16" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    unas: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8 2 6 6 6 10V16C6 19 8 22 12 22C16 22 18 19 18 16V10C18 6 16 2 12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M9 6C9 4 10.5 2 12 2C13.5 2 15 4 15 6" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 14H14M11 17H13" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  };
  return <span className="specialty-icon">{icons[type]}</span>;
};

/* ===== Card reutilizable del equipo ===== */
const TeamCard = ({ photo, name, role, description, specialty }) => {
  return (
    <article className="team-card">
      <div className="team-card__image">
        <img src={photo} alt={name} />
      </div>
      <div className="team-card__content">
        <div className="team-card__header">
          <SpecialtyIcon type={specialty} />
          <div>
            <h4 className="team-card__name">{name}</h4>
            <p className="team-card__role">{role}</p>
          </div>
        </div>
        <p className="team-card__description">{description}</p>
      </div>
    </article>
  );
};

/* ===== Datos del equipo actualizado ===== */
const teamMembers = [
  {
    name: "Tiani Herrera",
    role: "Especialista en Micropigmentación y Maquillaje Profesional",
    description: "Tiani define la belleza como algo humano y cercano. Con una visión enfocada en la excelencia y el alto impacto, su misión es resaltar tu mejor versión respetando siempre tus rasgos naturales. Para ella, no solo importa el resultado final, sino la experiencia de transformación que vives en su silla.",
    photo: TianiHerrera,
    specialty: "micropigmentacion"
  },
  {
    name: "Yalin Floribel Núñez",
    role: "Estilista Profesional y Cuidado Capilar",
    description: "Con 11 años de trayectoria y experiencia internacional en Panamá, Yalin es una experta en la salud del cabello. Su enfoque combina la técnica de academias profesionales con una pasión genuina por resultados que no solo se noten, sino que se sientan. En sus manos, tu cabello recibe el respeto y el amor que merece.",
    photo: YailinNunez,
    specialty: "cabello"
  },
  {
    name: "Isaura Josefina Veloz",
    role: "Técnica en Uñas y Estética",
    description: "La precisión y la mejora continua definen el trabajo de Isaura. Desde los 16 años, ha perfeccionado el arte del cuidado de las uñas, enfocándose en los detalles que marcan la diferencia. Su compromiso es ofrecer un servicio pulcro y actualizado, donde la constancia y la dedicación se reflejan en cada acabado.",
    photo: IsauraVeloz,
    specialty: "unas"
  },
];

const About = () => {
  return (
    <section className="about-page">
      {/* Hero con imagen de fondo */}
      <div className="about-hero">
        <div className="about-hero__background">
          <img src={HeroNosotros} alt="Herrera Beauty Studio" />
          <div className="about-hero__overlay"></div>
        </div>
        <div className="about-hero__content">
          <h1 className="about-hero__title">
            Más que belleza, una <span className="highlight">experiencia consciente</span>
          </h1>
          <p className="about-hero__subtitle">
            En Herrera Beauty Studio, creemos que el verdadero cuidado nace de la combinación perfecta entre el conocimiento técnico y el respeto por la esencia de cada persona. Somos un equipo apasionado que ha unido sus trayectorias internacionales y años de experiencia para crear un espacio donde te sientas escuchada, valorada y, sobre todo, segura.
          </p>
        </div>
      </div>

      <div className="about-container">
        {/* Sección del equipo */}
        <div className="about-team">
          <h2 className="about-team__title">Nuestro Equipo</h2>
          <p className="about-team__subtitle">
            Profesionales dedicadas a realzar tu <strong>belleza natural</strong> con técnicas especializadas y <strong>cuidado personalizado</strong>
          </p>

          <div className="about-team__grid">
            {teamMembers.map((member, index) => (
              <TeamCard
                key={index}
                name={member.name}
                role={member.role}
                description={member.description}
                photo={member.photo}
                specialty={member.specialty}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="about-cta">
          <div className="about-cta__content">
            <h3 className="about-cta__title">
              Con Dios delante, estamos aquí para acompañarte en cada cambio que decidas hacer
            </h3>
            <p className="about-cta__text">¡Será un placer atenderte!</p>
            <a 
              href="https://wa.me/18297050408?text=¡Buenas!%20Me%20gustaría%20agendar%20una%20cita"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Agendar Cita
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;