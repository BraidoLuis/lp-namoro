document.title = siteConfig.pageTitle;
document.getElementById('main-title').textContent = siteConfig.title;
document.getElementById('subtitle').textContent = siteConfig.subtitle;
document.querySelector('#moreText p').textContent = siteConfig.message;
document.querySelector('.spotify-wrapper-dramatic iframe').src = siteConfig.spotifyEmbedUrl;

// 👉 Coloque aqui a data que vocês começaram a namorar
const startDate = new Date(siteConfig.startDate);

function calcDiff(start, now) {
  if (now <= start)
    return {years:0, months:0, days:0, hours:0, minutes:0, seconds:0};

  let y = now.getFullYear() - start.getFullYear();
  let m = now.getMonth() - start.getMonth();
  let d = now.getDate() - start.getDate();
  let H = now.getHours() - start.getHours();
  let M = now.getMinutes() - start.getMinutes();
  let S = now.getSeconds() - start.getSeconds();

  if (S < 0) { S += 60; M--; }
  if (M < 0) { M += 60; H--; }
  if (H < 0) { H += 24; d--; }

  if (d < 0) {
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    d += prevMonthDays;
    m--;
  }

  if (m < 0) { m += 12; y--; }

  return {years:y, months:m, days:d, hours:H, minutes:M, seconds:S};
}

function updateCounter() {
  const now = new Date();
  const diff = calcDiff(startDate, now);

  document.getElementById('years').textContent = diff.years;
  document.getElementById('months').textContent = diff.months;
  document.getElementById('days').textContent = diff.days;
  document.getElementById('hours').textContent = String(diff.hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(diff.minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(diff.seconds).padStart(2,'0');
}

updateCounter();
setInterval(updateCounter, 1000);

// --------- PARTÍCULAS EXPLODINDO DO BOTÃO ------------

const btn = document.getElementById("enterBtn");

function spawnParticle() {

  const p = document.createElement("div");
  p.classList.add("particle");

  const btnRect = btn.getBoundingClientRect();

  const startX = Math.random() * btnRect.width;
  const startY = Math.random() * btnRect.height;

  p.style.left = `${startX}px`;
  p.style.top = `${startY}px`;

  const angle = Math.random() * Math.PI * 2;
  const distance = 60 + Math.random() * 40;

  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;

  p.style.setProperty("--tx", `${tx}px`);
  p.style.setProperty("--ty", `${ty}px`);

  btn.appendChild(p);

  setTimeout(() => p.remove(), 1400);
}

setInterval(spawnParticle, 50);
// Carrossel independente de bibliotecas externas.
const album = createCarousel(siteConfig.media, siteConfig.photoDuration);
let entered = false;
btn.addEventListener('click', () => {
  if (entered) return;
  entered = true;
  const overlay = document.getElementById('overlay');
  overlay.classList.add('hide');
  setTimeout(() => {
    overlay.hidden = true;
    album.start();
    document.getElementById('main-title').focus();
  }, 700);
});
