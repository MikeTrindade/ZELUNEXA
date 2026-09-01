(() => {
  'use strict';

  const CONFIG = Object.freeze({
    portalUrl: 'area-do-cliente.html',
    whatsappPrimary: '5511941273272',
    whatsappSecondary: '5515981544882',
  });

  const ATTRIBUTION_KEYS = Object.freeze([
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid',
    'fbclid',
  ]);

  const doc = document;
  const body = doc.body;
  const header = doc.querySelector('.site-header');
  const menuButton = doc.querySelector('.menu-toggle');
  const mobilePanel = doc.querySelector('.mobile-panel');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Correção isolada para os cards de etapas na Home em telas pequenas.
  // Não altera a versão desktop nem outros componentes do site.
  const mobileStepStyle = doc.createElement('style');
  mobileStepStyle.id = 'zelunexa-mobile-step-fix';
  mobileStepStyle.textContent = `
    @media (max-width: 640px) {
      .step-card {
        min-height: 0 !important;
        padding: 24px !important;
      }

      .step-card .step-number {
        position: static !important;
        width: 52px;
        height: 36px;
        display: inline-grid;
        place-items: center;
        margin: 0 0 18px !important;
        color: #075fd3 !important;
        background: rgba(0, 119, 255, 0.08);
        border: 1px solid rgba(0, 119, 255, 0.14);
        border-radius: 11px;
        font-family: Sora, Inter, sans-serif;
        font-size: 15px !important;
        font-weight: 800;
        line-height: 1;
      }

      .step-card h3 {
        margin-top: 0 !important;
        margin-bottom: 10px !important;
      }

      .step-card p {
        margin-bottom: 0;
      }
    }
  `;
  doc.head.appendChild(mobileStepStyle);

  mobilePanel?.setAttribute('aria-hidden', 'true');

  const encodeMessage = (message) => encodeURIComponent(message.trim());
  const whatsappUrl = (phone, message) => `https://wa.me/${phone}?text=${encodeMessage(message)}`;

  function safeStorageGet(key) {
    try {
      return window.sessionStorage.getItem(key) || window.localStorage.getItem(key) || '';
    } catch (_) {
      return '';
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
      window.localStorage.setItem(key, value);
    } catch (_) {}
  }

  function captureAttribution() {
    const params = new URLSearchParams(window.location.search);
    const data = {};

    ATTRIBUTION_KEYS.forEach((key) => {
      const incoming = String(params.get(key) || '').trim();
      if (incoming) safeStorageSet(`zelunexa_${key}`, incoming);
      const stored = incoming || safeStorageGet(`zelunexa_${key}`);
      if (stored) data[key] = stored;
    });

    if (!safeStorageGet('zelunexa_landing_page')) {
      safeStorageSet('zelunexa_landing_page', `${window.location.pathname}${window.location.search}`);
    }
    if (!safeStorageGet('zelunexa_first_referrer') && doc.referrer) {
      safeStorageSet('zelunexa_first_referrer', doc.referrer);
    }

    data.landing_page = safeStorageGet('zelunexa_landing_page');
    data.first_referrer = safeStorageGet('zelunexa_first_referrer');
    return data;
  }

  const attribution = captureAttribution();

  function trackEvent(name, properties = {}) {
    const payload = {
      ...properties,
      page_path: window.location.pathname,
      ...Object.fromEntries(
        Object.entries(attribution).filter(([key]) => key.startsWith('utm_'))
      ),
    };

    if (typeof window.va === 'function') {
      try { window.va('event', { name, data: payload }); } catch (_) {}
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...payload });
    window.dispatchEvent(new CustomEvent('zelunexa:analytics', { detail: { name, properties: payload } }));
  }

  function closeMenu({ returnFocus = false } = {}) {
    if (!menuButton || !mobilePanel) return;
    mobilePanel.classList.remove('open');
    mobilePanel.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    body.classList.remove('menu-open');
    if (returnFocus) menuButton.focus();
  }

  function openMenu() {
    if (!menuButton || !mobilePanel) return;
    mobilePanel.classList.add('open');
    mobilePanel.setAttribute('aria-hidden', 'false');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Fechar menu');
    body.classList.add('menu-open');
    mobilePanel.querySelector('a')?.focus();
  }

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  mobilePanel?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobilePanel?.classList.contains('open')) {
      closeMenu({ returnFocus: true });
    }
  });

  doc.addEventListener('click', (event) => {
    if (!mobilePanel?.classList.contains('open')) return;
    if (mobilePanel.contains(event.target) || menuButton?.contains(event.target)) return;
    closeMenu();
  });

  doc.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !mobilePanel?.classList.contains('open')) return;
    const focusable = [menuButton, ...mobilePanel.querySelectorAll('a, button:not([disabled])')].filter(Boolean);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && mobilePanel?.classList.contains('open')) closeMenu();
  }, { passive: true });

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  doc.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  doc.querySelectorAll('[data-portal-link]').forEach((link) => {
    if (!CONFIG.portalUrl) {
      link.hidden = true;
      return;
    }
    link.hidden = false;
    link.href = CONFIG.portalUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.addEventListener('click', () => trackEvent('area_cliente_click'));
  });

  doc.querySelectorAll('[data-wa-link]').forEach((link) => {
    const recipient = link.dataset.waRecipient === 'secondary'
      ? CONFIG.whatsappSecondary
      : CONFIG.whatsappPrimary;
    const message = link.dataset.waMessage || 'Olá, conheci a Zelunexa pelo site e gostaria de saber mais sobre as soluções.';
    link.href = whatsappUrl(recipient, message);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.addEventListener('click', () => {
      trackEvent('whatsapp_click', {
        recipient: link.dataset.waRecipient === 'secondary' ? 'bruno' : 'mike',
        link_text: String(link.textContent || '').trim().slice(0, 80),
      });
    });
  });

  doc.querySelectorAll('a[href*="contato.html"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('contato_cta_click', {
        link_text: String(link.textContent || '').trim().slice(0, 80),
      });
    });
  });

  doc.querySelectorAll('a[href*="monitor.html"]').forEach((link) => {
    link.addEventListener('click', () => trackEvent('monitor_cta_click'));
  });

  doc.querySelectorAll('a[href*="guia.html"]').forEach((link) => {
    link.addEventListener('click', () => trackEvent('guia_cta_click'));
  });

  const form = doc.querySelector('#lead-form');
  const formStatus = doc.querySelector('#form-status');

  if (form) {
    const interestSelect = form.querySelector('select[name="interesse"]');
    const interestParam = new URLSearchParams(window.location.search).get('interesse');
    const interestMap = {
      monitor: 'Zelunexa Monitor',
      guia: 'Zelunexa Guia',
      ambas: 'Monitor + Guia',
    };
    const desired = interestMap[String(interestParam || '').toLowerCase()];
    if (interestSelect && desired) interestSelect.value = desired;
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get('nome') || '').trim();
    const company = String(data.get('empresa') || '').trim();
    const phone = String(data.get('telefone') || '').trim();
    const email = String(data.get('email') || '').trim();
    const interest = String(data.get('interesse') || '').trim();
    const message = String(data.get('mensagem') || '').trim();
    const source = form.dataset.source || 'site institucional';

    const campaignSummary = ATTRIBUTION_KEYS
      .map((key) => attribution[key] ? `${key}: ${attribution[key]}` : '')
      .filter(Boolean)
      .join(' | ');

    const text = [
      'Olá, conheci a Zelunexa pelo site e gostaria de solicitar uma apresentação.',
      '',
      `Nome: ${name}`,
      `Empresa/empreendimento: ${company}`,
      `WhatsApp: ${phone}`,
      `E-mail: ${email}`,
      `Interesse: ${interest}`,
      message ? `Necessidade: ${message}` : '',
      `Origem: ${source}`,
      campaignSummary ? `Campanha: ${campaignSummary}` : '',
    ].filter(Boolean).join('\n');

    trackEvent('lead_form_submit', {
      interest,
      source,
      has_message: Boolean(message),
    });

    if (formStatus) {
      formStatus.textContent = 'Abrindo o WhatsApp com sua solicitação preenchida. Revise a mensagem e envie para concluir.';
      formStatus.className = 'form-status success';
    }

    const url = whatsappUrl(CONFIG.whatsappPrimary, text);
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) window.location.href = url;
  });

  const revealItems = [...doc.querySelectorAll('.reveal')];
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Math.min(Number(entry.target.dataset.delay || 0), 300);
        window.setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach((item) => observer.observe(item));
  }

  const motionVideos = [...doc.querySelectorAll('[data-autoplay-video]')];
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);

  function hydrateVideo(video) {
    if (video.dataset.hydrated === 'true') return;
    video.querySelectorAll('source[data-src]').forEach((source) => {
      source.src = source.dataset.src;
    });
    video.load();
    video.dataset.hydrated = 'true';
  }

  if (!reduceMotion.matches && !saveData && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          hydrateVideo(video);
          try { await video.play(); } catch (_) {}
        } else if (!video.paused) {
          video.pause();
        }
      });
    }, { threshold: 0.28, rootMargin: '180px 0px 180px' });
    motionVideos.forEach((video) => videoObserver.observe(video));
  }

  const heroImpactVideo = doc.querySelector('.hero-impact-video');
  if (heroImpactVideo) {
    if (reduceMotion.matches || saveData) {
      heroImpactVideo.pause();
      heroImpactVideo.removeAttribute('autoplay');
      heroImpactVideo.preload = 'metadata';
    } else {
      heroImpactVideo.muted = true;
      heroImpactVideo.play().catch(() => {});
    }
    doc.addEventListener('visibilitychange', () => {
      if (reduceMotion.matches || saveData) return;
      if (doc.hidden) heroImpactVideo.pause();
      else heroImpactVideo.play().catch(() => {});
    });
  }

  const heroVisual = doc.querySelector('[data-hero-tilt]');
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  if (heroVisual && finePointer && !reduceMotion.matches) {
    heroVisual.addEventListener('mousemove', (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.transform = `perspective(1200px) rotateY(${x * 2.6}deg) rotateX(${y * -2.1}deg)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      heroVisual.style.transform = '';
    });
  }
})();
