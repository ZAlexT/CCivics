/* CCivics regression checks for date/time and title normalization. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {}, CCivics: {} }; context.window.window = context.window; context.window.CCivics = context.CCivics; vm.createContext(context);
vm.runInContext(fs.readFileSync('src/normalize.js', 'utf8'), context);
const { normalize } = context.window.CCivics;
assert.deepEqual([...normalize.extractDates('28/09/2026 i 1.10.26')], ['2026-09-28', '2026-10-01']);
assert.deepEqual([...normalize.extractTimes('a les 9:05, fins les 21h30')], ['09:05', '21:30']);
assert.equal(normalize.title('Concert de desembre: LE CHANT DES MUSES'), 'LE CHANT DES MUSES');
assert.equal(normalize.title('HOP Zona Nord 2026'), 'HOP Zona Nord 2026');
console.log('normalization checks passed');
