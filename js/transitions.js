'use strict';

// A mesma silhueta vetorial é usada na entrada e nas memórias.
function heartPoints(width, height, scale) {
  const radius = Math.hypot(width, height) * scale;
  return Array.from({ length: 100 }, (_, i) => {
    const t = i * Math.PI * 2 / 100;
    const x = 16 * Math.sin(t) ** 3;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - 2;
    return `${width / 2 + x / 16 * radius}px ${height / 2 + y / 16 * radius}px`;
  }).join(',');
}

function revealHeart(element, duration = 1100) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const { width, height } = element.getBoundingClientRect();
  return element.animate([
    { clipPath: `polygon(${heartPoints(width, height, 0)})` },
    { clipPath: `polygon(${heartPoints(width, height, 1.8)})` }
  ], { duration, easing: 'cubic-bezier(.4,0,.2,1)' });
}

function openHeartScreen(overlay) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();
  const ns = 'http://www.w3.org/2000/svg';
  const width = innerWidth, height = innerHeight;
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const defs = document.createElementNS(ns, 'defs');
  const mask = document.createElementNS(ns, 'mask');
  mask.id = 'entry-heart-mask';
  mask.setAttribute('maskUnits', 'userSpaceOnUse');
  mask.setAttribute('x', '0'); mask.setAttribute('y', '0');
  mask.setAttribute('width', width); mask.setAttribute('height', height);
  function rect(fill) {
    const r = document.createElementNS(ns, 'rect');
    r.setAttribute('width', width); r.setAttribute('height', height);
    r.setAttribute('fill', fill);
    return r;
  }
  const hole = document.createElementNS(ns, 'polygon');
  hole.setAttribute('points', heartPoints(width, height, 1.8).replaceAll('px', '').replaceAll(',', ' '));
  hole.setAttribute('fill', 'black');
  hole.style.transformOrigin = `${width / 2}px ${height / 2}px`;
  mask.append(rect('white'), hole);
  defs.append(mask);
  const cover = rect('#0a0014');
  cover.setAttribute('mask', 'url(#entry-heart-mask)');
  svg.append(defs, cover);
  overlay.append(svg);
  overlay.classList.add('heart-opening');
  const animation = hole.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], {
    duration: 1400, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards'
  });
  return animation.finished.finally(() => svg.remove());
}
