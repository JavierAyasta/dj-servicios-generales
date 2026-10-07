'use strict';

/* =========================================================
   ⚙️ CONFIGURACIÓN DEL NEGOCIO — DJ SERVICIOS GENERALES
   ========================================================= */
const BUSINESS_CONFIG = {
  name:        "DJ Servicios Generales",
  technician:  "Hebert Mechán",
  ruc:         "10453147610",
  /* WhatsApp principal sin + ni espacios */
  whatsapp:    "51976252698",
  /* Teléfonos visibles */
  phone:       "976 252 698",
  phone2:      "971 586 275",
  location:    "Av. Bolognesi 133 / Monsefú",
  email:       "hebermechan1@gmail.com",
  schedule:    "Lunes a sábado · 8:00 a. m. – 6:00 p. m.",
  defaultMessage: "Hola, quiero consultar por un servicio."
};

window.BUSINESS_CONFIG = BUSINESS_CONFIG;


/* =========================================================
   1. WHATSAPP
   ========================================================= */
function buildWhatsAppLink(message) {
  const numero = String(BUSINESS_CONFIG.whatsapp).replace(/\D/g, '');
  const texto = message && message.trim() ? message : BUSINESS_CONFIG.defaultMessage;
  return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
}

function initWhatsAppLinks() {
  document.querySelectorAll('.js-whatsapp').forEach(function (enlace) {
    const mensaje = enlace.getAttribute('data-message');
    enlace.setAttribute('href', buildWhatsAppLink(mensaje));
    enlace.setAttribute('target', '_blank');
    enlace.setAttribute('rel', 'noopener noreferrer');
  });
}


/* =========================================================
   2. CONFIG → DOM
   ========================================================= */
function initConfigBindings() {
  document.querySelectorAll('[data-config]').forEach(function (el) {
    const clave = el.getAttribute('data-config');
    if (Object.prototype.hasOwnProperty.call(BUSINESS_CONFIG, clave)) {
      el.textContent = BUSINESS_CONFIG[clave];
    }
  });

  document.querySelectorAll('[data-config-href]').forEach(function (el) {
    const clave = el.getAttribute('data-config-href');
    const valor = BUSINESS_CONFIG[clave];
    if (!valor) return;
    if (clave === 'phone') {
      el.setAttribute('href', 'tel:' + String(valor).replace(/[^\d+]/g, ''));
    } else if (clave === 'email') {
      el.setAttribute('href', 'mailto:' + valor);
    }
  });
}


/* =========================================================
   3. AÑO DINÁMICO
   ========================================================= */
function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


/* =========================================================
   4. NAVBAR HAMBURGUESA
   ========================================================= */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  function toggleMenu(forceClose) {
    const abierto = menu.classList.contains('is-open');
    const cerrar = forceClose === true || abierto;
    menu.classList.toggle('is-open', !cerrar);
    toggle.classList.toggle('is-open', !cerrar);
    toggle.setAttribute('aria-expanded', String(!cerrar));
  }

  toggle.addEventListener('click', () => toggleMenu());

  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 992) toggleMenu(true);
    });
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth > 992) return;
    if (!menu.classList.contains('is-open')) return;
    if (!menu.contains(e.target) && !toggle.contains(e.target)) toggleMenu(true);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      toggleMenu(true);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && menu.classList.contains('is-open')) toggleMenu(true);
  });
}


/* =========================================================
   5. HEADER SCROLL + LINK ACTIVO
   ========================================================= */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initActiveNav() {
  const enlaces = Array.from(document.querySelectorAll('.nav-link'));
  const secciones = enlaces.map((e) => {
    const id = e.getAttribute('href');
    if (!id || id.charAt(0) !== '#') return null;
    const sec = document.querySelector(id);
    return sec ? { enlace: e, seccion: sec } : null;
  }).filter(Boolean);

  if (!secciones.length || !('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      secciones.forEach((it) => {
        it.enlace.classList.toggle('is-active', it.seccion === entrada.target);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  secciones.forEach((it) => obs.observe(it.seccion));
}


/* =========================================================
   6. FAQ
   ========================================================= */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach((item) => {
    const boton = item.querySelector('.faq__question');
    const resp = item.querySelector('.faq__answer');
    if (!boton || !resp) return;

    boton.addEventListener('click', () => {
      const abierto = item.classList.contains('is-open');

      items.forEach((otro) => {
        if (otro === item) return;
        otro.classList.remove('is-open');
        const b = otro.querySelector('.faq__question');
        const r = otro.querySelector('.faq__answer');
        if (b) b.setAttribute('aria-expanded', 'false');
        if (r) r.style.maxHeight = null;
      });

      if (abierto) {
        item.classList.remove('is-open');
        boton.setAttribute('aria-expanded', 'false');
        resp.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        boton.setAttribute('aria-expanded', 'true');
        resp.style.maxHeight = resp.scrollHeight + 'px';
      }
    });
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq__item.is-open .faq__answer').forEach((r) => {
      r.style.maxHeight = r.scrollHeight + 'px';
    });
  });
}


