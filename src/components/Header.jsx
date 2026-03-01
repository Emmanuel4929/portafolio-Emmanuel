// src/components/Header.jsx
import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";

export default function Header() {
  const [expanded, setExpanded] = useState(false);

  // Cierra el menú al navegar en mobile
  const handleNavClick = () => setExpanded(false);

  return (
    <>
      {/* Skip link para accesibilidad (aparece al enfocar con Tab) */}
      <a href="#main-content" className="visually-hidden-focusable skip-link">
        Saltar al contenido
      </a>

      <Navbar
        bg="dark"
        data-bs-theme="dark"
        expand="lg"
        sticky="top"
        className="shadow-sm"
        expanded={expanded}
        onToggle={(next) => setExpanded(next)}
        aria-label="Barra de navegación principal"
      >
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={handleNavClick}>
            Mi Portafolio
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="main-navbar"
            aria-label={
              expanded
                ? "Cerrar menú de navegación"
                : "Abrir menú de navegación"
            }
          />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              <Nav.Link
                as={NavLink}
                to="/"
                end
                onClick={handleNavClick}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Inicio
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/projects"
                onClick={handleNavClick}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Proyectos
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/about"
                onClick={handleNavClick}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Sobre mí
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
