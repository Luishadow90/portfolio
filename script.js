/* =====================================================
   Helpers
===================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const setLocal = (k, v) => localStorage.setItem(k, v);
const getLocal = (k) => localStorage.getItem(k);

/* =====================================================
   Theme (Light/Dark)
===================================================== */
(() => {
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");

  // default: dark
  const savedTheme = getLocal("theme"); // "light" | "dark" | null

  const applyTheme = (theme) => {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      if (themeToggle) themeToggle.checked = true;
    } else {
      root.removeAttribute("data-theme");
      if (themeToggle) themeToggle.checked = false;
    }
    setLocal("theme", theme);
  };

  applyTheme(savedTheme === "light" ? "light" : "dark");

  themeToggle?.addEventListener("change", () => {
    applyTheme(themeToggle.checked ? "light" : "dark");
  });
})();

/* =====================================================
   Mobile menu
===================================================== */
(() => {
  const menuBtn = $("#menuBtn");
  const menu = $("#menu");

  menuBtn?.addEventListener("click", () => {
    const isOpen = menu?.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(!!isOpen));
  });

  $$("#menu a").forEach((a) => {
    a.addEventListener("click", () => {
      menu?.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
    });
  });
})();

/* =====================================================
   Year
===================================================== */
(() => {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

/* =====================================================
   Project filtering
===================================================== */
(() => {
  const filters = $$(".filter");
  const cards = $$(".card");

  const applyFilter = (f) => {
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const show = f === "all" || tags.includes(f);
      card.style.display = show ? "" : "none";
    });
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      applyFilter(btn.dataset.filter || "all");
    });
  });

  // default
  applyFilter("all");
})();

/* =====================================================
   Modal (Case Studies)
===================================================== */
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");
const modalClose = $("#modalClose");

/**
 * CASES: contenido bilingüe.
 * Nota: los números/impacto están agregados (NDA-friendly).
 */
