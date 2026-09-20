/* CCivics normalization helpers for independent activity blocks. */
CCivics.normalize = (() => {
  const clean = value => (value || '').replace(/\s+/g, ' ').trim();
  const lines = value => String(value || '').split(/[\r\n]+/).map(clean).filter(Boolean);
  const numericDatePattern = /\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})\b/g;
  const namedDatePattern = /\b(\d{1,2})\s+d['’]?(?:e\s+)?(gener|febrer|març|abril|maig|juny|juliol|agost|setembre|octubre|novembre|desembre|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s*(?:de\s+)?(\d{4})\b/gi;
  const months = { gener: 1, enero: 1, febrer: 2, febrero: 2, 'març': 3, marzo: 3, abril: 4, maig: 5, mayo: 5, juny: 6, junio: 6, juliol: 7, julio: 7, agost: 8, agosto: 8, setembre: 9, septiembre: 9, octubre: 10, novembre: 11, noviembre: 11, desembre: 12, diciembre: 12 };
  const timePattern = /\b([01]?\d|2[0-3])(?:(?:[:.]([0-5]\d))|\s*h(?:([0-5]\d))?)\b/gi;
  const isoDate = (day, month, rawYear) => { const year = String(rawYear).length === 2 ? `20${rawYear}` : rawYear; return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`; };
  const extractDates = text => {
    const dates = [];
    for (const match of clean(text).matchAll(numericDatePattern)) dates.push(isoDate(match[1], match[2], match[3]));
    for (const match of clean(text).matchAll(namedDatePattern)) dates.push(isoDate(match[1], months[match[2].toLocaleLowerCase('ca')], match[3]));
    return dates;
  };
  const extractTimes = text => [...clean(text).matchAll(timePattern)].map(match => `${match[1].padStart(2, '0')}:${match[2] || match[3] || '00'}`);
  const firstDateAndTime = text => ({ date: extractDates(text)[0] || null, time: extractTimes(text)[0] || null });
  const labeledLine = (text, labels) => lines(text).find(line => new RegExp(`\\b(${labels.join('|')})\\b`, 'i').test(line)) || '';
  const title = raw => clean(raw).replace(/^\s*(concert\s+(?:de\s+\w+|festa\s+major)\s*:\s*)/i, '').trim();
  return { clean, lines, extractDates, extractTimes, firstDateAndTime, labeledLine, title };
})();
