/* ===== LUXE STUDIO - lógica =====
   DEMO: todo lo que hay que reemplazar para un cliente real está en CONFIG, SERVICES y GALLERY. */
'use strict';

/* ---------- 1. CONFIGURACIÓN (datos del negocio) ---------- */
const CONFIG = {
  businessName: 'LUXE Studio',

  // >>> WHATSAPP DE EJEMPLO <<<
  // Reemplazalo por el número real: código de país + número, SOLO dígitos (ej. Paraguay: 595 + 981123456).
  // Mientras sea de ejemplo, los turnos se envían a este número.
  whatsapp: '595981000000',

  // Redes (de ejemplo). instagramUrl es el enlace que se abre al tocar Instagram.
  instagramHandle: 'luxestudio.demo',
  instagramUrl: 'https://www.instagram.com/',

  // Ubicación (de ejemplo)
  address: 'Av. Ejemplo 1234, Asunción (dirección de ejemplo)',
  mapsQuery: 'Asunción, Paraguay',   // texto que busca el mapa y el botón "Cómo llegar"
  mapsEmbed: '',                     // opcional: src del <iframe> de Google Maps (Compartir > Insertar un mapa)
  mapsLink: '',                      // opcional: enlace real de Google Maps para "Cómo llegar"

  // Horarios que se muestran en la página
  hoursText: 'Lunes a sábado, de 9:00 a 19:00. Domingos cerrado.',

  // Horarios que ofrece el formulario de turnos
  booking: {
    firstSlot: '09:00',
    lastSlot: '18:30',
    slotMinutes: 30,
    closedWeekdays: [0],  // 0 = domingo. Agregá 1 para lunes, etc.
    minNoticeMinutes: 30, // si el turno es hoy, la hora debe ser al menos X minutos desde ahora
    maxDaysAhead: 90
  },

  // Imágenes principales. Vacío = foto de demostración. Ejemplo: 'img/portada.jpg'
  heroImage: '',
  aboutImage: ''
};

/* ---------- 2. SERVICIOS (precios de ejemplo, en guaraníes) ---------- */
const SERVICES = [
  { id: 'corte',       name: 'Corte de cabello',       desc: 'Corte a medida según tu rostro y tu estilo, con lavado y terminación.', price: 80000,  note: '45 min' },
  { id: 'corte-barba', name: 'Corte + barba',          desc: 'El combo completo: corte, perfilado de barba y toalla caliente.',        price: 130000, note: '60 min' },
  { id: 'barba',       name: 'Barba',                  desc: 'Recorte y perfilado con navaja, aceites y productos hidratantes.',       price: 60000,  note: '30 min' },
  { id: 'lavado',      name: 'Lavado y peinado',       desc: 'Lavado con masaje, secado y peinado para salir impecable.',              price: 70000,  note: '40 min' },
  { id: 'color',       name: 'Coloración',             desc: 'Color, mechas o cobertura de canas con asesoramiento previo.',           price: 250000, note: '120 min, desde' },
  { id: 'tratamiento', name: 'Tratamientos capilares', desc: 'Hidratación, nutrición y reparación para un cabello sano y con brillo.', price: 180000, note: '60 min, desde' }
];

/* ---------- 3. GALERÍA ----------
   Fotos de demostración (demoId = foto de Unsplash). Para usar una foto real:
   guardala en la carpeta img/ y escribí la ruta en "src", por ejemplo  src: 'img/corte-1.jpg'
   Si "src" tiene valor, se usa en lugar de la foto de demostración.
   "size" puede ser '', 'wide' (ancha) o 'tall' (alta). */