/* =========================================================
   7. FORMULARIO → WHATSAPP
   ========================================================= */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const feedback = document.getElementById('formFeedback');

  function mostrar(texto, tipo) {
    if (!feedback) return;
    feedback.textContent = texto;
    feedback.classList.remove('is-error', 'is-success');
    if (tipo) feedback.classList.add(tipo);
  }

  function marcar(campo, invalido) {
    if (!campo) return;
    campo.classList.toggle('is-invalid', !!invalido);
    campo.setAttribute('aria-invalid', invalido ? 'true' : 'false');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombreI  = document.getElementById('nombre');
    const telI     = document.getElementById('telefono');
    const servicioI= document.getElementById('servicio');
    const mensajeI = document.getElementById('mensaje');

    const nombre   = nombreI ? nombreI.value.trim() : '';
    const tel      = telI ? telI.value.trim() : '';
    const servicio = servicioI ? servicioI.value : '';
    const mensaje  = mensajeI ? mensajeI.value.trim() : '';

    marcar(nombreI, !nombre);
    marcar(servicioI, !servicio);
    marcar(mensajeI, !mensaje);

    if (!nombre || !servicio || !mensaje) {
      mostrar('Por favor completa los campos obligatorios (*).', 'is-error');
      const primer = form.querySelector('.is-invalid');
      if (primer) primer.focus();
      return;
    }

    let texto = 'Hola, soy ' + nombre + '. Necesito información sobre ' + servicio +
                '. Mi consulta es: ' + mensaje + '.';
    if (tel) texto += ' Mi teléfono: ' + tel + '.';

    const url = buildWhatsAppLink(texto);
    const win = window.open(url, '_blank', 'noopener');

    if (win) {
      mostrar('¡Listo! Se abrió WhatsApp con tu consulta.', 'is-success');
      form.reset();
      form.querySelectorAll('.is-invalid').forEach((c) => marcar(c, false));
    } else {
      mostrar('Redirigiendo a WhatsApp…', 'is-error');
      window.location.href = url;
    }
  });

  form.querySelectorAll('input, select, textarea').forEach((c) => {
    const limpiar = () => {
      if (c.classList.contains('is-invalid') && c.value.trim()) marcar(c, false);
    };
    c.addEventListener('input', limpiar);
    c.addEventListener('change', limpiar);
  });
}


/* =========================================================
   8. MODAL DE CERTIFICADOS
   ========================================================= */
function initCertModal() {
  const modal = document.getElementById('certModal');
  const img   = document.getElementById('certModalImg');
  const title = document.getElementById('certModalTitle');
  if (!modal || !img || !title) return;

  const botones = document.querySelectorAll('.cert-card__btn');

  function abrir(src, texto) {
    img.setAttribute('src', src);
    img.setAttribute('alt', texto || 'Certificado ampliado');
    title.textContent = texto || 'Certificado';
    modal.hidden = false;
    document.body.classList.add('modal-open');
    const closeBtn = modal.querySelector('.cert-modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function cerrar() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    img.setAttribute('src', '');
  }

  botones.forEach((btn) => {
    btn.addEventListener('click', () => {
      abrir(btn.getAttribute('data-cert'), btn.getAttribute('data-cert-title'));
    });
  });

  modal.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', cerrar);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) cerrar();
  });
}


/* =========================================================
   9. REVEAL SCROLL
   ========================================================= */
function initReveal() {
  const elementos = document.querySelectorAll('.reveal');
  if (!elementos.length) return;

  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducido || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const obs = new IntersectionObserver((entradas, o) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('is-visible');
      o.unobserve(entrada.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elementos.forEach((el, i) => {
    el.style.transitionDelay = Math.min(i % 4, 3) * 80 + 'ms';
    obs.observe(el);
  });
}


/* =========================================================
   10. SCROLL SUAVE
   ========================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      const id = enlace.getAttribute('href');
      if (!id || id === '#') return;
      const destino = document.querySelector(id);
      if (!destino) return;

      e.preventDefault();
      const header = document.getElementById('header');
      const alto = header ? header.offsetHeight : 0;
      const pos = destino.getBoundingClientRect().top + window.pageYOffset - alto - 12;
      const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.scrollTo({ top: pos, behavior: reducido ? 'auto' : 'smooth' });
      if (history.pushState) history.pushState(null, '', id);
    });
  });
}


/* =========================================================
   11. INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initConfigBindings();
  initWhatsAppLinks();
  initYear();
  initNav();
  initHeaderScroll();
  initActiveNav();
  initFAQ();
  initForm();
  initCertModal();
  initReveal();
  initSmoothScroll();
});