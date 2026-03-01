// src/pages/About.jsx
import { Container, Image } from "react-bootstrap";
import Skills from "../components/Skills";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function About() {
  return (
    <section id="about" className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">Sobre mí</h2>

        <div className="d-flex flex-column flex-md-row align-items-center gap-4">
          {/* Imagen de perfil desde public/screenshots (ruta absoluta) */}
          <Image
            src="/screenshots/profile.png"
            alt="Foto de perfil de Emmanuel Charry"
            className="img-fluid rounded-circle border border-4 border-primary"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
            loading="lazy"
            decoding="async"
          />

          {/* Texto principal */}
          <div>
            <p>
              ¡Hola! Soy <strong>Emmanuel Charry</strong>, administrador y
              gestor de software, apasionado por crear experiencias digitales
              funcionales, atractivas y eficientes. Me gradué becado como
              Tecnólogo en Desarrollo de Software para Negocios Digitales, tengo
              una certificación en JavaScript de Coursera. Y actualmente estoy
              cursando una Ingeniería Multimedia.
            </p>

            <p>
              Durante mi formación he participado en diversos proyectos
              académicos y personales, que me han permitido aplicar mis
              habilidades técnicas y creatividad. Algunos de los más destacados
              son:
            </p>

            <ul>
              <li>
                {" "}
                App para automatizar pedidos en mesas y gestion administrativa
                de un restaurante (restaurant-app).
              </li>
              <li>
                Este portafolio, donde presento mis habilidades y proyectos.
              </li>
            </ul>

            <p>
              Trabajo principalmente con tecnologías como{" "}
              <strong>
                JavaScript, React, Bootstrap, Tailwind, MySQL, MongoDB, HTML,
                PHP
              </strong>{" "}
              y <strong>CSS</strong>. Además de sistemas operativos como{" "}
              <strong>Windows</strong> y conocicimientos técnicos de{" "}
              <strong>hardware del PC</strong>. Me encanta aprender y explorar
              nuevas tecnologías como el crecimiento de la <strong>IA</strong> y
              sus capacidades multifacéticas.{" "}
              <strong>
                Siempre estoy buscando nuevas formas y herramientas para
                construir soluciones útiles y modernas.
              </strong>
            </p>

            {/* Íconos sociales */}
            <div className="d-flex gap-3 mt-3">
              <a
                href="https://github.com/Emmanuel4929"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark fs-4"
                aria-label="Abrir GitHub de Emmanuel"
              >
                <FaGithub />
              </a>

              <a
                href="https://linkedin.com/in/emmanuel-charry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary fs-4"
                aria-label="Abrir LinkedIn de Emmanuel"
              >
                <FaLinkedin />
              </a>
            </div>

            {/* Habilidades */}
            <div className="mt-4">
              <Skills />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
