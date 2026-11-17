'use strict';

// Compara datas do calendário no fuso do álbum, independentemente do visitante.
function calcDiff(start, now, timeZone) {
  const empty = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  if (now <= start) return empty;
  const format = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23'
  });
  function wallTime(date) {
    const parts = Object.fromEntries(format.formatToParts(date).map(p => [p.type, p.value]));
    return new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second));
  }
  const initial = wallTime(start);
  const current = wallTime(now);
  let months = (current.getUTCFullYear() - initial.getUTCFullYear()) * 12 + current.getUTCMonth() - initial.getUTCMonth();
  function anniversary(offset) {
    const month = initial.getUTCMonth() + offset;
    const lastDay = new Date(Date.UTC(initial.getUTCFullYear(), month + 1, 0)).getUTCDate();
    return new Date(Date.UTC(initial.getUTCFullYear(), month, Math.min(initial.getUTCDate(), lastDay), initial.getUTCHours(), initial.getUTCMinutes(), initial.getUTCSeconds()));
  }
  if (anniversary(months) > current) months--;
  let remaining = Math.floor((current - anniversary(months)) / 1000);
  const days = Math.floor(remaining / 86400);
  remaining %= 86400;
  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;
  return { years: Math.floor(months / 12), months: months % 12, days, hours, minutes: Math.floor(remaining / 60), seconds: remaining % 60 };
}

function startCounter(config) {
  const start = new Date(config.startDate);
  let timer;
  function update() {
    const diff = calcDiff(start, new Date(), config.timeZone);
    Object.entries(diff).forEach(([unit, value]) => {
      document.getElementById(unit).textContent = ['hours', 'minutes', 'seconds'].includes(unit) ? String(value).padStart(2, '0') : value;
    });
  }
  function sync() {
    clearInterval(timer);
    if (!document.hidden) {
      update();
      timer = setInterval(update, 1000);
    }
  }
  document.addEventListener('visibilitychange', sync);
  sync();
}
