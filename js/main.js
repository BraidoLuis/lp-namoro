// 👉 Coloque aqui a data que vocês começaram a namorar
const startDate = new Date('2025-10-12T00:00:00'); 

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


// ---------------- CRIAR SLIDES ----------------

const midias = [
  "images/Amor1.jpg",
  "images/Amor2.jpg",
  "images/Amor3.jpg",
  "images/Amor4.jpg",
  "images/Amor5.jpeg",
  "images/Amor6.jpeg",
  "images/Amor7.jpeg",
  "images/Amor8.jpeg",
  "images/Amor9.jpeg",
  "images/Amor10.jpeg",
  "images/Amor11.jpeg",
  "images/Amor12.jpeg",
  "images/Amor13.jpeg",
  "images/Amor14.jpeg",
  "videos/Amor.mp4",
  "images/Amor15.jpeg"
];

const carousel = document.getElementById("carousel");

midias.forEach((src,i)=>{

  const slide = document.createElement("div");

  const ext = src.split('.').pop().toLowerCase();

  if(["mp4","webm","mov"].includes(ext)){

    const video = document.createElement("video");
    video.src = src;
    video.className = "slide-video";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.controls = false;

    slide.appendChild(video);

  }else{

    const img = document.createElement("img");
    img.src = src;
    img.className = "slide-img";

    slide.appendChild(img);

  }

  carousel.appendChild(slide);

});


// ---------------- FUNÇÃO QUE INICIA O SLICK ----------------

function iniciarCarousel(){

  const el = $('#carousel');

  if(el.hasClass('slick-initialized')){
    el.slick('unslick');
  }

  el.slick({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    fade: true,
    cssEase: 'ease-in-out',
    adaptiveHeight: true,

    prevArrow: '<button class="btn prev">◀</button>',
    nextArrow: '<button class="btn next">▶</button>',

    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  });

  setTimeout(()=>{
    el.slick('setPosition');
  },100);
}

// ---------------- BOTÃO DE ENTRADA ----------------

document.getElementById('enterBtn').addEventListener('click', () => {

  const overlay = document.getElementById('overlay');
  overlay.classList.add('hide');

  setTimeout(() => {

    overlay.style.display = "none";

    iniciarCarousel();

  }, 700);

});