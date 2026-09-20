/* CCivics activity-block extractor for the initial source. */
CCivics.extractor = (() => {
  const { clean, extractDates, extractTimes, firstDateAndTime, labeledLine, title } = CCivics.normalize;
  const ignored = value => CCivics.config.ignoredTitles.includes(clean(value).toLocaleLowerCase('ca'));
  const findTitle = block => {
    for (const selector of CCivics.config.titleSelectors) {
      const node = block.querySelector(selector);
      if (node && clean(node.textContent).length > 2) return title(node.textContent);
    }
    const link = block.querySelector('a');
    return link ? title(link.textContent) : '';
  };
  const candidateBlocks = root => [...root.querySelectorAll(CCivics.config.blockSelectors)].filter(block => {
    const text = clean(block.textContent); const heading = findTitle(block);
    return heading && text.length > 12 && text.length < 12000 && (extractDates(text).length || /inscrip|horari|dies?|sessions?|preu|€|gratu/i.test(text));
  }).filter(block => ![...block.children].some(child => {
    const childText = clean(child.textContent); return childText && childText === clean(block.textContent) && findTitle(child);
  }));
  const eventFromBlock = block => {
    const rawText = block.innerText || block.textContent;
    const text = clean(rawText);
    const activityTitle = findTitle(block);
    if (!activityTitle || ignored(activityTitle)) return null;
    const registrationLine = labeledLine(rawText, ['inscripcions?', 'matrícula']);
    const hasRelativeRegistration = /des de (?:quinze|\d+) dies abans/i.test(text);
    const registrationText = registrationLine || (hasRelativeRegistration ? rawText : '');
    const registration = firstDateAndTime(registrationText);
    const eventText = registrationLine ? rawText.replace(registrationLine, '') : rawText;
    const dates = extractDates(eventText);
    const times = extractTimes(eventText);
    const venueLine = labeledLine(rawText, ['lloc', 'espai', 'sala', 'centre']);
    const addressLine = labeledLine(rawText, ['adreça', 'adreca', 'carrer', 'av\.?']);
    const priceLine = labeledLine(rawText, ['preu', '€']);
    const sessionsLine = labeledLine(rawText, ['sessions?', 'dies?']);
    return { title: activityTitle, eventDate: dates[0] || null, startTime: times[0] || null, endTime: times[1] || null, registrationDate: registration.date, registrationTime: registration.time, venue: venueLine || null, address: addressLine || null, description: text, price: priceLine || null, sessions: sessionsLine || null, url: block.querySelector('a[href]')?.href || location.href, source: CCivics.source.name };
  };
  const detect = (root = document) => {
    const unique = new Map();
    candidateBlocks(root).forEach(block => { const event = eventFromBlock(block); if (event) unique.set(`${event.title}|${event.eventDate || ''}|${event.url}`, event); });
    return [...unique.values()];
  };
  return { detect, eventFromBlock, candidateBlocks };
})();
