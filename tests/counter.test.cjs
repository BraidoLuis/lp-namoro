const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = vm.createContext({ Intl, Date });
vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/counter.js'), 'utf8'), context);
const diff = (start, now) => JSON.parse(JSON.stringify(context.calcDiff(new Date(start), new Date(now), 'America/Sao_Paulo')));

test('preserva a data do álbum e separa anos, meses, dias e horário', () => {
  assert.deepEqual(diff('2025-10-12T00:00:00-03:00', '2026-11-17T12:34:56-03:00'),
    { years: 1, months: 1, days: 5, hours: 12, minutes: 34, seconds: 56 });
});

test('datas futuras e o instante inicial não produzem valores negativos', () => {
  const zero = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  assert.deepEqual(diff('2025-10-12T00:00:00-03:00', '2025-10-11T23:59:59-03:00'), zero);
  assert.deepEqual(diff('2025-10-12T00:00:00-03:00', '2025-10-12T00:00:00-03:00'), zero);
});

test('fevereiro bissexto limita o aniversário ao último dia do mês', () => {
  assert.deepEqual(diff('2024-01-31T00:00:00-03:00', '2024-02-29T00:00:00-03:00'),
    { years: 0, months: 1, days: 0, hours: 0, minutes: 0, seconds: 0 });
});

test('fevereiro comum e março não geram dias negativos', () => {
  assert.deepEqual(diff('2025-01-31T00:00:00-03:00', '2025-03-01T00:00:00-03:00'),
    { years: 0, months: 1, days: 1, hours: 0, minutes: 0, seconds: 0 });
});

test('empresta dias, horas e minutos antes do próximo aniversário', () => {
  assert.deepEqual(diff('2025-12-12T10:30:45-03:00', '2026-01-12T09:29:44-03:00'),
    { years: 0, months: 0, days: 30, hours: 22, minutes: 58, seconds: 59 });
});

test('representações do mesmo instante em outros fusos dão o mesmo resultado', () => {
  assert.deepEqual(diff('2025-10-12T03:00:00Z', '2026-11-18T01:00:00+09:00'),
    diff('2025-10-12T00:00:00-03:00', '2026-11-17T13:00:00-03:00'));
});
