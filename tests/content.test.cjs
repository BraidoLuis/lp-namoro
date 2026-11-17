const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const config = vm.runInNewContext(fs.readFileSync(path.join(root, 'js/config.js'), 'utf8') + '\nsiteConfig;');

test('todas as mídias configuradas existem e não estão vazias', () => {
  for (const item of config.media) {
    assert.ok(fs.statSync(path.join(root, item.src)).size > 0, item.src);
    assert.ok(item.alt.trim(), `Descrição ausente: ${item.src}`);
    if (item.type !== 'video') assert.ok(item.width > 0 && item.height > 0, item.src);
  }
});

test('nenhuma foto ou vídeo do álbum ficou fora da configuração', () => {
  const files = ['images', 'videos'].flatMap(dir => fs.readdirSync(path.join(root, dir))
    .filter(file => /\.(jpe?g|mp4)$/i.test(file)).map(file => `${dir}/${file}`));
  assert.deepEqual([...config.media.map(item => item.src)].sort(), files.sort());
});

test('data, fuso e duração configurados são válidos', () => {
  assert.ok(Number.isFinite(new Date(config.startDate).getTime()));
  assert.match(config.startDate, /(?:Z|[+-]\d{2}:\d{2})$/);
  assert.doesNotThrow(() => new Intl.DateTimeFormat('pt-BR', { timeZone: config.timeZone }));
  assert.ok(Number.isFinite(config.photoDuration) && config.photoDuration > 0);
});
