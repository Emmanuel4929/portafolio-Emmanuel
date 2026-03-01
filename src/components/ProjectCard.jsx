// components/ProjectCard.jsx
import PropTypes from "prop-types";
import { memo, useMemo, useCallback } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

/**
 * Anexa UTM a una URL (evita duplicados y preserva otros params).
 * Ahora soporta rutas relativas usando una base opcional o window.location.origin.
 */
function withUtm(url, utm = {}, base) {
  try {
    const origin =
      base ||
      (typeof window !== "undefined" ? window.location.origin : undefined);
    const u = origin ? new URL(url, origin) : new URL(url); // soporta relativas si hay base
    Object.entries(utm).forEach(([k, v]) => {
      if (v) u.searchParams.set(k, v);
    });
    return u.toString();
  } catch {
    // Si falla, devuelve tal cual
    return url;
  }
}

function ProjectCard({
  title,
  description,
  technologies,
  githubLink,
  demoLink,
  image,
  imageAlt, // NUEVO: alt personalizable
  featured = false,
  utm, // {utm_source, utm_medium, utm_campaign, utm_content}
  utmBase, // NUEVO: base opcional para URLs relativas
  onVisit, // callback para tracking
  status = "done", // "done" | "in-progress"
}) {
  // UTM por defecto y fusión con lo recibido (sin pisar campos no enviados)
  const mergedUtm = useMemo(
    () => ({
      utm_source: "portfolio",
      utm_medium: "card",
      utm_campaign: "projects",
      ...(featured ? { utm_content: "featured" } : {}),
      ...(utm || {}),
    }),
    [utm, featured],
  );

  // Prepara URLs con UTM una sola vez
  const hrefGithub = useMemo(
    () => (githubLink ? withUtm(githubLink, mergedUtm, utmBase) : null),
    [githubLink, mergedUtm, utmBase],
  );
  const hrefDemo = useMemo(
    () => (demoLink ? withUtm(demoLink, mergedUtm, utmBase) : null),
    [demoLink, mergedUtm, utmBase],
  );

  // Handlers de tracking estables
  const handleClick = useCallback(
    (type) => () => {
      if (typeof onVisit === "function") {
        onVisit({ type, title, href: type === "code" ? hrefGithub : hrefDemo });
      }
    },
    [onVisit, title, hrefGithub, hrefDemo],
  );

  // PRÁCTICA: cinta solo si está en progreso
  const showRibbon = status === "in-progress";

  return (
    <Card className="h-100 shadow-sm project-card">
      {/* Cinta superior si está en progreso */}
      {showRibbon && (
        <div
          className="ribbon ribbon-warning"
          aria-label="Proyecto en desarrollo"
        >
          🚧 En desarrollo
        </div>
      )}

      {/* Contenedor de imagen con relación de aspecto para evitar layout shift */}
      {image && (
        <div className="project-card__image-wrapper">
          <Card.Img
            variant="top"
            src={image}
            alt={imageAlt || `Imagen de portada del proyecto: ${title}`}
            loading="lazy"
            decoding="async"
            className="project-card__image"
            onError={(e) => {
              // Degradado elegante si falla la imagen
              e.currentTarget.src =
                "https://dummyimage.com/800x400/e9ecef/6c757d&text=Sin+imagen";
            }}
          />
        </div>
      )}

      <Card.Body>
        {/* Título + Badge de destacado */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title as="h3" className="h5 mb-0">
            {title}
          </Card.Title>
          {featured && (
            <Badge bg="warning" text="dark" aria-label="Proyecto destacado">
              ⭐ Destacado
            </Badge>
          )}
        </div>

        {/* Descripción (clamp para uniformidad visual) */}
        <Card.Text className="project-desc text-muted mb-3">
          {description}
        </Card.Text>

        {/* Tecnologías (badges) */}
        <div className="mb-3" aria-label="Tecnologías usadas">
          {technologies?.map((tech, index) => (
            <span
              key={index}
              className="badge bg-primary me-1"
              title={`Tecnología: ${tech}`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Acciones */}
        <div className="d-flex flex-column gap-2 align-items-center">
          {hrefGithub && (
            <Button
              variant="outline-dark"
              href={hrefGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="w-100"
              title="Abrir repositorio en GitHub"
              onClick={handleClick("code")}
              data-testid="btn-github"
            >
              <FaGithub className="me-2" />
              Código
            </Button>
          )}

          {hrefDemo && (
            <Button
              variant="dark"
              href={hrefDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-100"
              title="Abrir demo en vivo"
              onClick={handleClick("demo")}
              data-testid="btn-demo"
            >
              <FaExternalLinkAlt className="me-2" />
              Demo
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

ProjectCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  technologies: PropTypes.arrayOf(PropTypes.string),
  githubLink: PropTypes.string,
  demoLink: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string, // NUEVO
  featured: PropTypes.bool,
  utm: PropTypes.shape({
    utm_source: PropTypes.string,
    utm_medium: PropTypes.string,
    utm_campaign: PropTypes.string,
    utm_content: PropTypes.string,
  }),
  utmBase: PropTypes.string, // NUEVO: para URLs relativas
  onVisit: PropTypes.func,
  status: PropTypes.oneOf(["done", "in-progress"]),
};

ProjectCard.defaultProps = {
  technologies: [],
  featured: false,
  utm: {
    utm_source: "portfolio",
    utm_medium: "card",
    utm_campaign: "projects",
  },
  status: "done",
};

export default memo(ProjectCard);
