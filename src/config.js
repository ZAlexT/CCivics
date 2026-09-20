/* CCivics configuration: source-specific selectors and UI defaults. */
window.CCivics = window.CCivics || {};
CCivics.config = {
  storageKey: 'ccivics-settings',
  sourceName: 'inscripcionscc',
  ignoredTitles: ['noves inscripcions', 'tarifes reduïdes', "tallers d'hivern", 'tallers de primavera', 'tallers de tardor', "abans d'inscriure't", "normativa d'inscripcions", "reserva d'entrades", 'informació important'],
  blockSelectors: ['article', '.activitat', '.actividad', '.activity', '.curs', '.curso', '.taller', '.event', '.evento', '.resultat', '.resultado', '.item', 'li'],
  titleSelectors: ['h1', 'h2', 'h3', 'h4', '.titol', '.titulo', '.title', 'strong']
};