const CASES = {
  kueski: {
    title: {
      es: "Kueski — SEO Growth (Fintech)",
      en: "Kueski — SEO Growth (Fintech)"
    },
    body: {
      es: `
        <p><strong>Contexto:</strong> adquisición orgánica para productos fintech (Kueski Cash / Kueski Pay).</p>
        <p><strong>Problema:</strong> crecer orgánico reduciendo fricción técnica en propiedades clave.</p>
        <p><strong>Acciones:</strong></p>
        <ul>
          <li>Auditorías técnicas (crawling/indexing), canónicos, redirects, estructura de URLs e internal linking.</li>
          <li>Research por intención (ToFu/MoFu/BoFu), briefs y seguimiento de performance.</li>
          <li>Experimentación en metadata y bloques de contenido para mejorar CTR.</li>
          <li>Dashboards (GA4/Looker/Ahrefs/Semrush) para stakeholders.</li>
        </ul>
        <p><strong>Impacto:</strong> +35% sessions QoQ · -40% crawl errors · +15% CTR.</p>
        <p class="muted tiny"><strong>Stack:</strong> GA4, GSC, Screaming Frog, Looker Studio, Ahrefs, Semrush.</p>
      `,
      en: `
        <p><strong>Context:</strong> organic acquisition for high-impact fintech products (Kueski Cash / Kueski Pay).</p>
        <p><strong>Problem:</strong> grow organic traffic while reducing technical friction across key properties.</p>
        <p><strong>Actions:</strong></p>
        <ul>
          <li>Technical audits (crawling/indexing), canonicals, redirects, URL structure & internal linking.</li>
          <li>Intent-based research (ToFu/MoFu/BoFu), content briefs, performance monitoring.</li>
          <li>Metadata/content experiments to improve CTR.</li>
          <li>Dashboards (GA4/Looker/Ahrefs/Semrush) for stakeholders.</li>
        </ul>
        <p><strong>Impact:</strong> +35% sessions QoQ · -40% crawl errors · +15% CTR.</p>
        <p class="muted tiny"><strong>Stack:</strong> GA4, GSC, Screaming Frog, Looker Studio, Ahrefs, Semrush.</p>
      `
    }
  },

  humanitas: {
    title: {
      es: "Universidad Humanitas — Indexación & CWV (Vue/Django)",
      en: "Universidad Humanitas — Indexation & CWV (Vue/Django)"
    },
    body: {
      es: `
        <p><strong>Contexto:</strong> plataformas en Vue.js y Django con retos de SEO técnico (SSR, indexación, performance).</p>
        <p><strong>Problema:</strong> problemas de crawling/indexación + CWV en propiedades críticas.</p>
        <p><strong>Acciones:</strong></p>
        <ul>
          <li>Diagnóstico y corrección de indexación/crawling, semantic HTML y metadatos (Open Graph / Schema).</li>
          <li>SSR/WPO para mejorar Core Web Vitals (LCP/INP/CLS) según el stack.</li>
          <li>SEO internacional (MX/CO): estructura, señales y consistencia de indexación.</li>
          <li>Plan de migración SEO-safe a WordPress (mapeo URLs + redirecciones).</li>
          <li>Implementación de tracking avanzado con GTM.</li>
        </ul>
        <p><strong>Resultado:</strong> mejoras en CWV y habilitación de indexación en secciones clave.</p>
        <p class="muted tiny"><strong>Stack:</strong> Vue, Django, GTM, GA4, GSC, Schema/OG.</p>
      `,
      en: `
        <p><strong>Context:</strong> Vue.js and Django platforms with advanced technical SEO challenges (SSR, indexation, performance).</p>
        <p><strong>Problem:</strong> crawling/indexation issues + CWV constraints on critical pages.</p>
        <p><strong>Actions:</strong></p>
        <ul>
          <li>Indexation/crawling diagnosis and fixes, semantic HTML & metadata (Open Graph / Schema).</li>
          <li>SSR/WPO improvements to optimize Core Web Vitals (LCP/INP/CLS) per stack constraints.</li>
          <li>International SEO (MX/CO): structure, signals and consistent indexing.</li>
          <li>SEO-safe migration plan to WordPress (URL mapping + redirects).</li>
          <li>Advanced tracking implementation with GTM.</li>
        </ul>
        <p><strong>Outcome:</strong> CWV improvements and indexation enabled for key sections.</p>
        <p class="muted tiny"><strong>Stack:</strong> Vue, Django, GTM, GA4, GSC, Schema/OG.</p>
      `
    }
  },

  iqvia: {
    title: {
      es: "IQVIA — SharePoint & Journeys (MarTech)",
      en: "IQVIA — SharePoint & Journeys (MarTech)"
    },
    body: {
      es: `
        <p><strong>Contexto:</strong> operación y optimización de propiedades web para marketing multicanal (Pharma).</p>
        <p><strong>Enfoque:</strong> mejorar journeys y experiencia para reducir fricción y aumentar conversiones.</p>
        <p><strong>Acciones:</strong></p>
        <ul>
          <li>Gestión y optimización de sitios en SharePoint (arquitectura, contenido, UX).</li>
          <li>Detección de cuellos de botella en landings/funnels con enfoque data-driven.</li>
          <li>Soporte a campañas de Email Marketing (Salesforce Marketing Cloud).</li>
          <li>Propuesta de dashboards (Power BI) para reporting ejecutivo.</li>
        </ul>
        <p class="muted tiny"><strong>Stack:</strong> SharePoint, SFMC, Power BI, GA4/GTM (según iniciativa).</p>
      `,
      en: `
        <p><strong>Context:</strong> operating and optimizing web properties for multichannel marketing (Pharma).</p>
        <p><strong>Focus:</strong> improve journeys and UX to reduce friction and increase conversions.</p>
        <p><strong>Actions:</strong></p>
        <ul>
          <li>SharePoint sites management and optimization (architecture, content, UX).</li>
          <li>Identify bottlenecks in landing pages/funnels with a data-driven approach.</li>
          <li>Email marketing support (Salesforce Marketing Cloud).</li>
          <li>Executive reporting dashboards proposal (Power BI).</li>
        </ul>
        <p class="muted tiny"><strong>Stack:</strong> SharePoint, SFMC, Power BI, GA4/GTM (depending on initiative).</p>
      `
    }
  },

  accenture: {
    title: {
      es: "Accenture — Web Delivery (WP VIP / Drupal 9)",
      en: "Accenture — Web Delivery (WP VIP / Drupal 9)"
    },
    body: {
      es: `
        <p><strong>Contexto:</strong> delivery enterprise en equipos Agile/Scrum para sitios de alto tráfico.</p>
        <p><strong>Acciones:</strong></p>
        <ul>
          <li>Frontend con WordPress VIP, Drupal 9, Twig y SASS.</li>
          <li>Ownership técnico: componentes, data layers, performance testing y accesibilidad.</li>
          <li>QA y soporte a experimentación/A-B testing en páginas de marketing.</li>
        </ul>
        <p class="muted tiny"><strong>Stack:</strong> WordPress VIP, Drupal 9, Twig, SASS, A11y, performance.</p>
      `,
      en: `
        <p><strong>Context:</strong> enterprise delivery in Agile/Scrum teams for high-traffic websites.</p>
        <p><strong>Actions:</strong></p>
        <ul>
          <li>Frontend development with WordPress VIP, Drupal 9, Twig and SASS.</li>
          <li>Technical ownership: components, data layers, performance testing and accessibility.</li>
          <li>QA and support for experimentation/A-B testing on marketing pages.</li>
        </ul>
        <p class="muted tiny"><strong>Stack:</strong> WordPress VIP, Drupal 9, Twig, SASS, A11y, performance.</p>
      `
    }
  }
};

