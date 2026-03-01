import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container className="text-center">
        <div className="mb-3 d-flex justify-content-center gap-4">
          <a
            href="https://github.com/Emmanuel4929"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-opacity"
            style={{ opacity: 0.8 }}
          >
            <FaGithub size={28} className="hover-opacity" />
          </a>
          <a
            href="https://www.linkedin.com/in/emmanuel-charry/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-opacity"
            style={{ opacity: 0.8 }}
          >
            <FaLinkedin size={28} className="hover-opacity" />
          </a>
          <a
            href="mailto:emmanuel.charry12@gmail.com"
            className="text-white transition-opacity"
            style={{ opacity: 0.8 }}
          >
            <FaEnvelope size={28} className="hover-opacity" />
          </a>
        </div>
        <p className="mb-0 small">
          © {new Date().getFullYear()} Emmanuel Charry • Portafolio personal.
          Todos los derechos reservados.
        </p>
      </Container>

      {}
      <style jsx>{`
        a:hover {
          opacity: 1 !important;
        }
      `}</style>
    </footer>
  );
}
