import { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { FaDownload, FaPaperPlane } from "react-icons/fa";
import Skills from "../components/Skills";
import ContactForm from "../components/ContactForm";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("idle"); // 'idle', 'downloading', 'success'

  const handleDownload = () => {
    setDownloadStatus("downloading");

    // Iniciar descarga
    const link = document.createElement("a");
    link.href = "/CV.pdf";
    link.download = "CV_Emmanuel_Charry.pdf";
    document.body.appendChild(link);
    link.click();

    // Cambiar a estado de éxito después de un tiempo
    setTimeout(() => {
      document.body.removeChild(link);
      setDownloadStatus("success");

      // Volver al estado inicial después de mostrar el éxito
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 3000);
    }, 1500);
  };

  return (
    <section id="home" className="py-5 bg-white">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
            <h1 className="display-4 fw-bold">
              Hola, soy <span className="text-primary">Emmanuel Charry</span>
            </h1>
            <p className="lead">
              Desarrollador Frontend con experiencia en React, JavaScript,
              MongoDB, MySQL, Tailwind, Bootstrap y tecnologías modernas.
              Apasionado por mejorar la calidad de vida de las personas mediante
              la tecnología.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                className="d-flex align-items-center gap-2"
              >
                <FaPaperPlane /> Contáctame
              </Button>
              <Button
                variant={
                  downloadStatus === "downloading"
                    ? "secondary"
                    : downloadStatus === "success"
                      ? "success"
                      : "outline-primary"
                }
                onClick={downloadStatus === "idle" ? handleDownload : undefined}
                disabled={downloadStatus !== "idle"}
                className="d-flex align-items-center justify-content-center gap-2"
                aria-label="Descargar currículum"
              >
                {downloadStatus === "downloading" && (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Descargando...
                  </>
                )}
                {downloadStatus === "success" && (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    ¡Descargado!
                  </>
                )}
                {downloadStatus === "idle" && (
                  <>
                    <FaDownload /> Descargar CV
                  </>
                )}
              </Button>
            </div>
          </Col>

          <Col md={6} className="text-center">
            <img
              src="screenshots/Perfil1.png"
              alt="Emmanuel Charry"
              className="img-fluid rounded-circle shadow"
              style={{ maxWidth: "250px" }}
              loading="lazy"
            />
          </Col>
        </Row>

        <hr className="my-5" />

        <Skills />
      </Container>

      {/* Modal de Contacto */}
      <ContactForm show={showModal} handleClose={() => setShowModal(false)} />
    </section>
  );
}
