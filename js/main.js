// 👉 Coloque aqui a data que vocês começaram a namorar
const startDate = new Date('2025-10-12T00:00:00'); 
// exemplo — troque pela sua!

function calcDiff(start, now) {
  if (now <= start) 
    return {years:0, months:0, days:0, hours:0, minutes:0, seconds:0};

  let y = now.getFullYear() - start.getFullYear();
  let m = now.getMonth() - start.getMonth();
  let d = now.getDate() - start.getDate();
  let H = now.getHours() - start.getHours();
  let M = now.getMinutes() - start.getMinutes();
  let S = now.getSeconds() - start.getSeconds();

  // Ajustes quando os valores ficam negativos
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


/* CARROSSEL */
(function (){
  const slidesEl = document.getElementById('slides');
  const slides = slidesEl.children;
  const total = slides.length;
  let index = 0;

  const dotsContainer = document.getElementById('dots');

  function renderDots(){
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++){
      const d = document.createElement('div');
      d.className = 'dot';
      d.dataset.i = i;
      if (i === index) d.classList.add('active');
      d.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(d);
    }
  }

  function goTo(i){
    index = (i + total) % total;
    slidesEl.style.transform = `translateX(-${index * 100}%)`;
    renderDots();
  }

  document.getElementById('prevBtn').addEventListener('click', ()=> goTo(index - 1));
  document.getElementById('nextBtn').addEventListener('click', ()=> goTo(index + 1));

  renderDots();
  goTo(0);
})();

document.getElementById('enterBtn').addEventListener('click', () => {
  const overlay = document.getElementById('overlay');
  overlay.classList.add('hide');

  // some 1s depois (quando a animação termina)
  setTimeout(() => {
    overlay.style.display = "none";
  }, 600);
});

// --------- PARTÍCULAS EXPLODINDO DO BOTÃO ------------
const btn = document.getElementById("enterBtn");

function spawnParticle() {
  const p = document.createElement("div");
  p.classList.add("particle");

  const btnRect = btn.getBoundingClientRect();

  // posição inicial aleatória dentro do botão
  const startX = Math.random() * btnRect.width;
  const startY = Math.random() * btnRect.height;

  p.style.left = `${startX}px`;
  p.style.top = `${startY}px`;

  // Partículas saem em direção aleatória
  const angle = Math.random() * Math.PI * 2;
  const distance = 60 + Math.random() * 40;

  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;

  p.style.setProperty("--tx", `${tx}px`);
  p.style.setProperty("--ty", `${ty}px`);

  btn.appendChild(p);

  setTimeout(() => p.remove(), 1400);
}

// Criar partículas contínuas
setInterval(spawnParticle, 50);

