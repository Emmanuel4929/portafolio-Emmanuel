import { useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import emailjs from "@emailjs/browser";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm({
  show,
  handleClose,
  autoCloseOnSuccess = true,
}) {
  const formRef = useRef(null);
  const captchaRef = useRef(null);

  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null); // 👈 NUEVO

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const CONTACT_EMAIL = useMemo(() => {
    return import.meta.env.VITE_CONTACT_EMAIL || "tu.email@dominio.com";
  }, []);

  const handleCloseAndReset = () => {
    handleClose?.();
    setMessage({ text: "", type: "" });
    setIsSubmitting(false);
    setCaptchaToken(null);
    if (formRef.current) formRef.current.reset();
    if (captchaRef.current) captchaRef.current.reset();
  };

  const mapErrorToHuman = (err) => {
    const raw = String(err?.text || err?.message || "").toLowerCase();
    if (raw.includes("invalid grant") || raw.includes("gmail_api")) {
      return "Tuvimos un problema con el proveedor de correo. Ya estamos trabajando en ello.";
    }
    if (
      raw.includes("network") ||
      raw.includes("failed to fetch") ||
      raw.includes("timeout")
    ) {
      return "Parece haber un problema de conexión. Intenta de nuevo en unos segundos.";
    }
    return "No pudimos enviar tu mensaje en este momento.";
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formEl = formRef.current;
    if (!formEl) return;

    // Honeypot
    const hp = formEl.querySelector('input[name="company"]');
    if (hp && hp.value) {
      console.warn("Honeypot triggered, skipping submit.");
      setMessage({ text: "No se pudo enviar el mensaje.", type: "danger" });
      return;
    }

    // Validación mínima
    const name = formEl.user_name?.value?.trim();
    const email = formEl.user_email?.value?.trim();
    const body = formEl.message?.value?.trim();
    if (!name || !email || !body || body.length < 10) {
      setMessage({
        text: "Por favor completa todos los campos (mensaje mínimo 10 caracteres).",
        type: "warning",
      });
      return;
    }

    // Captcha visible: debemos tener token (onChange)
    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setMessage({
        text: "Por favor completa el reCAPTCHA antes de enviar.",
        type: "warning",
      });
      return;
    }

    // Chequeo de configuración
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error("Faltan variables de entorno de EmailJS.");
      setMessage({
        text: "Error de configuración. Intenta más tarde.",
        type: "danger",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ text: "", type: "" });

      // Si hay captcha, anexamos el token al form (campo estándar)
      if (captchaToken) {
        let tokenInput = formEl.querySelector(
          'input[name="g-recaptcha-response"]',
        );
        if (!tokenInput) {
          tokenInput = document.createElement("input");
          tokenInput.type = "hidden";
          tokenInput.name = "g-recaptcha-response";
          formEl.appendChild(tokenInput);
        }
        tokenInput.value = captchaToken;
      }

      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formEl, PUBLIC_KEY);

      setMessage({ text: "¡Mensaje enviado!", type: "success" });
      formEl.reset();
      setCaptchaToken(null);
      captchaRef.current?.reset();

      if (autoCloseOnSuccess) {
        setTimeout(() => {
          handleCloseAndReset();
        }, 1500);
      }
    } catch (err) {
      console.error("EmailJS error:", err);
      const humanMsg = mapErrorToHuman(err);
      setMessage({ text: humanMsg, type: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler del captcha visible
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token || null);
  };

  return (
    <Modal show={show} onHide={handleCloseAndReset} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Contáctame</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {message.text && (
          <Alert
            variant={message.type}
            onClose={() => setMessage({ text: "", type: "" })}
            dismissible
            className="mt-2"
            role="status"
            aria-live="polite"
          >
            <div className="mb-1">{message.text}</div>
            {message.type === "danger" && (
              <div>
                Si el problema persiste, escríbeme a{" "}
                <a
                  href={
                    "mailto:" +
                    CONTACT_EMAIL +
                    "?subject=" +
                    encodeURIComponent("Contacto desde el portafolio") +
                    "&body=" +
                    encodeURIComponent(
                      "¡Hola Emmanuel!\n\nTe escribo desde tu portafolio. Quería comentarte...\n",
                    )
                  }
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </div>
            )}
          </Alert>
        )}

        <Form ref={formRef} onSubmit={sendEmail} noValidate>
          {/* Honeypot */}
          <div
            style={{
              position: "absolute",
              left: "-5000px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label htmlFor="company">Empresa</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <Form.Group className="mb-3" controlId="contact_name">
            <Form.Label>
              Nombre <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="user_name"
              required
              aria-label="Nombre completo"
              autoFocus
              disabled={isSubmitting}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="contact_email">
            <Form.Label>
              Email <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              name="user_email"
              required
              aria-label="Correo electrónico"
              inputMode="email"
              disabled={isSubmitting}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="contact_message">
            <Form.Label>
              Mensaje <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              rows={4}
              required
              aria-label="Escribe tu mensaje"
              minLength={10}
              disabled={isSubmitting}
            />
            <Form.Text className="text-muted">Mínimo 10 caracteres.</Form.Text>
          </Form.Group>

          {/* reCAPTCHA visible */}
          {RECAPTCHA_SITE_KEY ? (
            <div className="mb-3">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                size="normal" // 👈 visible
                ref={captchaRef}
                onChange={handleCaptchaChange}
              />
            </div>
          ) : null}

          <Button
            variant="primary"
            type="submit"
            className="w-100 mt-2"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Enviando…
              </>
            ) : (
              "Enviar"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

ContactForm.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  autoCloseOnSuccess: PropTypes.bool,
};
