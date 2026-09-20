/* CCivics content-script entry point; analysis runs only on request. */
chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message.type !== 'CCIVICS_ANALYZE') return;
  if (!CCivics.source.supports()) { respond({ supported: false }); return; }
  CCivics.panel.open();
  respond({ supported: true });
});
