'use strict';

document.title = siteConfig.pageTitle;
document.getElementById('main-title').textContent = siteConfig.title;
document.getElementById('subtitle').textContent = siteConfig.subtitle;
document.querySelector('#moreText p').textContent = siteConfig.message;
startCounter(siteConfig);

const album = createCarousel(siteConfig.media, siteConfig.photoDuration);
const btn = document.getElementById('enterBtn');
const overlay = document.getElementById('overlay');
const content = document.querySelector('main');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let entered = false;
let particleTimer;

function spawnParticle() {
  const particle = document.createElement('span');
  particle.className = 'particle';
  particle.setAttribute('aria-hidden', 'true');
  particle.style.left = `${Math.random() * btn.clientWidth}px`;
  particle.style.top = `${Math.random() * btn.clientHeight}px`;
  const angle = Math.random() * Math.PI * 2;
  const distance = 60 + Math.random() * 40;
  particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
  particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
  btn.appendChild(particle);
  particle.addEventListener('animationend', () => particle.remove(), { once: true });
}

function syncParticles() {
  clearInterval(particleTimer);
  if (!entered && !document.hidden && !motion.matches) {
    particleTimer = setInterval(spawnParticle, 50);
  } else {
    btn.querySelectorAll('.particle').forEach(particle => particle.remove());
  }
}

overlay.hidden = false;
content.inert = true;
document.body.classList.add('entering');
btn.focus({ focusVisible: false });
syncParticles();
document.addEventListener('visibilitychange', syncParticles);
motion.addEventListener('change', syncParticles);

btn.addEventListener('click', () => {
  if (entered) return;
  entered = true;
  syncParticles();
  overlay.classList.add('hide');
  document.getElementById('spotify-player').src = siteConfig.spotifyEmbedUrl;
  setTimeout(() => {
    overlay.hidden = true;
    content.inert = false;
    document.body.classList.remove('entering');
    album.start();
    document.getElementById('main-title').focus({ preventScroll: true, focusVisible: false });
  }, motion.matches ? 0 : 700);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Tab') document.body.classList.add('keyboard-navigation');
});
document.addEventListener('pointerdown', () => document.body.classList.remove('keyboard-navigation'));