(() => {
  const openModal = (key) => {
    const data = CASES[key];
    if (!data || !modal || !modalTitle || !modalBody) return;

    const lang = getLocal("lang") === "en" ? "en" : "es";

    modalTitle.textContent = data.title[lang] || data.title.es;
    modalBody.innerHTML = data.body[lang] || data.body.es;

    modal.showModal();
  };

  $$("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.modal;
      if (key) openModal(key);
    });
  });

  modalClose?.addEventListener("click", () => modal?.close());

  modal?.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const inDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right;

    if (!inDialog) modal.close();
  });
})();

/* =====================================================
   Contact form -> mailto
===================================================== */
(() => {
  const form = $("#contactForm");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio contact — ${name}`);
    const body = encodeURIComponent(
`Hola Luis,

Soy ${name} (${email}).

${message}

Gracias,
${name}`
    );

    window.location.href = `mailto:lrc.luis.hernandez@gmail.com?subject=${subject}&body=${body}`;
  });
})();

/* =====================================================
   Floating actions: Back to top + WhatsApp
===================================================== */
(() => {
  // Back to top
  const toTopBtn = $("#toTop");

  const toggleToTop = () => {
    if (!toTopBtn) return;
    if (window.scrollY > 450) toTopBtn.classList.add("show");
    else toTopBtn.classList.remove("show");
  };

  window.addEventListener("scroll", toggleToTop, { passive: true });
  toggleToTop();

  toTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // WhatsApp
  const waFab = $("#waFab");
  const WHATSAPP_PHONE = "525546526028"; // internacional SIN "+" y SIN espacios
  const WHATSAPP_TEXT = encodeURIComponent("Hola Luis, vi tu portafolio y me gustaría contactarte.");

  if (waFab) {
    waFab.href = `https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_TEXT}`;
  }
})();

/* =====================================================
   Language switch (ES / EN)
===================================================== */
(() => {
  const translations = {
    es: {
      // hero
      hero_title: "Llevo SEO técnico y experiencias web a resultados medibles.",
      hero_sub:
        "SEO Specialist con enfoque en GA4/GSC, auditorías con Screaming Frog, performance (Core Web Vitals) y colaboración con UX/UI + producto + dev.",
      cta_cases: "Ver case studies",
      cta_contact: "Hablemos",

      // sections
      cases_title: "Case studies",
      cases_desc: "Menos “galería”, más evidencia. Abre cada caso para ver problema → acciones → impacto.",
      skills_title: "Skills (por áreas)",
      experience_title: "Experiencia",
      contact_title: "Contacto",

      // filters
      filter_all: "Todos",
      filter_seo: "SEO",
      filter_web: "Web",
      filter_analytics: "Analytics",
      filter_automation: "Automation"
    },

    en: {
      hero_title: "I turn technical SEO and web experiences into measurable results.",
      hero_sub:
        "SEO Specialist focused on GA4/GSC, Screaming Frog audits, performance (Core Web Vitals), and collaboration with UX/UI, product and dev teams.",
      cta_cases: "View case studies",
      cta_contact: "Let's talk",

      cases_title: "Case studies",
      cases_desc: "Less gallery, more evidence. Open each case to see problem → actions → impact.",
      skills_title: "Skills (by area)",
      experience_title: "Experience",
      contact_title: "Contact",

      filter_all: "All",
      filter_seo: "SEO",
      filter_web: "Web",
      filter_analytics: "Analytics",
      filter_automation: "Automation"
    }
  };

  const langToggle = $("#langToggle");
  let currentLang = getLocal("lang") === "en" ? "en" : "es";

  const applyLanguage = (lang) => {
    const dict = translations[lang] || translations.es;

    // translate nodes with data-i18n
    $$("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (key && dict[key]) el.textContent = dict[key];
    });

    // update html lang attribute
    document.documentElement.lang = lang;

    // update filter labels (optional but pro)
    $$(".filter").forEach((btn) => {
      const f = btn.dataset.filter;
      if (!f) return;
      const key = `filter_${f}`;
      if (dict[key]) btn.textContent = dict[key];
    });

    // persist
    setLocal("lang", lang);
  };

  // initialize always
  window.applyLanguage = applyLanguage;
  applyLanguage(currentLang);

  // toggle click
  langToggle?.addEventListener("click", () => {
    currentLang = currentLang === "es" ? "en" : "es";
    applyLanguage(currentLang);
  });
})();

/* =====================================================
   Case badge label (Data/SEO/Web/MarTech)
===================================================== */
(() => {
  $$(".card").forEach((card) => {
    const tags = (card.dataset.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const badge = $(".case-badge", card);
    if (!badge) return;

    if (tags.includes("automation")) badge.textContent = "MarTech";
    else if (tags.includes("analytics")) badge.textContent = "Data";
    else if (tags.includes("seo")) badge.textContent = "SEO";
    else if (tags.includes("web")) badge.textContent = "Web";
  });
})();
// =====================================================
// FIX: evita doble listener en #langToggle (ES/EN)
// Colócalo AL FINAL de tu script.js
// =====================================================
(() => {
  const btn = document.getElementById("langToggle");
  if (!btn || !btn.parentNode) return;

  // 1) Clonar y reemplazar el botón para "resetear" listeners previos
  const cleanBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(cleanBtn, btn);

  // 2) Re-asignar listener único
  cleanBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Alterna idioma y vuelve a aplicar (usa localStorage como fuente)
    const current = localStorage.getItem("lang") === "en" ? "en" : "es";
    const next = current === "es" ? "en" : "es";
    localStorage.setItem("lang", next);

    // Dispara un "storage-like refresh" recargando traducciones:
    // Si tu applyLanguage(lang) está en scope global, úsalo:
    if (typeof window.applyLanguage === "function") {
      window.applyLanguage(next);
      return;
    }

    // Si applyLanguage NO es global, fallback: recarga ligera
    // (no rompe nada y aplica el idioma desde tu init al cargar)
    location.reload();
  });
})();