const GALLERY = [
  { demoId: '1647140655214-e4a2d914971f', src: '', size: 'wide', alt: 'Barbero cortando el cabello con tijera' },
  { demoId: '1605497788044-5a32c7078486', src: '', size: '',     alt: 'Barbero secando el cabello de un cliente' },
  { demoId: '1585747860715-2ba37e788b70', src: '', size: 'tall', alt: 'Sillón de barbero frente a una pared de ladrillo' },
  { demoId: '1517832606299-7ae9b720a186', src: '', size: '',     alt: 'Recorte de barba con tijera' },
  { demoId: '1600948836101-f9ffda59d250', src: '', size: '',     alt: 'Sillones del salón con espejos redondos' },
  { demoId: '1580618672591-eb180b1a973f', src: '', size: '',     alt: 'Estilista peinando con secador y cepillo' },
  { demoId: '1657105052497-f996284ffff8', src: '', size: '',     alt: 'Barbero usando tijera de entresacar y peine' },
  { demoId: '1633681926022-84c23e8cb2d6', src: '', size: 'wide', alt: 'Salón moderno con espejos y pared de ladrillo' },
  { demoId: '1503951914875-452162b0f3f1', src: '', size: '',     alt: 'Cliente sentado en el sillón de barbero' }
];

/* ---------- 4. UTILIDADES ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const fmt = n => 'Gs. ' + new Intl.NumberFormat('es-PY').format(n);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const waLink = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const demoUrl = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? '&h=' + h : ''}&q=70`;
const pad = n => String(n).padStart(2, '0');
const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toMinutes = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

// Imagen de respaldo si una foto no carga (por ejemplo, sin internet)
const fallbackSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#1f2b44"/><text x="50%" y="50%" fill="#b79a63" font-family="Arial,sans-serif" font-size="34" letter-spacing="8" text-anchor="middle">LUXE STUDIO</text></svg>';
const fallbackSrc = 'data:image/svg+xml;utf8,' + encodeURIComponent(fallbackSvg);
document.addEventListener('error', e => {
  if (e.target.tagName === 'IMG' && !e.target.dataset.failed) {
    e.target.dataset.failed = '1';
    // La imagen principal no usa recuadro de respaldo: queda el fondo azul del hero
    if (e.target.dataset.nofallback) e.target.style.visibility = 'hidden';
    else e.target.src = fallbackSrc;
  }
}, true);
window.addEventListener('load', () => { // imágenes que fallaron antes de que este script cargara
  $$('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0 && !img.dataset.failed) img.dispatchEvent(new Event('error'));
  });
});

/* ---------- 5. SERVICIOS Y GALERÍA: RENDER ---------- */
function renderServices() {
  $('#serviceGrid').innerHTML = SERVICES.map(s => `
    <article class="card">
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.desc)}</p>
      <div class="card__foot">
        <div class="price">${fmt(s.price)}<small>${esc(s.note)}</small></div>
        <button type="button" class="btn btn--line" data-book="${s.id}" aria-label="Reservar ${esc(s.name)}">Reservar</button>
      </div>
    </article>`).join('');
}

const galleryUrl = (g, big) => g.src || demoUrl(g.demoId, big ? 1400 : 700, big ? 0 : 700);

function renderGallery() {
  $('#gallery').innerHTML = GALLERY.map((g, i) => `
    <button type="button" class="shot ${g.size ? 'shot--' + g.size : ''}" data-shot="${i}" aria-label="Ampliar foto: ${esc(g.alt)}">
      <img src="${galleryUrl(g, false)}" alt="${esc(g.alt)}" loading="lazy" width="700" height="700">
    </button>`).join('');
}

/* ---------- 6. SISTEMA DE TURNOS ---------- */
const form = $('#bookForm');
const f = {
  service: $('#service'), date: $('#date'), time: $('#time'),
  name: $('#name'), phone: $('#phone')
};
const touched = new Set(); // campos que la persona ya tocó (para mostrar sus errores)

function fillServiceOptions() {
  f.service.innerHTML = '<option value="">Elegí un servicio</option>' +
    SERVICES.map(s => `<option value="${s.id}">${esc(s.name)} (${fmt(s.price)})</option>`).join('');
}

// Fecha: no permite días pasados ni más allá del máximo configurado
function setupDateLimits() {
  const today = new Date();
  const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + CONFIG.booking.maxDaysAhead);
  f.date.min = isoDate(today);
  f.date.max = isoDate(max);
}

