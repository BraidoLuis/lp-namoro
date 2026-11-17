'use strict';

// Adaptação da malha contínua de HexBackdrop da LP profissional.
function createHeartBackground() {
  const field = document.createElement('div');
  field.className = 'heart-background';
  field.setAttribute('aria-hidden', 'true');
  const shape = 'M50 87C38 76 6 55 6 32C6 8 36 2 50 22C64 2 94 8 94 32C94 55 62 76 50 87Z';
  const centers = [[0, 0], [120, 0], [-60, 108], [60, 108], [180, 108]];
  const regions = [[12, 18], [50, 12], [87, 28], [16, 76], [55, 68], [90, 86]];
  const tiles = centers.map(([x, y]) => `<path d="${shape}" transform="translate(${x} ${y})"/>`).join('');
  let frame;
  function draw() {
    const width = innerWidth, height = innerHeight;
    field.innerHTML = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heart-relief" x2="1" y2="1"><stop stop-color="#ffd6e9"/><stop offset="1" stop-color="#9b5cff"/></linearGradient>
        <pattern id="heart-grid" width="240" height="216" patternUnits="userSpaceOnUse">${tiles}</pattern>
        ${regions.map(([x, y], i) => `<radialGradient id="heart-glow-${i}" cx="${x}%" cy="${y}%" r="38%"><stop stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient><mask id="heart-region-${i}"><rect width="100%" height="100%" fill="url(#heart-glow-${i})"/></mask>`).join('')}
      </defs>
      <rect class="heart-grid-base" width="100%" height="100%" fill="url(#heart-grid)"/>
      ${regions.map((_, i) => `<rect class="heart-grid-light" width="100%" height="100%" fill="url(#heart-grid)" mask="url(#heart-region-${i})" style="animation-delay:${-i * .325}s"/>`).join('')}
      ${regions.map(([x, y], i) => {
        const row = Math.round((height * y / 100 - 48) / 108);
        const offset = row % 2 ? 60 : 0;
        const column = Math.round((width * x / 100 - 50 - offset) / 120);
        return `<g transform="translate(${column * 120 + offset} ${row * 108})"><path class="heart-grid-rise" d="${shape}" fill="url(#heart-relief)" style="animation-delay:${-i * .325}s"/></g>`;
      }).join('')}
    </svg>`;
  }
  document.body.prepend(field);
  draw();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  });
  const sync = () => field.classList.toggle('is-paused', document.hidden);
  document.addEventListener('visibilitychange', sync);
  sync();
}

createHeartBackground();
