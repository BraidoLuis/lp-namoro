'use strict';

function createCarousel(media, photoDuration) {
  const root = document.getElementById('carousel');
  const stage = document.createElement('div');
  stage.className = 'carousel-stage';
  const slides = [];
  let current = 0;
  let started = false;
  let visible = true;
  let timer;
  let transition;
  let busy = false;
  let requested = 0;

  const status = document.createElement('p');
  status.className = 'carousel-status';
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');

  function button(label, text, className, action) {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = className;
    element.setAttribute('aria-label', label);
    element.textContent = text;
    element.addEventListener('click', action);
    return element;
  }

  const previous = button('Memória anterior', '◀', 'btn prev', () => show(requested - 1, true));
  const next = button('Próxima memória', '▶', 'btn next', () => show(requested + 1, true));

  media.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.id = `memory-${index + 1}`;
    slide.hidden = index !== current;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Memória ${index + 1} de ${media.length}`);
    const isVideo = item.type === 'video';
    const element = document.createElement(isVideo ? 'video' : 'img');
    element.dataset.src = item.src;
    if (isVideo) {
      element.className = 'slide-video';
      element.muted = true;
      element.playsInline = true;
      element.controls = true;
      element.preload = 'none';
      element.setAttribute('aria-label', item.alt);
      element.addEventListener('ended', () => {
        if (index === current && canPlay()) show(current + 1);
      });
      element.addEventListener('error', () => {
        if (index === current) status.textContent = 'Não foi possível carregar o vídeo. Você pode seguir para a próxima memória.';
      });
      const fallback = document.createElement('a');
      fallback.href = item.src;
      fallback.textContent = 'Abrir vídeo';
      element.appendChild(fallback);
    } else {
      element.className = 'slide-img';
      element.alt = item.alt;
      element.width = item.width;
      element.height = item.height;
      element.decoding = 'async';
      element.draggable = false;
      element.loading = index === 0 ? 'eager' : 'lazy';
      if (index === 0) element.fetchPriority = 'high';
    }
    slide.appendChild(element);
    stage.appendChild(slide);
    slides.push(slide);
  });

  stage.append(previous, next);
  root.append(stage, status);
  root.addEventListener('keydown', event => {
    // Preserve os atalhos nativos do player de vídeo.
    if (event.target.tagName === 'VIDEO') return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(requested + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  let gesture;
  stage.addEventListener('pointerdown', event => {
    if (event.target.closest('button, video') || !event.isPrimary) return;
    gesture = { x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointerup', event => {
    if (!gesture) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 60) show(requested + (dx < 0 ? 1 : -1), true);
  });
  stage.addEventListener('pointercancel', () => { gesture = null; });
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: 0.15 }).observe(stage);
  }

  function canPlay() {
    return started && !document.hidden && visible;
  }

  function load(index) {
    const element = slides[index].firstElementChild;
    if (element.tagName === 'IMG') element.loading = 'eager';
    if (!element.hasAttribute('src')) element.src = element.dataset.src;
    return element;
  }

  function syncPlayback() {
    clearTimeout(timer);
    const element = slides[current].firstElementChild;
    if (element.tagName === 'VIDEO') {
      if (canPlay()) {
        element.play().catch(() => {
          if (slides[current].firstElementChild === element && canPlay()) {
            status.textContent = 'Toque no botão de reprodução do vídeo para assistir.';
          }
        });
      } else element.pause();
    } else if (canPlay() && !busy) {
      timer = setTimeout(() => show(current + 1), photoDuration);
    }
  }

  async function show(index, announce = false) {
    requested = (index % slides.length + slides.length) % slides.length;
    if (busy) return;
    busy = true;
    clearTimeout(timer);
    const target = requested;
    const element = load(target);
    // Preserve a memória atual até a próxima imagem estar pronta para desenhar.
    if (element.tagName === 'IMG') {
      try { await element.decode(); } catch { /* O texto alternativo continua disponível. */ }
    }
    if (target !== requested) {
      busy = false;
      return show(requested, announce);
    }
    const previousIndex = current;
    const outgoing = slides[current].firstElementChild;
    if (outgoing.tagName === 'VIDEO') outgoing.pause();
    const changed = target !== current;
    current = target;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    if (element.tagName === 'VIDEO' && changed) element.currentTime = 0;
    const adjacent = (current + 1) % slides.length;
    if (media[adjacent].type !== 'video') load(adjacent);
    status.setAttribute('aria-live', announce ? 'polite' : 'off');
    status.textContent = 'Memória ' + (current + 1) + ' de ' + slides.length;
    const oldSlide = slides[previousIndex];
    const newSlide = slides[current];
    if (changed && started) {
      oldSlide.hidden = false;
      oldSlide.setAttribute('aria-hidden', 'true');
      oldSlide.classList.add('heart-outgoing');
      newSlide.classList.add('heart-incoming');
      transition = revealHeart(newSlide);
      if (transition) {
        try { await transition.finished; } catch { /* Finalize também se interrompida. */ }
      }
      oldSlide.hidden = true;
      oldSlide.removeAttribute('aria-hidden');
      oldSlide.classList.remove('heart-outgoing');
      newSlide.classList.remove('heart-incoming');
      transition = null;
    }
    busy = false;
    if (requested !== current) return show(requested, announce);
    syncPlayback();
  }

  show(0);
  return { start() { started = true; show(current); } };
}
