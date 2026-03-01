import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import ProjectCard from "../components/ProjectCard";
import projects from "../data/projects.json";

export default function Projects() {
  //* Carga filtro inicial desde query param o localStorage
  const getInitialFilter = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("tech");
      if (q) return q;
      const saved = localStorage.getItem("projects.filter");
      return saved || "Todos";
    } catch {
      return "Todos";
    }
  };

  const [filter, setFilter] = useState(getInitialFilter);

  //* Sincroniza filtro con localStorage y query param
  useEffect(() => {
    try {
      localStorage.setItem("projects.filter", filter);
      const url = new URL(window.location.href);
      if (filter === "Todos") {
        url.searchParams.delete("tech");
      } else {
        url.searchParams.set("tech", filter);
      }
      // Reemplaza el estado para no llenar el historial
      window.history.replaceState({}, "", url.toString());
    } catch {
      // No-op en SSR o navegadores restringidos
    }
  }, [filter]);

  //* Normaliza destacados primero y aplica filtro
  const orderedProjects = useMemo(() => {
    const sorted = [...projects].sort(
      (a, b) => Number(b.featured) - Number(a.featured),
    );
    if (filter === "Todos") return sorted;
    const f = filter.trim().toLowerCase();
    return sorted.filter((p) =>
      p.technologies?.some((t) => t && t.trim().toLowerCase() === f),
    );
  }, [filter]);

  //* Colección de tecnologías únicas (para UI de filtro)
  const techOptions = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.technologies?.forEach((t) => set.add(t)));
    return ["Todos", ...Array.from(set).sort()];
  }, []);

  //* Simple callback para tracking (puedes integrar Google Analytics u otro servicio)
  const handleVisit = ({ type, title, href }) => {
    // GA4
    window.gtag?.("event", "project_click", {
      event_category: "portfolio",
      event_label: `${title}::${type}`,
      value: 1,
      href,
    });
    // Log local de depuración
    console.log("[visit]", { type, title, href });
  };

  return (
    <section id="projects" className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-4">Mis Proyectos</h2>

        {/* Selector de tecnología */}
        <div className="d-flex justify-content-center mb-4">
          <label htmlFor="projects-filter" className="me-2 align-self-center">
            Filtrar por tecnología:
          </label>
          <select
            id="projects-filter"
            className="form-select w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filtrar proyectos por tecnología"
          >
            {techOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {orderedProjects.length === 0 ? (
          <Alert variant="secondary" className="text-center">
            No hay proyectos que coincidan con <strong>{filter}</strong>. Prueba
            otra tecnología o selecciona <strong>Todos</strong>.
          </Alert>
        ) : (
          <Row className="g-4">
            {orderedProjects.map((project, index) => (
              <Col key={project.title || index} sm={12} md={6} lg={4}>
                <ProjectCard {...project} onVisit={handleVisit} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
}
