/* CCivics normalization helpers for independent activity blocks. */
CCivics.normalize = (() => {
  const clean = value => (value || '').replace(/\s+/g, ' ').trim();
  const lines = value => String(value || '').split(/[\r\n]+/).map(clean).filter(Boolean);
  const datePattern = /\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})\b/g;
  const timePattern = /\b([01]?\d|2[0-3])[:h.]([0-5]\d)\b/gi;
  const isoDate = (match) => { const [, d, m, rawYear] = match; const y = rawYear.length === 2 ? `20${rawYear}` : rawYear; return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`; };
  const extractDates = text => [...clean(text).matchAll(datePattern)].map(isoDate);
  const extractTimes = text => [...clean(text).matchAll(timePattern)].map(match => `${match[1].padStart(2, '0')}:${match[2]}`);
  const firstDateAndTime = text => ({ date: extractDates(text)[0] || null, time: extractTimes(text)[0] || null });
  const labeledLine = (text, labels) => lines(text).find(line => new RegExp(`\\b(${labels.join('|')})\\b`, 'i').test(line)) || '';
  const title = raw => clean(raw).replace(/^\s*(concert\s+(?:de\s+\w+|festa\s+major)\s*:\s*)/i, '').trim();
  return { clean, lines, extractDates, extractTimes, firstDateAndTime, labeledLine, title };
})();
