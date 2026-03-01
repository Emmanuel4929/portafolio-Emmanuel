// src/components/Skills.jsx
import { Card, Row, Col, ProgressBar } from "react-bootstrap";
import {
  FaReact,
  FaJs,
  FaBootstrap,
  FaGitAlt,
  FaDatabase,
  FaPhp,
} from "react-icons/fa";
import { SiTailwindcss, SiMongodb } from "react-icons/si";

const skills = [
  { name: "JavaScript", Icon: FaJs, color: "text-warning", level: 95 },
  { name: "React", Icon: FaReact, color: "text-info", level: 95 },
  { name: "MySQL", Icon: FaDatabase, color: "text-primary", level: 94 },
  { name: "Tailwind", Icon: SiTailwindcss, color: "text-info", level: 80 },
  { name: "Git", Icon: FaGitAlt, color: "text-dark", level: 80 },
  { name: "Bootstrap", Icon: FaBootstrap, color: "text-primary", level: 70 },

  { name: "MongoDB", Icon: SiMongodb, color: "text-success", level: 70 },
  { name: "PHP", Icon: FaPhp, color: "text-secondary", level: 50 },
];

export default function Skills() {
  return (
    <div className="mt-4" aria-labelledby="skills-heading">
      <h4 id="skills-heading" className="mb-4">
        Mis habilidades
      </h4>

      <Row xs={1} sm={2} md={3} className="g-4">
        {skills.map((item) => {
          const { name, Icon, color, level } = item;
          return (
            <Col key={name}>
              <Card className="text-center shadow-sm h-100">
                <Card.Body>
                  <div className="mb-3" aria-hidden="true">
                    <Icon size={40} className={color} />
                  </div>

                  <Card.Title as="h5" className="mb-2">
                    {name}
                  </Card.Title>

                  <ProgressBar
                    now={level}
                    variant="info"
                    aria-label={`Nivel en ${name}`}
                  />
                  <div className="small text-muted mt-2">{level}%</div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