// Horas: si la fecha es hoy, se deshabilitan las que ya pasaron
function fillTimeOptions() {
  const b = CONFIG.booking;
  const prev = f.time.value;
  const isToday = f.date.value === isoDate(new Date());
  const now = new Date();
  const limit = now.getHours() * 60 + now.getMinutes() + b.minNoticeMinutes;
  let html = '<option value="">Elegí una hora</option>';
  for (let m = toMinutes(b.firstSlot); m <= toMinutes(b.lastSlot); m += b.slotMinutes) {
    const label = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    const disabled = isToday && m < limit;
    html += `<option value="${label}"${disabled ? ' disabled' : ''}>${label}${disabled ? ' (no disponible)' : ''}</option>`;
  }
  f.time.innerHTML = html;
  if ([...f.time.options].some(o => o.value === prev && !o.disabled)) f.time.value = prev;
}

const cleanPhone = v => v.replace(/[\s().+-]/g, '');

// Cada validación devuelve un mensaje de error, o '' si el campo está bien
const validators = {
  service() {
    return f.service.value ? '' : 'Elegí un servicio.';
  },
  date() {
    const v = f.date.value;
    if (!v) return 'Elegí una fecha.';
    if (v < isoDate(new Date())) return 'No se puede reservar en una fecha pasada.';
    if (v > f.date.max) return 'Elegí una fecha dentro de los próximos ' + CONFIG.booking.maxDaysAhead + ' días.';
    const [y, m, d] = v.split('-').map(Number);
    if (CONFIG.booking.closedWeekdays.includes(new Date(y, m - 1, d).getDay())) return 'Ese día el local está cerrado. Elegí otra fecha.';
    return '';
  },
  time() {
    const opt = f.time.selectedOptions[0];
    if (!f.time.value) return 'Elegí una hora.';
    if (opt && opt.disabled) return 'Esa hora ya pasó. Elegí otra.';
    return '';
  },
  name() {
    const v = f.name.value.trim();
    if (!v) return 'Escribí tu nombre.';
    if (!/^[\p{L}][\p{L}\s.'-]{1,59}$/u.test(v)) return 'Usá solo letras (mínimo 2).';
    return '';
  },
  phone() {
    const v = cleanPhone(f.phone.value);
    if (!v) return 'Escribí tu número de WhatsApp.';
    if (!/^\d{8,15}$/.test(v)) return 'Ingresá un número válido, solo con números (8 a 15 dígitos).';
    return '';
  }
};

function showError(key, msg) {
  $('#err-' + key).textContent = msg;
  f[key].closest('.field').classList.toggle('invalid', !!msg);
  f[key].setAttribute('aria-invalid', msg ? 'true' : 'false');
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function bookingMessage() {
  const s = SERVICES.find(x => x.id === f.service.value);
  return `Hola, quiero agendar un turno en ${CONFIG.businessName}. ` +
    `Servicio: ${s.name}. Fecha: ${formatDate(f.date.value)}. Hora: ${f.time.value}. ` +
    `Nombre: ${f.name.value.trim()}. Mi WhatsApp: ${f.phone.value.trim()}.`;
}

// Revisa todo el formulario. Muestra errores solo de campos tocados (o todos si showAll).
function refreshForm(showAll) {
  let allValid = true;
  Object.keys(validators).forEach(key => {
    const msg = validators[key]();
    if (msg) allValid = false;
    if (showAll || touched.has(key)) showError(key, msg);
  });

  const box = $('#confirmBox');
  box.hidden = !allValid;
  $('#checkBtn').hidden = allValid;
  if (allValid) {
    const s = SERVICES.find(x => x.id === f.service.value);
    $('#summary').textContent = `${s.name}, ${formatDate(f.date.value)} a las ${f.time.value}, a nombre de ${f.name.value.trim()}.`;
    $('#confirmBtn').href = waLink(bookingMessage());
  }
  return allValid;
}

function setupBooking() {
  fillServiceOptions();
  setupDateLimits();
  fillTimeOptions();

  Object.keys(f).forEach(key => {
    const ev = (key === 'service' || key === 'date' || key === 'time') ? 'change' : 'input';
    f[key].addEventListener(ev, () => {
      if (key === 'date') fillTimeOptions();
      touched.add(key);
      refreshForm(false);
    });
    f[key].addEventListener('blur', () => { touched.add(key); refreshForm(false); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (refreshForm(true)) {
      $('#confirmBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const firstBad = Object.keys(validators).find(k => validators[k]());
      f[firstBad].focus();
    }
  });
}

// Botón "Reservar" de cada servicio: lo elige en el formulario y baja hasta él
function chooseService(id) {
  f.service.value = id;
  touched.add('service');
  refreshForm(false);
  $('#turnos').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => f.date.focus({ preventScroll: true }), 600);
}

/* ---------- 7. DATOS DEL NEGOCIO EN LA PÁGINA ---------- */
function fillBusinessInfo() {
  const hello = `Hola, quiero hacer una consulta en ${CONFIG.businessName}.`;
  $$('.js-wa, #contactWa, #waText').forEach(a => {
    a.href = waLink(hello);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });
  const n = CONFIG.whatsapp;
  $('#waText').textContent = `+${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`.trim();

  $$('.js-ig').forEach(a => {
    a.href = CONFIG.instagramUrl;
    if (a.closest('.info')) a.textContent = '@' + CONFIG.instagramHandle;
  });

  $('#addrText').textContent = CONFIG.address;
  $('#hoursText').textContent = CONFIG.hoursText;
  $$('.js-addr').forEach(el => { el.textContent = CONFIG.address; });
  $$('.js-hours').forEach(el => { el.textContent = CONFIG.hoursText; });

  $('#routeBtn').href = CONFIG.mapsLink ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONFIG.mapsQuery)}`;

  if (CONFIG.heroImage) $('#heroImg').src = CONFIG.heroImage;
  if (CONFIG.aboutImage) $('#aboutImg').src = CONFIG.aboutImage;

  // Mapa de Google Maps
  const frame = document.createElement('iframe');
  frame.src = CONFIG.mapsEmbed ||
    `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapsQuery)}&z=15&output=embed`;
  frame.title = 'Mapa con la ubicación de ' + CONFIG.businessName;
  frame.loading = 'lazy';
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  frame.setAttribute('allowfullscreen', '');
  $('#mapBox').appendChild(frame);

  $('#year').textContent = new Date().getFullYear();
}

/* ---------- 8. MENÚ, VISOR DE GALERÍA Y ANIMACIONES ---------- */
function toggleMenu(open) {
  $('#menu').classList.toggle('open', open);
  $('#burger').setAttribute('aria-expanded', String(open));
  $('#burger').setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

const lightbox = $('#lightbox');
function openShot(i) {
  const g = GALLERY[i];
  $('#lbImg').src = galleryUrl(g, true);
  $('#lbImg').alt = g.alt;
  if (typeof lightbox.showModal === 'function') lightbox.showModal();
}

// Animación suave al hacer scroll: se activa solo si el navegador lo soporta
function setupReveal() {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js');
  const targets = $$('.head, .card, .shot, .book__intro, .form, .about__fig, .about__text, .find__info, .map, .contact > *');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach((el, idx) => {
    el.classList.add('reveal');
    el.style.setProperty('--i', el.matches('.card, .shot') ? idx % 3 : 0);
    io.observe(el);
  });
}

/* ---------- 9. EVENTOS ---------- */
document.addEventListener('click', e => {
  const book = e.target.closest('[data-book]');
  if (book) return chooseService(book.dataset.book);
  const shot = e.target.closest('[data-shot]');
  if (shot) openShot(+shot.dataset.shot);
});
$('#burger').addEventListener('click', () => toggleMenu(!$('#menu').classList.contains('open')));
$('#menu').addEventListener('click', e => { if (e.target.tagName === 'A') toggleMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });
$('#lbClose').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
window.addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', window.scrollY > 10), { passive: true });

/* ---------- 10. INICIO ---------- */
fillBusinessInfo();
renderServices();
renderGallery();
setupBooking();
setupReveal();
