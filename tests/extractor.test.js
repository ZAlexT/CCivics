/* CCivics extraction checks using isolated activity-block fixtures. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {}, CCivics: {}, location: { href: 'https://example.inscripcionscc.com/activity' } };
context.window.window = context.window; context.window.CCivics = context.CCivics; context.window.location = context.location; vm.createContext(context);
['src/config.js', 'src/normalize.js', 'src/source.js', 'src/extractor.js'].forEach(file => vm.runInContext(fs.readFileSync(file, 'utf8'), context));
const block = (heading, text) => ({ innerText: text, textContent: text, children: [], querySelector(selector) {
  if (['h1', 'h2', 'h3', 'h4'].includes(selector)) return { textContent: heading };
  if (selector === 'a[href]') return { href: 'https://example.inscripcionscc.com/detail' };
  return null;
} });
const concert = context.CCivics.extractor.eventFromBlock(block('Concert de desembre: LE CHANT DES MUSES', [
  'Inscripcions a partir del 28/09/2026 a les 10:00', 'Data: 02/10/2026', 'Horari: 19:00 - 20:30', 'Lloc: Auditori', 'Preu: 8 €'
].join('\n')));
assert.equal(concert.title, 'LE CHANT DES MUSES');
assert.equal(concert.registrationDate, '2026-09-28');
assert.equal(concert.registrationTime, '10:00');
assert.equal(concert.eventDate, '2026-10-02');
assert.equal(concert.startTime, '19:00');
assert.equal(concert.endTime, '20:30');
assert.equal(concert.venue, 'Lloc: Auditori');
const noRegistration = context.CCivics.extractor.eventFromBlock(block('HOP Zona Nord 2026', 'No cal fer inscripció\nData: 15/10/2026\nHorari: 18h30'));
assert.equal(noRegistration.registrationDate, null);
assert.equal(noRegistration.eventDate, '2026-10-15');
assert.equal(noRegistration.startTime, '18:30');
console.log('extractor checks passed');
